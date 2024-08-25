import React, { useState, useMemo, useCallback } from 'react';
import {
    Badge,
    Button,
    TableRow,
    TableCell,
    Typography,
    IconButton,
    Pagination,
    Box,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Iconify from '@/components/iconify/Iconify';
import {
    useGetAllSecondarySalesQuery,
    useDeleteSecondarySalesByIdMutation
} from "../../../../api/MPOSlices/SecondarySalesApiSlice";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import EditSecondarySales from './EditSecondarySales';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const TABLE_HEAD = [
    { id: 'product_name', label: 'Product Name', alignRight: false },
    { id: 'opening_stock', label: 'Op.St.', alignRight: false },
    { id: 'purchase', label: 'Purchase', alignRight: false },
    { id: 'sales_return', label: 'Sales Return', alignRight: false },
    { id: 'stockist_name', label: 'Stockist Name', alignRight: false },
    { id: 'year', label: 'Year', alignRight: false },
    { id: 'month', label: 'Month', alignRight: false },
    { id: 'total', label: 'Total', alignRight: false },
    { id: 'sales', label: 'Sales', alignRight: false },
    { id: 'free', label: 'Free', alignRight: false },
    { id: 'expiry_breakage', label: 'Ex/Br', alignRight: false },
    { id: 'closing_stock', label: 'Cl.St.', alignRight: false },
    { id: 'l_rate', label: 'L.Rate', alignRight: false },
    { id: 'st_value', label: 'St.Value', alignRight: false },
    { id: 'sl_value', label: 'Sl.Value', alignRight: false },
    // { id: 'status', label: 'Status', alignRight: false },
    { id: '' },
];

const DefaultList = () => {

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

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // ! Get all chemist wala
    const { data } = useGetAllSecondarySalesQuery(page);
    // 

    // !Delete chemists
    const [deleteSecondarySale] = useDeleteSecondarySalesByIdMutation()
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    return (
        <>
            {
                data === undefined ?
                    <>
                        {
                            eightArrays.map((key) => (
                                <TableRow key={key} >
                                    <TableCell></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                </TableRow>
                            ))}
                    </>
                    :
                    <>
                        {data && data?.results?.map((chem, index) => (
                            <>
                                <TableRow hover tabIndex={-1} key={chem.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell component="th" scope="row" align="left">
                                        <Typography variant="subtitle2" noWrap>
                                            {chem.chemist_name.chemist_name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left">{chem.chemist_name.chemist_phone_number}</TableCell>
                                    <TableCell align="left">{chem.chemist_name.chemist_address}</TableCell>
                                    <TableCell align="left">{chem.chemist_name.chemist_gender}</TableCell>
                                    <TableCell align="left">
                                        {/* {
                                    {/* //!Edit */}
                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(chem.chemist_name.id)}>
                                            <Badge>
                                                <Iconify icon="eva:edit-fill" />
                                            </Badge>
                                        </IconButton>
                                        {/*//! Delete  */}
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
                                            <Button autoFocus onClick={() => { deleteSecondarySale(selectedId); handleClose() }}>
                                                Yes
                                            </Button>
                                            <Button
                                                onClick={handleClose}
                                                autoFocus>
                                                No
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                    {isDrawerOpen && <EditSecondarySales
                                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                                    />
                                    }
                                </TableRow>
                            </>
                        ))
                        }
                        {/* //!pagination */}
                        <TableRow>
                            <TableCell colSpan={6}>
                                <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                    {data ? (
                                        <Pagination count={parseInt(data.count / 8) + 1} onChange={handleChangePage} />
                                    ) : (
                                        <Typography variant="body1">In Search</Typography>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    </>
            }
        </>
    );
}

export default React.memo(DefaultList);