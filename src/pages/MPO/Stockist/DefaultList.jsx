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
import EditStockist from './EditStockist';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import {
    useGetAllStockistsQuery,
    useDeleteStockistsByIdMutation
} from "../../../api/MPOSlices/StockistSlice";
import Iconify from '@/components/iconify/Iconify';
import { useSelector } from 'react-redux';

const DefaultList = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

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

    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, [])

    const { data } = useGetAllStockistsQuery({
        id: parseInt(company_id),
        page: page,
        company_area: user_role === 'admin' ? "" : company_user_id
    });

    const [deleteStockist] = useDeleteStockistsByIdMutation();
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
                    {data && data?.results?.map((stockist, index) => (
                        <TableRow hover tabIndex={-1} role="checkbox" key={stockist.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell component="th" scope="row" align="left">
                                <Typography variant="subtitle2" noWrap>
                                    {stockist.stockist_name.stockist_name}
                                </Typography>
                            </TableCell>
                            <TableCell align="left">{stockist.stockist_name.stockist_contact_number}</TableCell>
                            <TableCell align="left">{stockist.stockist_name.stockist_address}</TableCell>
                            <TableCell align="left">{stockist.stockist_name.stockist_category}</TableCell>
                            {user_role === 'admin' && (
                                <>
                                    <TableCell align="left">
                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(stockist.stockist_name.id)} >
                                            <Badge>
                                                <Iconify icon="eva:edit-fill" />
                                            </Badge>
                                        </IconButton>
                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(stockist.id); handleClickOpen() }}>
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
                                            <Button autoFocus onClick={() => { deleteStockist(selectedId); handleClose() }}>
                                                Yes
                                            </Button>
                                            <Button onClick={handleClose} autoFocus>
                                                No
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                    {isDrawerOpen && <EditStockist
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

export default DefaultList;
