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
    Select,
    Container
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
import ExportToExcel from "@/reusable/utils/exportSheet";
import { useGetAnalyticsByMPOQuery, useGetAnalyticsByOtherRoleQuery } from '../../../api/MPOSlices/contactApiSlice';

const TABLE_HEAD = [
    { id: 'year', label: 'Year', alignRight: false },
    { id: 'month', label: 'Month', alignRight: false },
    { id: 'call_data', label: 'Call Data', alignRight: false },
    { id: 'mis_call', label: 'Missed Call', alignRight: false },

    { id: '' },
];

const ListOfAnalytics = () => {

    const { company_id, user_role, company_user_role_id } = useSelector((state) => state.cookie);

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

    //! Month Wala 
    const [selectedMonthFrom, setSelectedMonthFrom] = useState(monthData)

    const handleSelectedMonthFrom = useCallback((event) => {
        setSelectedMonthFrom(event.target.value);
    }, [])

    const [selectedYearFrom, setSelectedYearFrom] = useState(yearData);

    const handleSelectedYearFrom = useCallback((event) => {
        setSelectedYearFrom(event.target.value);
    }, [])

    //! To Wala 
    const [selectedMonthTo, setSelectedMonthTo] = useState(monthData)

    const handleSelectedMonthTo = useCallback((event) => {
        setSelectedMonthTo(event.target.value);
    }, [])

    const [selectedYearTo, setSelectedYearTo] = useState(yearData + 1);

    const handleSelectedYearTo = useCallback((event) => {
        setSelectedYearTo(event.target.value);
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

    const handleOptionChange = (event, value) => {
        setCompanyId(company_id);
        setSelectedOption(value?.id || "");
    }

    //! Search results
    // const [searchApplicationFilter, results] = useSearchApplicationMutation()

    //! onSearch
    // const FilteredData = { selectedOption: selectedOption, companyId: companyId, selectedYearTo: selectedYearTo, selectedYearFrom: selectedYearFrom, selectedMonthFrom: selectedMonthFrom, selectedMonthTo: selectedMonthTo }

    // useEffect(() => {
    //     if (companyId || selectedOption || selectedYearFrom || selectedYearTo || selectedMonthFrom || selectedMonthTo) {

    //         searchApplicationFilter(FilteredData)
    //     }
    // }, [companyId, selectedOption, selectedYearTo, selectedYearFrom, selectedMonthFrom, selectedMonthTo])

    const Analytics = useGetAnalyticsByMPOQuery({
        selectedOption: user_role === "admin" ? selectedOption : company_user_role_id,
        selectedYearTo: selectedYearTo,
        selectedYearFrom: selectedYearFrom,
        selectedMonthFrom: selectedMonthFrom,
        selectedMonthTo: selectedMonthTo
    }, {
        skip: !selectedYearTo || !selectedYearFrom || !selectedMonthFrom || !selectedMonthTo || !company_user_role_id
    })

    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    console.log(Analytics?.data)

    //! Excel Wala
    // const headers = [
    //     { label: 'S.No.', key: 'sno' },
    //     { label: 'Chemist Name', key: 'chemist_name' },
    //     { label: 'Chemist Address', key: "chemist_address" },
    //     { label: 'Chemist Phone Number', key: 'chemist_phone_number' },
    //     { label: 'Chemist Category', key: 'chemist_category' },
    //     { label: 'Chemist Contact Number', key: 'chemist_contact_person' },
    //     { label: 'Chemist PAN Number', key: 'chemist_pan_number' },
    //     { label: 'User', key: "user" },
    //     { label: 'Is Invested', key: "is_invested" }
    // ];

    // const templateData = data?.map((values, index) => ({
    //     sno: index + 1,
    //     chemist_name: values?.chemist_name?.chemist_name,
    //     chemist_address: values?.chemist_name?.chemist_address,
    //     chemist_phone_number: values?.chemist_name?.chemist_phone_number,
    //     chemist_category: values?.chemist_name?.chemist_category,
    //     chemist_contact_person: values?.chemist_name?.chemist_contact_person,
    //     chemist_pan_number: values?.chemist_name?.chemist_pan_number,
    //     user: mpoName.title,
    //     is_invested: values?.chemist_name?.is_investment === true ? 'Is Invested' : 'Not Invested'
    // }))

    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Analytics</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container>
                            <Grid item xs={10}>
                                <Box style={{ float: 'right', marginBottom: "25px" }}>
                                    {/* <ExportToExcel headers={headers} fileName={`Chemists`} data={templateData} /> */}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
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
                        </Grid>

                        {/* <Grid container spacing={2} style={{paddingTop:"20px" }}>
                            
                            <Grid item xs={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Year</InputLabel>
                                    <Select
                                        value={selectedYearFrom}
                                        onChange={handleSelectedYearFrom}
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
                                        value={selectedMonthFrom}
                                        onChange={handleSelectedMonthFrom}
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

                            
                            <Grid item xs={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Year</InputLabel>
                                    <Select
                                        value={selectedYearTo}
                                        onChange={handleSelectedYearTo}
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
                                        value={selectedMonthTo}
                                        onChange={handleSelectedMonthTo}
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
                        </Grid> */}

                        <div className="flex justify-start space-x-36 pt-5">
                            {/* From Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                                <div className="flex items-center space-x-4">
                                    <div className="w-28">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                        <select
                                            value={selectedYearFrom}
                                            onChange={handleSelectedYearFrom}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            {year.map((year) => (
                                                <option key={year.value} value={year.value}>
                                                    {year.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-28">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                                        <select
                                            value={selectedMonthFrom}
                                            onChange={handleSelectedMonthFrom}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            {months.map((month) => (
                                                <option key={month.value} value={month.value}>
                                                    {month.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* To Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                                <div className="flex items-center space-x-4">
                                    <div className="w-28">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                        <select
                                            value={selectedYearTo}
                                            onChange={handleSelectedYearTo}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            {year.map((year) => (
                                                <option key={year.value} value={year.value}>
                                                    {year.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-28">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                                        <select
                                            value={selectedMonthTo}
                                            onChange={handleSelectedMonthTo}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        >
                                            {months.map((month) => (
                                                <option key={month.value} value={month.value}>
                                                    {month.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </Box>

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 1200 }}>
                            <Table>
                                <UserListHead
                                    headLabel={TABLE_HEAD}
                                />
                                <TableBody>
                                    {Analytics?.data ?
                                        <>
                                            <>
                                                {
                                                    Analytics?.data === undefined ? <>
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
                                                            {Analytics?.data && Analytics?.data?.length == 0 ?
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
                                                                Analytics?.data && Analytics?.data?.map((application, index) => (
                                                                    <TableRow hover tabIndex={-1} role="checkbox" key={application.id}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        {/* <TableCell component="th" scope="row" align="left">
                                                                            <Typography variant="subtitle2" noWrap>
                                                                                {application?.application_id?.leave_type}
                                                                            </Typography>
                                                                        </TableCell> */}
                                                                        <TableCell align="left">{application?.year}</TableCell>
                                                                        <TableCell align="left">{application?.month}</TableCell>
                                                                        <TableCell align="left">{application?.call_data}</TableCell>
                                                                        <TableCell align="left">{application?.mis_call}</TableCell>
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
            </Container>
        </>
    )
}

export default React.memo(ListOfAnalytics);