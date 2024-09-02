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

import FilteredTarget from './FilteredTarget';
import SelectDataDCR from '../DCR/SelectDataDCR';
import { useGetCompanyRolesByCompanyQuery } from '@/api/CompanySlices/companyRolesSlice';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { useSelector } from 'react-redux';

const TABLE_HEAD = [
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'target_from', label: 'Target From', alignRight: false },
    { id: 'Year', label: 'Year', alignRight: false },
    { id: 'target_amount', label: 'Target Amount', alignRight: false },
    { id: 'sales', label: 'Sales', alignRight: false },
    { id: '' },
];

const TargetSearch = (props) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;


    const { children, value, index, ...other } = props;

    const yearList = ['2075', '2076', '2077', '2078', '2079', '2080', '2081', '2082', '2083', '2084', '2085', '2086', '2087', '2088', '2089', '2090']

    const year = [
        { value: '2080', label: '2080' },
        { value: '2081', label: '2081' },
        { value: '2082', label: '2082' },
        { value: '2083', label: '2083' },
        { value: '2084', label: '2084' },
        { value: '2085', label: '2085' },
        { value: '2086', label: '2086' },
        { value: '2087', label: '2087' },
        { value: '2089', label: '2089' },
        { value: '2090', label: '2090' },
    ]

    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedYear, setSelectedYear] = useState(yearData);

    const handleNepaliYearChange = useCallback((event) => {
        setSelectedYear(event.target.value);
    }, [])

    const { data: rolesData } = useGetCompanyRolesByCompanyQuery(company_id, {
        skip: !company_id
    });

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

    // // ! Get all users wala
    // const { data } = useGetTargetsQuery(page);
    // // 


    const [searchResults, setSearchResults] = useState({ search: "" });
    const [searchTarget, results] = useSearchTargetMutation();
    const searchData = results.data;
    // 

    // !on search
    const onSearch = (e) => {
        const searchQuery = e.target.value;
        const company = company_id;
        setSearchResults({ search: searchQuery, company })
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
        if (values.search.trim()) {
            searchTarget(values)
        }
    }, [values, searchTarget])

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
                                        <Grid item xs={2.5}>
                                            <Grid container>
                                                <Grid item xs={12}>
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
                                        <Grid item xs={2}>
                                            <FormControl fullWidth>
                                                <InputLabel>Year</InputLabel>
                                                <Select
                                                    value={selectedYear}
                                                    onChange={handleNepaliYearChange}
                                                    label="Year"
                                                >
                                                    {year.map((year) => (
                                                        <MenuItem key={year.value} value={year.value}>
                                                            {year.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        {/* <Grid item xs={2}>
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
                                        </Grid> */}
                                        <Grid item xs={5}>

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
                                            {(searchResults?.search?.length <= 3) ?
                                                <>
                                                    {selectedRole || selectedYear ?
                                                        <FilteredTarget
                                                            selectedRole={''}
                                                            selectedYear={selectedYear} /> :
                                                        <DefaultTarget />}
                                                </> : <>{
                                                    searchData && searchData?.map((targetsearch, index) => (
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