import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    Card,
    Badge,
    Table,
    Button,
    TableRow,
    MenuItem,
    TextField,
    TableBody,
    InputAdornment,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    Box,
    Grid,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';

import { useForm1 } from '../../../reusable/components/forms/useForm';

import {
    useGetTargetsQuery,
    useDeleteTargetsByIdMutation,
    useSearchTargetMutation
} from '@/api/ExpensesSlices/targetSlices';
import DefaultTarget from './DefaultTarget';
import EditTarget from './EditTarget';
import SearchIcon from '@mui/icons-material/Search';

import Cookies from 'js-cookie'
import FilteredTarget from './FilteredTarget';
import SelectDataDCR from '../DCR/SelectDataDCR';
import { useGetCompanyRolesByCompanyQuery } from '@/api/CompanySlices/companyRolesSlice';

const TABLE_HEAD = [
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'target_from', label: 'Target From', alignRight: false },
    { id: 'Year', label: 'Year', alignRight: false },
    { id: 'target_amount', label: 'Target Amount', alignRight: false },
    { id: 'sales', label: 'Sales', alignRight: false },
    { id: '' },
];

const TargetSearch = (props) => {
    const { children, value, index, ...other } = props;

    const yearList = ['2075', '2076', '2077', '2078', '2079', '2080', '2081', '2082', '2083', '2084', '2085', '2086', '2087', '2088', '2089', '2090']
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const { data: rolesData } = useGetCompanyRolesByCompanyQuery(Cookies.get('company_id'));

    const roles = useMemo(() => {
        if (rolesData !== undefined) {
            return rolesData?.map((key) => ({
                id: key.id,
                title: key.role_name.role_name
            }))
        }
        return [];
    }, [rolesData])

    // const roles = useSelector(state => state.dcrData.company_roles)


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
    const { data } = useGetTargetsQuery(page);
    // 


    const [searchResults, setSearchResults] = useState({ search: "" });
    const [searchTarget, results] = useSearchTargetMutation();
    const searchData = results.data;
    // 

    // !on search
    const onSearch = (e) => {
        const searchQuery = e.target.value;
        const company_id = Cookies.get('company_id');
        setSearchResults({ search: searchQuery, company_id })
        searchTarget(searchResults);
        // 
    }

    const initialFValues = {
        "search": " "
    }

    const {
        values,
        handleSearchClick,
    } = useForm1(initialFValues, true);

    useEffect(() => {
        // 
        searchTarget(values)
    }, [values])

    // !Delete doctors
    const [deleteTarget] = useDeleteTargetsByIdMutation();

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
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
                style={{ marginTop: '30px' }}
            >

                {value === index && (
                    <>
                        <SelectDataDCR />
                        <Card>
                            <Box style={{ padding: "20px" }}>
                                <Grid container spacing={0}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={2}>
                                            <FormControl>
                                                <InputLabel id="mpo-select-label">Year</InputLabel>
                                                <Select
                                                    labelId="mpo-select-label"
                                                    id="mpo-select"
                                                    value={selectedYear}
                                                    onChange={(e) => setSelectedYear(e.target.value)}
                                                    label="Year"
                                                >
                                                    <MenuItem value="">None</MenuItem>
                                                    {yearList.map((year) => (
                                                        <MenuItem key={year} value={year}>
                                                            {year}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <FormControl>
                                                <InputLabel id="mpo-select-label">Role Name</InputLabel>
                                                <Select
                                                    labelId="mpo-select-label"
                                                    id="mpo-select"
                                                    value={selectedRole}
                                                    onChange={(e) => setSelectedRole(e.target.value)}
                                                    label="Role Name"
                                                >
                                                    <MenuItem value="">None</MenuItem>
                                                    {roles.map((role) => (
                                                        <MenuItem key={role.id} value={role.id}>
                                                            {role.title && role.title}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={5}>

                                        </Grid>
                                        <Grid item xs={3}>
                                            <Grid container>
                                                <Grid item xs={9}>
                                                    <TextField
                                                        label="Search Target"
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
                                            </Grid>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Box>
                            <Scrollbar>
                                <TableContainer sx={{ minWidth: 800 }}>
                                    <Table>
                                        <UserListHead
                                            headLabel={TABLE_HEAD}
                                        />
                                        <TableBody>
                                            {(searchResults.search.length <= 3) ?
                                                <>
                                                    {selectedRole || selectedYear ?
                                                        <FilteredTarget
                                                            selectedRole={selectedRole}
                                                            selectedYear={selectedYear} /> :
                                                        <DefaultTarget />}
                                                </> : <>{
                                                    searchData && searchData.map((targetsearch, index) => (
                                                        <TableRow hover tabIndex={-1} key={targetsearch.id}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell component="th" scope="row" align="left">
                                                                <Typography variant="subtitle2" noWrap>
                                                                    {targetsearch?.target_to?.user_name?.first_name + " " + targetsearch?.target_to?.user_name?.last_name}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="left">{targetsearch?.target_from?.user_name?.first_name + " " + targetsearch?.target_from?.user_name?.last_name}</TableCell>
                                                            <TableCell align="left">{targetsearch?.year}</TableCell>
                                                            <TableCell align="left">{targetsearch?.target_amount}</TableCell>
                                                            <TableCell align="left">{targetsearch?.sales}</TableCell>
                                                            <TableCell align="left">
                                                                {/* //!Edit */}
                                                                <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(targetsearch.id)} >
                                                                    <Badge>
                                                                        <Iconify icon="eva:edit-fill" />
                                                                    </Badge>
                                                                </IconButton>
                                                                {/*//! Delete  */}
                                                                <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(targetsearch.id); handleClickOpen() }}>
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
                                                                    <Button autoFocus onClick={() => { deleteTarget(selectedId); handleClose() }}>
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
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {isDrawerOpen && <EditTarget
                                    idharu={selectedUpdateId} onClose={onCloseDrawer}
                                />
                                }
                            </Scrollbar>
                        </Card>
                    </>
                )}
            </div>

        </>
    );
}

export default React.memo(TargetSearch);