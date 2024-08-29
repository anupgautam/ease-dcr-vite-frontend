import React, { useState, useCallback } from 'react';
// @mui
import {
    Card,
    Badge,
    Table,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/scrollbar';
import { UserListHead } from '@/sections/@dashboard/user';
import {
    useGetAllCompanyAreasQuery,
    useDeleteCompanyAreaByIdMutation
} from "../../../api/CompanySlices/companyAreaSlice";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import EditCompanyAreas from './EditCompanyAreas';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useSelector } from 'react-redux';

const TABLE_HEAD = [
    { id: 'company_name', label: 'Company Name', alignRight: false },
    { id: 'station_type', label: 'Station Type', alignRight: false },
    { id: '' },
];

const DefaultList = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [open, setOpen] = useState(false);

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    //! Dialogue

    const [openDialogue, setOpenDialogue] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true)
    }, [])

    const handleClose = useCallback(() => {
        setOpenDialogue(false)
    }, [])

    //! Get Company Area
    const { data } = useGetAllCompanyAreasQuery(company_id);

    // !Delete companyareaists
    const [deleteCompanyArea] = useDeleteCompanyAreaByIdMutation()
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    return (
        <>
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            <TableBody>
                                {
                                    data === undefined ?
                                        <>
                                            {
                                                eightArrays.map((key) => (
                                                    <TableRow key={key} >
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                    </TableRow>
                                                ))}
                                        </>
                                        :
                                        <>
                                            {data && data.map((companyarea, index) => (
                                                <TableRow hover tabIndex={-1} key={companyarea.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {companyarea.company_area}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">{companyarea.station_type}</TableCell>
                                                    <TableCell align="right">
                                                        {/* {
                                    {/* //!Edit */}
                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(companyarea.id)}>
                                                            <Badge>
                                                                <Iconify icon="eva:edit-fill" />
                                                            </Badge>
                                                        </IconButton>
                                                        {/*//! Delete  */}
                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(companyarea.id); handleClickOpen() }}>
                                                            <Badge>
                                                                <Iconify icon="eva:trash-2-outline" />
                                                            </Badge>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            }
                                        </>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>
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
                    <Button autoFocus onClick={() => { deleteCompanyArea(selectedId); handleClose() }}>
                        Yes
                    </Button>
                    <Button
                        onClick={handleClose}
                        autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            {isDrawerOpen && <EditCompanyAreas
                idharu={selectedUpdateId} onClose={onCloseDrawer}
            />
            }
        </>
    );
}

export default React.memo(DefaultList);