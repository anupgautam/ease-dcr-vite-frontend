import React, { useState, useEffect, useCallback } from 'react';
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
    Pagination,
    Box,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Cookies from 'js-cookie'

import Scrollbar from '@/components/scrollbar/Scrollbar';
import { useDeleteStockistsAssignByIdMutation, useGetAllAssignStockistsQuery } from '@/api/MPOSlices/StockistSlice';


const TABLE_HEAD = [
    { id: 'stockist_name', label: 'Stockist Name', alignRight: false },
    { id: 'stockist_number', label: 'Stockist Number', alignRight: false },
    { id: 'stockist_address', label: 'Stockist Address', alignRight: false },
    { id: '' },
];

const DefaultAsignStockist = () => {

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [mpoId, setMPOId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [open, setOpen] = useState(false);


    const onEdit = useCallback((id, mpo_id) => {
        setSelectedUpdateId(id);
        setMPOId(mpo_id);
        setIsDrawerOpen(true);
    },[]);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    },[]);

    //! Dialogue 
    const [openDialogue, setOpenDialogue] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true)
    },[])

    const handleClose = useCallback(() => {
        setOpenDialogue(false)
    },[])

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    },[])

    const { data } = useGetAllAssignStockistsQuery({ id: Cookies.get("company_id"), page: page, company_area: "", mpo_name: "" });

    const [deleteDoctorEvents] = useDeleteStockistsAssignByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    //! Date format
    const [dateFormat, setDateFormat] = useState("");
    const [actualDate, setActualDate] = useState("");
    useEffect(() => {
        if (data && data.length > 0) {
            const { submission_date } = data[0].application_id;
            setDateFormat(submission_date);
        }
    }, [data]);

    useEffect(() => {
        if (dateFormat) {
            const date = new Date(dateFormat);
            const formattedDate = date.toISOString().split("T")[0];
            setActualDate(formattedDate)
        }
    }, [dateFormat]);

    // 

    //! True false 
    let labelColor = '';
    let labelText = '';

    if (data && data.length > 0) {
        labelColor = 'success';
        labelText = 'True';
    } else {
        labelColor = 'error';
        labelText = 'False';
    }

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
                                <>
                                    {
                                        data === undefined ? <>
                                            {
                                                eightArrays.map((key) => (
                                                    <TableRow id={key} >
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>{data.results && data.results.map((doctorevent, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={doctorevent.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {doctorevent.stockist_name.stockist_name.stockist_name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">{doctorevent.stockist_name.stockist_name.stockist_contact_number}</TableCell>
                                                    <TableCell align="left">{doctorevent.stockist_name.stockist_name.stockist_address}</TableCell>
                                                    {/*//! Delete  */}
                                                    <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(doctorevent.id); handleClickOpen() }}>
                                                        <Badge>
                                                            <Iconify icon="eva:trash-2-outline" />
                                                        </Badge>
                                                    </IconButton>
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
                                                            <Button autoFocus onClick={() => { deleteDoctorEvents(selectedId); handleClose() }}>
                                                                Yes
                                                            </Button>
                                                            <Button
                                                                onClick={handleClose}
                                                                autoFocus>
                                                                No
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </TableRow>
                                            ))
                                            }
                                            </>}
                                </>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box justifyContent={'center'} alignItems='center' display={'flex'}
                        sx={{ margin: "20px 0px" }} >
                        {data ?
                            <Pagination
                                count={parseInt(data.count / 30) + 1}
                                onChange={handleChangePage}
                            /> : <></>}
                    </Box>
                </Scrollbar>

                {/* //!pagination */}
            </Card>
        </>
    )
}

export default React.memo(DefaultAsignStockist);