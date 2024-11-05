import React, { useState, useCallback, useMemo } from 'react';
//! @mui
import {
    Card,
    Badge,
    Table,
    Paper,
    Button,
    TableRow,
    MenuItem,
    TextField,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    Box,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Autocomplete,
    Stack,
    useMediaQuery,
    useTheme
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import 'react-datepicker/dist/react-datepicker.css';
import ExcelCSVTravelAllowances from './ExcelCSVTravelAllowances';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';

import {
    useDeleteTravelAllowancesByIdMutation,
    useSearchHigherExpensesQuery,
    useSearchMPOExpensesQuery,
    useSearchTravelAllowancesQuery
} from '../../../api/CompanySlices/companyAreaWiseExpenses';
import {
    useGetCompanyUserByUserRoleQuery
} from '@/api/CompanySlices/companyUserRoleSlice';
import { useGetCompanyRolesByCompanyQuery, } from '../../../api/MPOSlices/companyRolesSlice';
import EditTravelAllowances from './EditTravelAllowances';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AddTravelAllowances from './AddTravelAllowancesMPO';
import AddTravelAllowancesMPO from './AddTravelAllowancesMPO';
import AddTravelAllowancesHigher from './AddTravelAllowancesHigher';

const TABLE_HEAD = [
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'year', label: 'Year', alignRight: false },
    { id: 'month', label: 'Month', alignRight: false },
    { id: 'from', label: 'From', alignRight: false },
    { id: 'to', label: 'To', alignRight: false },
    { id: 'daily_expenses', label: 'Daily Expenses', alignRight: false },
    { id: 'travel_expenses', label: 'Travel Expenses', alignRight: false },
    { id: 'miscellanous_expenses', label: 'Miscellaneous Expenses', alignRight: false },
    { id: 'other_expenses', label: 'Other Expenses', alignRight: false },
    { id: '' },
];

const FilterTravelAllowances = () => {
    const { company_id, user_role } = useSelector((state) => state.cookie);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const role = searchParams.get('role');
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [mpoId, setMPOId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id, mpo_id) => {
        setSelectedUpdateId(id);
        setMPOId(mpo_id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    //! Get company roles
    const { data, isLoading, isSuccess, isError, error } = useGetCompanyRolesByCompanyQuery(company_id, {
        skip: !company_id
    })
    const rolesOptions = useMemo(() => {
        if (isSuccess) {
            return data?.map((key) => ({
                id: key.id,
                title: key.role_name_value,
                higher: key.role_name.role_name
            }));
        }
        return [];
    }, [data])

    //! Options
    const [companyId, setCompanyId] = useState(parseInt(company_id));
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedUser, setSelecterUser] = useState('');
    const [mpoName, setMPOName] = useState('');
    const [isHigher, setIsHigher] = useState('')

    const handleOptionChange = useCallback((event, value) => {
        setSelectedOption(value?.id || "");
        setIsHigher(value?.higher)
    }, []);

    const handleUsersOptionsChange = useCallback((event, value) => {
        setSelecterUser(value?.id || "");
    }, []);


    //! Search results
    const handleInputMPOChange = useCallback((event) => {
        const { name, value } = event.target;

        setMPOName(event.target.value)
    }, []);

    // !Delete Travel Allowance
    const [deleteTravelAllowance] = useDeleteTravelAllowancesByIdMutation()

    //! Dialogue 
    const [openDialogue, setOpenDialogue] = useState(false);

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true)
    }, [])

    const handleClose = useCallback(() => {
        setOpenDialogue(false)
    }, [])

    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;

    //! Months
    const months = [
        { value: 'Baisakh', label: 'Baisakh' },
        { value: 'Jesth', label: 'Jesth' },
        { value: 'Asadh', label: 'Asadh' },
        { value: 'Shrawan', label: 'Shrawan' },
        { value: 'Bhadra', label: 'Bhadra' },
        { value: 'Ashwin', label: 'Ashwin' },
        { value: 'Kartik', label: 'Kartik' },
        { value: 'Mangsir', label: 'Mangsir' },
        { value: 'Poush', label: 'Poush' },
        { value: 'Magh', label: 'Magh' },
        { value: 'Falgun', label: 'Falgun' },
        { value: 'Chaitra', label: 'Chaitra' },
    ]

    const [selectedMonth, setSelectedMonth] = useState(monthData)

    const handleNepaliMonthChange = useCallback((event) => {
        setSelectedMonth(event.target.value);
        setCompanyId(company_id);
    }, []);

    //! Year
    const years = [
        { value: 2079, label: "2079" },
        { value: 2080, label: "2080" },
        { value: 2081, label: "2081" },
        { value: 2082, label: "2082" },
        { value: 2083, label: "2083" },
        { value: 2084, label: "2084" },
        { value: 2085, label: "2085" },
        { value: 2086, label: "2086" },
        { value: 2087, label: "2087" },
        { value: 2088, label: "2088" },
        { value: 2089, label: "2089" },
        { value: 2090, label: "2090" },
    ]
    const [dateData, setDateData] = useState('')
    const [selectedYear, setSelectedYear] = useState(yearData);

    const handleYearChange = useCallback((event) => {
        setSelectedYear(event.target.value);
        setCompanyId(company_id);
    }, []);

    const Users = useGetCompanyUserByUserRoleQuery({ company_name: company_id, role_name: selectedOption })

    const usersoptions = useMemo(() => {
        if (Users?.data) {
            return Users?.data?.map((key) => ({
                id: key.id,
                title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name
            }));
        }
        return [];
    }, [Users])

    //! onSearch
    // const FilteredData = { companyId: companyId, selectedOption: selectedOption, monthData: selectedMonth, users: selectedUser.id }

    // const results = useSearchTravelAllowancesQuery({ company_name: company_id, user_id: selectedUser.id ? selectedUser.id : "", year: selectedYear ? selectedYear : "", month: selectedMonth ? selectedMonth : "" })

    const results = isHigher === "MPO"
        ? useSearchMPOExpensesQuery({ company_name: company_id, user_id: id || "", year: selectedYear || "", month: selectedMonth || "" })
        : useSearchHigherExpensesQuery({ company_name: company_id, user_id: id || "", year: selectedYear || "", month: selectedMonth || "" });


    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        {/* <Grid item xs={2.5}>
                            <Autocomplete
                                options={rolesOptions}
                                getOptionLabel={(option) => option.title}
                                onChange={handleOptionChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Roles" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                )}
                            />
                        </Grid>
                        {selectedOption &&
                            <Grid item xs={3}>
                                <Autocomplete
                                    options={usersoptions}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleUsersOptionsChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Users" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            </Grid>
                        } */}

                        <Grid item xs={1.75}>
                            <FormControl fullWidth>
                                <InputLabel>Year</InputLabel>
                                <Select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    label="Year"
                                >
                                    {years.map((month) => (
                                        <MenuItem key={month.value} value={month.value}>
                                            {month.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={2}>
                            <FormControl fullWidth>
                                <InputLabel>Month</InputLabel>
                                <Select
                                    value={selectedMonth}
                                    onChange={handleNepaliMonthChange}
                                    label="Month"
                                >
                                    {months.map((month) => (
                                        <MenuItem key={month.value} value={month.value}>
                                            {month.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs></Grid>
                        <Grid item xs="auto">
                            <Stack direction="row"
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-end"
                            >
                                {user_role === 'admin' &&
                                    <ExcelCSVTravelAllowances />
                                }

                                {user_role === "MPO" ?
                                    <AddTravelAllowancesMPO />
                                    :
                                    <AddTravelAllowancesHigher />
                                }
                            </Stack>
                        </Grid>

                    </Grid>
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
                                            results === undefined ? (<>
                                                {
                                                    eightArrays.map((key) => (
                                                        <TableRow key={key} >
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                        </TableRow>
                                                    ))}
                                            </>) : (
                                                <>
                                                    {results?.data && results?.data?.count == 0 ?
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
                                                        :
                                                        results?.data?.results?.map((application, index) => (
                                                            <TableRow hover tabIndex={-1} role="checkbox" key={application.id}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell component="th" scope="row" align="left">
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {application.date}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="left">{application.year}</TableCell>
                                                                <TableCell align="left">{application.month}</TableCell>
                                                                <TableCell align="left">{application.area_from}</TableCell>
                                                                <TableCell align="left">{application.area_to}</TableCell>
                                                                <TableCell align="left">Rs. {application.daily_allowance}</TableCell>
                                                                <TableCell align="left">Rs. {application.travel_allowance}</TableCell>
                                                                <TableCell align="left">Rs. {application.daily_allowance}</TableCell>
                                                                <TableCell align="left">Rs. {application.travel_allowance}</TableCell>
                                                                <TableCell align="left">
                                                                    <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(application.id, application.user_id)} >
                                                                        <Badge>
                                                                            <Iconify icon="eva:edit-fill" />
                                                                        </Badge>
                                                                    </IconButton>
                                                                    <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(application.id); handleClickOpen() }}>
                                                                        <Badge>
                                                                            <Iconify icon="eva:trash-2-outline" />
                                                                        </Badge>
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </>)}
                                    </>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Scrollbar>
                </Card>
            </Card>
            {/* <Dialog
                fullScreen={fullScreen}
                open={openDialogue}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Are you sure want to delete?"}
                </DialogTitle>
                <DialogActions>
                    <Button autoFocus onClick={() => { deleteTravelAllowance(selectedId); handleClose() }}>
                        Yes
                    </Button>
                    <Button
                        onClick={handleClose}
                        autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog> */}
            {isDrawerOpen && <EditTravelAllowances
                idharu={selectedUpdateId} onClose={onCloseDrawer} mpoId={mpoId}
            />
            }
        </>
    )
}

export default React.memo(FilterTravelAllowances)