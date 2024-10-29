import React, { useState, useCallback } from 'react';
import {
    Typography,
    IconButton,
    TableCell,
    TableRow,
    Box,
    Pagination,
    Dialog,
    DialogTitle,
    DialogActions,
    Badge,
    Button
} from '@mui/material';
import Skeleton from 'react-loading-skeleton';
import EditChemist from './EditChemist';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Iconify from '@/components/iconify/Iconify';
import {
    useGetAllChemistsQuery,
    useDeleteChemistsByIdMutation
} from "../../../api/MPOSlices/ChemistSlice";
import { useSelector } from 'react-redux';

const DefaultList = () => {
    const { company_user_role_id, user_role, company_user_id, company_id } = useSelector((state) => state.cookie);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [openDialogue, setOpenDialogue] = useState(false);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDialogue(false);
    }, []);

    const [page, setPage] = useState(1);

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel;
        let thisArray = data.split(" ");
        setPage(thisArray[3]);
    }, [])

    const { data } = useGetAllChemistsQuery({
        id: company_user_role_id,
        mpo_name: user_role === 'admin' ? '' : company_user_role_id,
        page: page
    }, {
        skip: !company_user_role_id || !user_role
    });

    const [deleteChemist] = useDeleteChemistsByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7];

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);


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
                        </TableRow>
                    ))}
                </>
            ) : (
                <>
                    {data && data.results.map((chem, index) => (
                        <TableRow hover tabIndex={-1} key={chem.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell component="th" scope="row" align="left">
                                <Typography variant="subtitle2" noWrap>
                                    {chem.chemist_name.chemist_name}
                                </Typography>
                            </TableCell>
                            <TableCell align="left">{chem.chemist_name.chemist_phone_number}</TableCell>
                            <TableCell align="left">{chem.chemist_name.chemist_territory.area_name}</TableCell>
                            <TableCell align="left">{chem.chemist_name.chemist_category}</TableCell>
                            {/* <TableCell align="left">{chem.is_investment ? "Invested" : "Not Invested"}</TableCell> */}
                            {user_role === 'admin' && (
                                <>
                                    <TableCell align="left">
                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(chem.chemist_name.id)}>
                                            <Badge>
                                                <Iconify icon="eva:edit-fill" />
                                            </Badge>
                                        </IconButton>
                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(chem.id); handleClickOpen() }}>
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
                                            <Button autoFocus onClick={() => { deleteChemist(selectedId); handleClose() }}>
                                                Yes
                                            </Button>
                                            <Button onClick={handleClose} autoFocus>
                                                No
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                    {isDrawerOpen && <EditChemist
                                        idharu={selectedUpdateId}
                                        onClose={onCloseDrawer}
                                    />}
                                </>
                            )}
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell colSpan={6}>
                            <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                {data ? (
                                    <Pagination count={parseInt(data.count / 200) + 1} onChange={handleChangePage} />
                                ) : (
                                    <Typography variant="body1">In Search</Typography>
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
