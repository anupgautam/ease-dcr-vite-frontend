import React, { useState, useCallback, useContext } from 'react';
import {
    Badge,
    Button,
    TableRow,
    TableCell,
    Typography,
    IconButton,
    Pagination,
    Box,
    Dialog,
    DialogTitle,
    DialogActions,
} from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EditDoctor from './EditDoctor';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Iconify from '@/components/iconify/Iconify';
import {
    useGetAllDoctorsQuery,
    useDeleteDoctorsByIdMutation
} from "../../../api/MPOSlices/DoctorSlice";
import { CookieContext } from '@/App'
import { decryptData } from '../User/excryption';
import { useLocation } from 'react-router-dom';

const DefaultList = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [selectedDivisionId, setSelectedDivisionId] = useState(null);
    const [openDialogue, setOpenDialogue] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDialogue(false);
    }, []);

    const localData = localStorage.getItem('user_login');
    console.log('localData', localData)

    const [page, setPage] = useState(1);

    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, [])

    const { data } = useGetAllDoctorsQuery({
        id: company_id,
        page: page,
        mpo_name: user_role === 'admin' ? "" : company_user_id
    });

    const [deleteDoctor] = useDeleteDoctorsByIdMutation();

    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7];

    const onEdit = (id, divisionId) => {
        setSelectedUpdateId(id);
        setSelectedDivisionId(divisionId);
        setIsDrawerOpen(true);
    }

    const onCloseDrawer = () => {
        setIsDrawerOpen(false);
    }

    return (
        <>
            {data === undefined ? (
                <>
                    {eightArrays.map((key) => (
                        <TableRow key={key}>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                        </TableRow>
                    ))}
                </>
            ) : (
                <>
                    {data && data.results.map((doc, index) => (
                        <TableRow hover tabIndex={-1} role="checkbox" key={doc?.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell component="th" scope="row" align="left">
                                <Typography variant="subtitle2" noWrap>
                                    {doc?.doctor_name?.doctor_name}
                                </Typography>
                            </TableCell>
                            <TableCell align="left">{doc?.doctor_name?.doctor_phone_number}</TableCell>
                            <TableCell align="left">{doc?.doctor_name?.doctor_address}</TableCell>
                            <TableCell align="left">{doc?.doctor_name?.doctor_qualification}</TableCell>
                            <TableCell align="left">{doc?.doctor_name?.doctor_specialization?.category_name}</TableCell>
                            <TableCell align="left">{doc?.doctor_name?.doctor_category}</TableCell>
                            {user_role === 'admin' && (
                                <>
                                    <TableCell align="left">
                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(doc.id, doc.doctor_name.id)} >
                                            <Badge>
                                                <Iconify icon="eva:edit-fill" />
                                            </Badge>
                                        </IconButton>
                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(doc.id); handleClickOpen() }}>
                                            <Badge>
                                                <Iconify icon="eva:trash-2-outline" />
                                            </Badge>
                                        </IconButton>
                                    </TableCell>
                                    <Dialog
                                        fullScreen={fullScreen}
                                        open={openDialogue}
                                        onClose={handleClose}
                                        aria-labelledby="responsive-dialog-title"
                                    >
                                        <DialogTitle id="responsive-dialog-title">
                                            {"Are you sure want to delete?"}
                                        </DialogTitle>
                                        <DialogActions>
                                            <Button autoFocus onClick={() => { deleteDoctor(selectedId); handleClose() }}>
                                                Yes
                                            </Button>
                                            <Button onClick={handleClose} autoFocus>
                                                No
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                    {isDrawerOpen &&
                                        <EditDoctor
                                            id={selectedUpdateId}
                                            onClose={onCloseDrawer}
                                            divisionId={selectedDivisionId}
                                        />
                                    }
                                </>
                            )}
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={6}>
                            <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                {data ? (
                                    <Pagination count={Math.ceil(data.count / 200)} page={page} onChange={handleChangePage} />
                                ) : (
                                    <Typography variant="body1">Loading...</Typography>
                                )}
                            </Box>
                        </TableCell>
                    </TableRow>
                </>
            )}
        </>
    );
}

export default React.memo(DefaultList);
