import React, { useState, useCallback } from 'react';
import {
    Card,
    Badge,
    Table,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
} from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux';

import {
    useGetTPlockDaysQuery,
} from '@/api/MPOSlices/TourPlanSlice'
import EditDCRLockDays from './EditDCRLockDays';

const TABLE_HEAD = [
    { id: 'company_roles', label: 'Company Roles', alignRight: false },
    { id: 'tp_lock_days', label: 'Lock Days', alignRight: false },
    { id: '', },
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
    }, [])

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, [])

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

    //! Get Categories
    const { data } = useGetTPlockDaysQuery(company_id);

    const handleDelete = async (id) => {
        await deleteRewards(id);
        handleClose();
    };
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
                            <>
                                <TableBody>
                                    {
                                        data === undefined ? <>
                                            {
                                                eightArrays.map((key) => (
                                                    <TableRow key={key} >
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>
                                                {data && data.map((tpdays, index) => (
                                                    <TableRow key={tpdays.id} hover tabIndex={-1} role="checkbox" >
                                                        <TableCell align="left">{index + 1}</TableCell>
                                                        <TableCell component="th" scope="row" align="left">
                                                            <Typography variant="subtitle2" noWrap>
                                                                {tpdays.company_roles.role_name_value}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">{tpdays.tp_lock_days}</TableCell>
                                                        <TableCell align="left">
                                                            <IconButton color={'primary'} onClick={(e) => onEdit(tpdays.id)}>
                                                                <Badge>
                                                                    <Iconify icon="eva:edit-fill" />
                                                                </Badge>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                                }
                                            </>}
                                </TableBody>
                            </>
                        </Table>
                    </TableContainer>


                </Scrollbar>
            </Card>
            {isDrawerOpen && <EditDCRLockDays
                idharu={selectedUpdateId} onClose={onCloseDrawer}
            />
            }
        </>
    )
}

export default DefaultList;