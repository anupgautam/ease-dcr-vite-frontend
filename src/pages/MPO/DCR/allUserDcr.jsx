import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Table,
    Paper,
    Button,
    TableRow,
    TextField,
    TableBody,
    InputAdornment,
    TableCell,
    Typography,
    TableContainer,
    Pagination,
    Box,
    Grid,
    FormControl,
    Autocomplete,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead} from '../../../sections/@dashboard/user';

import { useForm1 } from '../../../reusable/components/forms/useForm';

import {
    useDeletecompanyUserRolesByIdMutation,
    useSearchCompanyUserRolesMutation
} from '@/api/CompanySlices/companyUserRoleSlice';
import SearchIcon from '@mui/icons-material/Search';
import Cookies from 'js-cookie'
import { useGetCompanyRolesByCompanyQuery } from '@/api/CompanySlices/companyRolesSlice';
import { useGetUsersByCompanyRoleIdQuery } from '@/api/MPOSlices/UserSlice';
import { Link } from 'react-router-dom';

const TABLE_HEAD = [
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'head_quarter', label: 'Head Quarter', alignRight: false },
    { id: 'role_name', label: 'Role Name', alignRight: false },
    { id: 'date_of_joining', label: 'Date of Joining', alignRight: false },
    { id: 'dcr_feeded', label: 'DCR Feeded', alignRight: false },
    { id: 'dcr_pending', label: 'DCR Pending', alignRight: false },
    { id: 'summary', label: 'Remark', alignRight: false },
    { id: '' },
];

const AllUserDcr = () => {

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, [])

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, [])

    //!Pagination logic
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // ! Get all users wala
    // const { data } = useGetAllcompanyUserRolesQuery({ id: Cookies.get('company_id'), page: page });
    const roleList = useGetCompanyRolesByCompanyQuery(Cookies.get('company_id'));

    const [roleSelect, setRoleSelect] = useState('');
    const [companyRoleList, setCompanyRoleList] = useState([]);


    const userList = useGetUsersByCompanyRoleIdQuery({ id: Cookies.get('company_id'), page: roleSelect === null ? undefined : roleSelect });

    useEffect(() => {
        let dataList = []
        if (roleList?.data) {
            roleList.data.map((key) => {
                dataList.push({ id: key.id, title: key.role_name.role_name })
            })
        }
        setCompanyRoleList(dataList);
    }, [roleList])

    const [searchResults, setSearchResults] = useState({ search: "" });
    const [searchUser, results] = useSearchCompanyUserRolesMutation();

    // !on search
    const onSearch = (e) => {
        const searchQuery = e.target.value;
        const company_id = Cookies.get('company_id');
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
    }, [])

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
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={2.5}>
                            <TextField
                                label="Search Users"
                                variant="outlined"
                                onChange={(e) => onSearch(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ m: 2 }}
                            />
                        </Grid>
                        <Grid item xs={2.5}>
                            <FormControl>
                                <Autocomplete
                                    options={companyRoleList}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleRoleSelect}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Company Roles" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6.5}>

                        </Grid>
                    </Grid>
                </Box>

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 1500  }}>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            <TableBody>
                                {(searchResults.search.length <= 3) ?
                                    <>

                                        <>
                                            {
                                                userList !== undefined ?
                                                    <>
                                                        {
                                                            userList?.data?.map((usersearch, index) => (
                                                                <TableRow hover tabIndex={-1} key={index}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell component="th" scope="row" align="left" >
                                                                        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                        <Typography variant="subtitle2" noWrap>
                                                                            {usersearch.user_name.first_name + " " + usersearch.user_name.middle_name + " " + usersearch.user_name.last_name}
                                                                        </Typography>
                                                                        {/* </Stack> */}
                                                                    </TableCell>
                                                                    <TableCell align="left">{usersearch.company_area.company_area}</TableCell>
                                                                    <TableCell align="left">{usersearch.role_name.role_name_value}</TableCell>
                                                                    <TableCell align="left">{usersearch.user_name.date_of_joining}</TableCell>
                                                                    <TableCell align="left">{usersearch.dcr_feeded}</TableCell>
                                                                    <TableCell align="left">{usersearch.dcr_pending}</TableCell>
                                                                    <TableCell align="left">
                                                                        <Link to={`/dashboard/admin/user/wise/dcr?id=${usersearch.id}&role=${usersearch.role_name.role_name.role_name}`}>
                                                                            <Button>Summary</Button>
                                                                        </Link>
                                                                    </TableCell>
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
                                                            ))
                                                        }
                                                    </> : null
                                            }
                                        </>
                                    </> :
                                    <>
                                        {
                                            results && results?.data?.length == 0 ?
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
                                                        results && results?.data?.map((usersearch, index) => (
                                                            <TableRow hover tabIndex={-1} key={usersearch.id}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell component="th" scope="row" align="left" >
                                                                    {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {usersearch.user_name.first_name + " " + usersearch.user_name.middle_name + " " + usersearch.user_name.last_name}
                                                                    </Typography>
                                                                    {/* </Stack> */}
                                                                </TableCell>
                                                                <TableCell align="left">{usersearch.company_area.company_area}</TableCell>
                                                                <TableCell align="left">{usersearch.role_name.role_name_value}</TableCell>
                                                                <TableCell align="left">
                                                                    <Link to={`/dashboard/admin/dcr?id=${usersearch.id}&role=${usersearch.role_name.role_name.role_name}`}>
                                                                        <Button>VIEW DCR</Button>
                                                                    </Link>
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
                                                    {/* //!pagination */}
                                                    <TableRow>
                                                        <TableCell colSpan={6}>
                                                            <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                                                {results ? (
                                                                    <Pagination count={parseInt(results.count / 200) + 1} onChange={handleChangePage} />
                                                                ) : (
                                                                    <Typography variant="body1">In Search</Typography>
                                                                )}
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                        }
                                    </>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>
        </>
    );
}
export default React.memo(AllUserDcr);