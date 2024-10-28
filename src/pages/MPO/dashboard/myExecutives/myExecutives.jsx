import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Table,
    Paper,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    Box,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import { useForm1 } from '../../../../reusable/components/forms/useForm';
import {
    useDeletecompanyUserRolesByIdMutation,
    useSearchCompanyUserRolesMutation
} from '@/api/CompanySlices/companyUserRoleSlice';
import { useGetCompanyRolesByCompanyQuery, useGetLowerExecutivebyMyIdMutation } from '@/api/CompanySlices/companyRolesSlice';
import { useSelector } from 'react-redux';


const TABLE_HEAD = [
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'phone_number', label: 'Phone Number', alignRight: false },
    { id: 'role_name', label: 'Role Name', alignRight: false },
    { id: '' },
];

const MyExecutives = () => {

    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // ! Get all users wala
    // const { data } = useGetAllcompanyUserRolesQuery({ id: company_id, page: page });
    const roleList = useGetCompanyRolesByCompanyQuery(company_id, {
        skip: !company_id
    });

    const [roleSelect, setRoleSelect] = useState('');
    const [companyRoleList, setCompanyRoleList] = useState([]);

    useEffect(() => {
        let dataList = []
        if (roleList?.data) {
            roleList.data.map((key) => {
                dataList.push({ id: key.id, title: key.role_name_value })
            })
        }
        setCompanyRoleList(dataList);
    }, [roleList])

    const [searchResults, setSearchResults] = useState({ search: "" });

    const [searchUser, results] = useSearchCompanyUserRolesMutation();
    const [LowerLevel] = useGetLowerExecutivebyMyIdMutation();

    const [data, setData] = useState([]);

    useEffect(() => {
        if (company_user_id) {
            LowerLevel({ id: company_user_id })
                .then((res) => {
                    if (res.data) {
                        setData(res.data)
                    }
                })
                .catch((err) => {
                })
        }
    }, [company_user_id])

    // !on search
    const onSearch = (e) => {
        const searchQuery = e.target.value;
        const company_id = company_id;
        setSearchResults({ search: searchQuery, company_id })
        searchUser(searchResults);
    }

    const initialFValues = {
        "search": " "
    }

    const handleRoleSelect = useCallback((e, value) => {
        setRoleSelect(value.id === null ? "" : value.id);
    }, [])
    const handleClear = useCallback(() => {
        setRoleSelect('');
    }, []);

    const {
        values,
        handleSearchClick,
    } = useForm1(initialFValues, true);

    useEffect(() => {
        // 
        searchUser(values)
    }, [values])

    // !Delete users
    const [deleteUser] = useDeletecompanyUserRolesByIdMutation();

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

    return (
        <>
            <Box style={{ padding: "20px" }}>
                <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                    My Executives
                </Typography>
            </Box>

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
                                        data && data?.length == 0 ?
                                            <>
                                                <TableRow>
                                                    <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                                                        <Paper
                                                            sx={{
                                                                textAlign: 'center',
                                                            }}
                                                        >
                                                            <Typography variant="h6" paragraph>
                                                                Not found
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <strong>Requested Data Not found</strong>.
                                                                <br /> Try checking for typos or using complete words.
                                                            </Typography>
                                                        </Paper>
                                                    </TableCell>
                                                </TableRow>
                                            </> :
                                            <>
                                                {
                                                    data && data?.map((usersearch, index) => (
                                                        <TableRow hover tabIndex={-1} key={usersearch.id}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell component="th" scope="row" align="left" >
                                                                {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                <Typography variant="subtitle2" noWrap>
                                                                    {usersearch.user_name.first_name + " " + usersearch.user_name.middle_name + " " + usersearch.user_name.last_name}
                                                                </Typography>
                                                                {/* </Stack> */}
                                                            </TableCell>
                                                            <TableCell align="left">{usersearch.user_name.phone_number}</TableCell>
                                                            <TableCell align="left">{usersearch.user_name.email}</TableCell>
                                                            <TableCell align="left">{usersearch.role_name.role_name_value}</TableCell>
                                                            {/* //! Edit  */}
                                                            {/* <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(usersearch.id)} >
                                                                <Badge>
                                                                    <Iconify icon="eva:edit-fill" />
                                                                </Badge>
                                                            </IconButton> */}
                                                            {/* //! Delete  */}
                                                            {/* <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(usersearch.id); handleClickOpen() }}>
                                                                <Badge>
                                                                    <Iconify icon="eva:trash-2-outline" />
                                                                </Badge>
                                                            </IconButton> */}
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
                                                                    <Button autoFocus onClick={() => { deleteUser(selectedId); handleClose() }}>
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
                                                    ))}
                                            </>
                                    }
                                </>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {isDrawerOpen && <EditUser
                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                    />
                    }
                </Scrollbar>
            </Card >
        </>
    );
}
export default React.memo(MyExecutives);