import React, { useState, useCallback, useMemo, useEffect, useContext } from 'react';
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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { useGetHolidayNamesQuery, useDeleteHolidayAreasByIdMutation } from '@/api/HolidaySlices/holidaySlices';
import { CookieContext } from '@/App'

import EditHolidayName from './EditHolidayName';

const TABLE_HEAD = [
    { id: 'holiday_name', label: 'Holiday Names', alignRight: false },
    { id: '' },
];

const DefaultHolidays = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [openDialogue, setOpenDialogue] = useState(false);
    const [page, setPage] = useState(1);
    const [holidayTypes, setHolidayTypes] = useState([]);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDialogue(false);
    }, []);

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel;
        let thisArray = data.split(" ");
        setPage(thisArray[3]);
    }, []);

    //! Company holidays
    const Holidays = useGetHolidayNamesQuery(company_id);

    const [deleteHolidayName] = useDeleteHolidayAreasByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7];

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
                                {Holidays.length === 0 ? (
                                    <>
                                        {eightArrays.map((key) => (
                                            <TableRow key={key}>
                                                <TableCell><Skeleton /></TableCell>
                                                <TableCell><Skeleton /></TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {Holidays?.data?.map((companyroles, index) => (
                                            <TableRow key={companyroles.id} hover tabIndex={-1} role="checkbox">
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell component="th" scope="row" align="left">
                                                    <Typography variant="subtitle2" noWrap>
                                                        {companyroles.holiday_name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton color={'primary'} onClick={() => onEdit(companyroles.id)}>
                                                        <Badge>
                                                            <Iconify icon="eva:edit-fill" />
                                                        </Badge>
                                                    </IconButton>
                                                    <IconButton color={'error'} onClick={() => { setSelectedId(companyroles.id); handleClickOpen(); }}>
                                                        <Badge>
                                                            <Iconify icon="eva:trash-2-outline" />
                                                        </Badge>
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
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
                    <Button autoFocus onClick={() => { deleteHolidayName(selectedId); handleClose(); }}>
                        Yes
                    </Button>
                    <Button onClick={handleClose} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            {isDrawerOpen && <EditHolidayName idharu={selectedUpdateId} onClose={onCloseDrawer} />}
        </>
    );
};

export default React.memo(DefaultHolidays);
