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
    Box,
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
import { useSelector } from 'react-redux';

import {
    useGetAllCompanyRolesQuery,
    useDeleteCompanyRolesByIdMutation
} from '../../../api/MPOSlices/companyRolesSlice'
import EditCompanyRoles from './EditCompanyRoles';

const TABLE_HEAD = [
    { id: 'role_name', label: 'Role Name', alignRight: false },
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

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    //! Get Categories
    const { data } = useGetAllCompanyRolesQuery(company_id, {
        skip: !company_id
    });

    // !Delete TourPlan
    const [deleteCompanyRoles] = useDeleteCompanyRolesByIdMutation();
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
                                                    <TableCell><Skeleton /></TableCell>
                                                </TableRow>
                                            ))}
                                    </> :
                                        <>
                                            {data && data.map((companyroles, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={companyroles.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {companyroles.role_name_value}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => handleClickOpen()}>
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
                    {"Contact With Super Admin for Roles Deletion"}
                </DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={() => handleClose()}>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            {isDrawerOpen && <EditCompanyRoles
                idharu={selectedUpdateId} onClose={onCloseDrawer}
            />
            }
        </>
    )
}

export default React.memo(DefaultList);