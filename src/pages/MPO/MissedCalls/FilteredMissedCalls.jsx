import React, { useState, useEffect, useCallback } from 'react';
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
    Select,
    MenuItem,
    InputLabel
} from '@mui/material';
import Cookies from 'js-cookie'
import 'react-datepicker/dist/react-datepicker.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import { useGetUsersByCompanyRoleIdQuery } from '@/api/MPOSlices/UserSlice';
import { useGetMissedDataByMpoQuery } from '@/api/MPOSlices/MissedCallsApiSlice';

import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';

const TABLE_HEAD = [
    { id: 'year', label: 'Year', alignRight: false },
    { id: 'month', label: 'Month', alignRight: false },
    { id: 'doctor_chemist', label: 'Doctor or Chemist', alignRight: false },
    { id: 'role', label: 'User Name', alignRight: false },
    { id: 'role_type', label: 'Role Type', alignRight: false },
    { id: '' },
];

const FilteredMissedCalls = () => {

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;

    const userList = useGetUsersByCompanyRoleIdQuery({ id: Cookies.get('company_id'), page: "" })

    const [companyRoleList, setCompanyRoleList] = useState([]);
    const [roleSelect, setRoleSelect] = useState('');

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

    useEffect(() => {
        let dataList = []
        if (userList?.data) {
            userList.data.map((key) => {
                dataList.push({ id: key.id, title: key.user_name.first_name + ' ' + key.user_name.last_name })
            })
        }
        setCompanyRoleList(dataList);
    }, [userList])


    const handleRoleSelect = useCallback((e, value) => {
        setRoleSelect(value?.id || "")
    }, [])

    const { data: missedCalledData } = useGetMissedDataByMpoQuery({ company_name: Cookies.get('company_id'), month: selectedMonth, mpo_name: roleSelect, year: selectedYear })

    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
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
                        <Grid item xs={3}>
                            <Autocomplete
                                options={companyRoleList}
                                getOptionLabel={(option) => option.title}
                                onChange={handleRoleSelect}
                                renderInput={(params) => (
                                    <TextField {...params} label="User List" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                )}
                            />
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
                                            missedCalledData === undefined ? <>
                                                {
                                                    eightArrays.map((key) => (
                                                        <TableRow key={key} >
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            {/* <TableCell><Skeleton /></TableCell> */}
                                                        </TableRow>
                                                    ))}
                                            </> :
                                                <>
                                                    {missedCalledData.length === 0 ?
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
                                                        missedCalledData?.map((application, index) => (
                                                            <TableRow hover tabIndex={-1} role="checkbox" key={application.id}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell component="th" scope="row" align="left">
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {application.year}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="left">{application.year}</TableCell>
                                                                <TableCell align="left">{application.doctor.doctor_name == null ? application.chemist.chemist_name.chemist_name : application?.doctor?.doctor_name?.doctor_name}</TableCell>
                                                                <TableCell align="left">{application.mpo_name.user_name.first_name + ' ' + application.mpo_name.user_name.last_name}</TableCell>
                                                                <TableCell align="left">{application.mpo_name.role_name.role_name.role_name}</TableCell>
                                                            </TableRow>
                                                        ))

                                                    }
                                                </>
                                        }
                                    </>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                </Card>
            </Card>
        </>
    )
}

export default React.memo(FilteredMissedCalls)