import React, { useState, useCallback } from 'react';
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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Cookies from 'js-cookie'

import { useGetHolidayAreasQuery, useDeleteHolidayAreasByIdMutation } from '@/api/HolidaySlices/holidaySlices';

import EditHolidayArea from './EditHolidayArea';

const TABLE_HEAD = [
    { id: 'holiday_type', label: 'Holiday Type', alignRight: false },
    { id: 'company_area', label: 'Company Area', alignRight: false },
    { id: '' },
];

const DefaultHolidayArea = () => {

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

    //! Get Holiday Areas
    const { data } = useGetHolidayAreasQuery(Cookies.get('company_id'));
    console.log(data)

    // !Delete TourPlan
    const [deleteHolidayArea] = useDeleteHolidayAreasByIdMutation();
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
                                    data === undefined ? <>
                                        {
                                            eightArrays.map((key) => (
                                                <TableRow key={key} >
                                                    <TableCell><Skeleton /></TableCell>
                                                    <TableCell><Skeleton /></TableCell>
                                                </TableRow>
                                            ))}
                                    </> :
                                        <>
                                            {data && data.map((companyroles, index) => (
                                                <TableRow key={companyroles.id} hover tabIndex={-1} role="checkbox" >
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {companyroles.holiday_type.holiday_name}
                                                        </Typography>
                                                    </TableCell>
                                                    {/* <TableCell align="left">{companyroles.company_area}</TableCell> */}
                                                    <TableCell align="right">
                                                        <IconButton color={'primary'} onClick={(e) => onEdit(companyroles.id)}>
                                                            <Badge>
                                                                <Iconify icon="eva:edit-fill" />
                                                            </Badge>
                                                        </IconButton>
                                                        <IconButton color={'error'} onClick={() => { setSelectedId(companyroles.id); handleClickOpen() }}>
                                                            <Badge>
                                                                <Iconify icon="eva:trash-2-outline" />
                                                            </Badge>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            }
                                        </>}
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
                    <Button autoFocus onClick={() => { deleteRewards(selectedId); handleClose() }}>
                        Yes
                    </Button>
                    <Button
                        onClick={handleClose}
                        autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            {isDrawerOpen && <EditHolidayArea
                idharu={selectedUpdateId} onClose={onCloseDrawer}
            />
            }
        </>
    );
}

export default React.memo(DefaultHolidayArea);