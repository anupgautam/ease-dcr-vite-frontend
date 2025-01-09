import { sentenceCase } from 'change-case';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
//! @mui
import {
    Card,
    Table,
    Paper,
    TableRow,
    TextField,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    Box,
    Grid,
    Autocomplete,
    FormControl,
    InputLabel,
    MenuItem,
    Select
} from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import 'react-datepicker/dist/react-datepicker.css';
import "nepali-datepicker-reactjs/dist/index.css"

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Label from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';

import {
    useSearchApplicationMutation,
} from '../../../api/ApplicationSlices/ApplicationSlices';
import {
    useGetAllcompanyUserRolesWithoutPaginationQuery,
} from '@/api/CompanySlices/companyUserRoleSlice';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import { useSelector } from 'react-redux';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';

const TABLE_HEAD = [
    { id: 'user_id', label: 'User Name', alignRight: false },
    { id: 'leave_type', label: 'Leave Type', alignRight: false },
    { id: 'leave_cause', label: 'Leave Cause', alignRight: false },
    { id: 'leave_from', label: 'Leave From', alignRight: false },
    { id: 'leave_to', label: 'Leave To', alignRight: false },
    { id: 'leave_status', label: 'Leave Status', alignRight: false },
    { id: 'submission_date', label: 'Submission Date', alignRight: false },
    { id: 'is_approved', label: 'Is Approved', alignRight: false },
    { id: '' },
];

const FilteredAnalytics = () => {
    const { company_id, user_role } = useSelector((state) => state.cookie);

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;

    //! For drawer 
    const [selectedId, setSelectedId] = useState(null);
    const [mpoId, setMPOId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

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

    const months = [
        { value: 'Baisakh', label: 'Baisakh' },
        { value: 'Jestha', label: 'Jestha' },
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
    }, [])

    const [selectedYear, setSelectedYear] = useState(yearData);

    const handleNepaliYearChange = useCallback((event) => {
        setSelectedYear(event.target.value);
    }, [])

    //! Get User roles wala
    const { data, isSuccess } = useGetAllcompanyUserRolesWithoutPaginationQuery({ id: company_id })

    const rolesOptions = useMemo(() => {
        if (isSuccess) {
            return data.map(key => ({ id: key.id, title: key?.user_name?.first_name + " " + "" + key?.user_name?.middle_name + key?.user_name?.last_name }))
        }
        return [];
    }, [isSuccess])

    //! Options
    const [companyId, setCompanyId] = useState();
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = useCallback((value) => {
        setCompanyId(company_id);
        setSelectedOption(value?.id || "");
    }, [])


    //! Search results
    const [searchApplicationFilter, results] = useSearchApplicationMutation()

    //! onSearch
    const FilteredData = { selectedOption: selectedOption, companyId: companyId }

    useEffect(() => {
        if (companyId || selectedOption) {

            searchApplicationFilter(FilteredData)
        }
    }, [companyId, selectedOption])

    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    console.log(results)

    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            {
                                user_role === 'admin' &&
                                <Autocomplete
                                    options={rolesOptions}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleOptionChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Users" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            }
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
                    </Grid>
                </Box>

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 1200 }}>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            <TableBody>
                                {results?.data ?
                                    <>
                                        <>
                                            {
                                                results?.data === undefined ? <>
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
                                                </> :
                                                    <>
                                                        {results?.data && results?.data?.length == 0 ?
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
                                                                            <br />
                                                                            <br />
                                                                            <br />
                                                                            <br />
                                                                            <br />
                                                                        </Typography>
                                                                    </Paper>
                                                                </TableCell>
                                                            </TableRow>
                                                            :
                                                            results?.data && results?.data?.map((application, index) => (
                                                                <TableRow hover tabIndex={-1} role="checkbox" key={application.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell component="th" scope="row" align="left">
                                                                        <Typography variant="subtitle2" noWrap>
                                                                            {application?.application_id?.leave_type}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align="left">{application?.application_id?.leave_cause}</TableCell>
                                                                    <TableCell align="left">{application?.application_id?.leave_from}</TableCell>
                                                                    <TableCell align="left">{application?.application_id?.leave_to}</TableCell>
                                                                    <TableCell align="left">{application?.application_id?.is_approved === true ? "Approved" : "Pending"}</TableCell>
                                                                    <TableCell align="left">{actualDate}</TableCell>
                                                                    <TableCell align="left">
                                                                        <Label color={(application?.application_id?.is_approved === true ? 'green' : 'red')}>
                                                                            {sentenceCase(application?.application_id?.is_approved.toString())}</Label>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))

                                                        }
                                                    </>}
                                        </>
                                    </>

                                    :
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
                                                    <br />
                                                    <br />
                                                    <br />
                                                    <br />
                                                    <br />
                                                </Typography>
                                            </Paper>
                                        </TableCell>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>
        </>
    )
}

export default React.memo(FilteredAnalytics)