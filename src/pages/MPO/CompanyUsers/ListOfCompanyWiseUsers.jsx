import React, { useState, useCallback } from 'react'
import {
    Badge,
    Button,
    TableRow,
    TableCell,
    Typography,
    IconButton,
    Pagination,
    Box,
    Grid,
    Card,
    TableContainer,
    Table,
    TableBody,
    Container
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
import {
    useGetAllCompanyUserNoAdminsQuery
} from '../../../api/MPOSlices/SuperAdminSlice'
import EditCompanyWiseUsers from './EditCompanyWiseUsers';
import { useLocation, useParams } from 'react-router-dom';

import DefaultCompanyUsers from './DefaultCompanyUsers';


const TABLE_HEAD = [
    { id: 'username', label: 'User Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'phone_number', label: 'Phone Number', alignRight: false },
    { id: 'company_name', label: 'Company', alignRight: false },
    { id: 'role_name_value', label: 'Role', alignRight: false },
    { id: '' },
];

const ListOfCompanyWiseUsers = () => {

    const location = useLocation();
    const params = new URLSearchParams(location.search)
    const id = params.get('id')

    //! Get Categories
    const { data } = useGetAllCompanyUserNoAdminsQuery(id);
    console.log(data)

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



    // !Delete TourPlan
    const [deleteCompanyRoles] = useDeleteCompanyRolesByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]
    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={9}>
                        <Typography style={{ fontSize: '22px', fontWeight: '600', marginBottom:'10px' }}>
                            {data?.results[0]?.company_name?.company_name}
                        </Typography>
                    </Grid>
                    {/* <Grid item xs={3}>
                        <Grid container>
                            <Grid item xs={3.5}>
                            </Grid>
                            <Grid item xs={8.5}>
                                <Box style={{ textAlign: "right", marginBottom: "20px" }}>
                                    <AddCompanyUsers />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid> */}
                </Grid>
                {/* <DefaultCompanyUsers /> */}
                <Card>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 900 }}>
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
                                                {data && data?.results?.map((companyroles, index) => (
                                                    <TableRow hover tabIndex={-1} role="checkbox" key={companyroles.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell component="th" scope="row" align="left">
                                                            <Typography variant="subtitle2" noWrap>
                                                                {companyroles.user_name.first_name + " " + companyroles.user_name.middle_name + " " + companyroles.user_name.last_name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">{companyroles?.user_name.email}</TableCell>
                                                        <TableCell align="left">{companyroles?.user_name.phone_number}</TableCell>
                                                        <TableCell align="left">{companyroles?.company_name?.company_name}</TableCell>
                                                        <TableCell align="left">{companyroles?.role_name?.role_name_value}</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(companyroles?.id)} >
                                                                <Badge>
                                                                    <Iconify icon="eva:edit-fill" />
                                                                </Badge>
                                                            </IconButton>
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
            </Container>
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
            {isDrawerOpen && <EditCompanyWiseUsers
                idharu={selectedUpdateId} onClose={onCloseDrawer}
            />
            }
        </>
    )
}

export default React.memo(ListOfCompanyWiseUsers)