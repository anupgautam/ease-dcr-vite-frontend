import { Autocomplete, Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableRow, TextField, IconButton, Badge } from "@mui/material";
import moment from "moment";
import { BSDate } from "nepali-datepicker-react";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useGetcompanyUserRolesByIdQuery } from "@/api/CompanySlices/companyUserRoleSlice";
import { useGetUsersByCompanyRoleIdQuery } from "@/api/MPOSlices/UserSlice";
import { useGetStatDataofDcrByHigherUserMutation, useGetStatDataofDcrByUserMutation } from "@/api/MPOSlices/tourPlan&Dcr";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import { getNepaliMonthName } from "@/reusable/utils/reuseableMonth";
import { UserListHead } from "@/sections/@dashboard/user";
import Iconify from '@/components/iconify/Iconify';
import { CookieContext } from '@/App'

const TABLE_HEAD = [
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'head_quarter', label: 'Head Quarter', alignRight: false },
    { id: 'doctor_dcr', label: 'Doctor Call', alignRight: false },
    { id: 'chemist_dcr', label: 'Chemist Call', alignRight: false },
    { id: 'stockist_dcr', label: 'Stockist Call', alignRight: false },
    { id: 'joint_call', label: 'Joint Call', alignRight: false },
    { id: 'single_call', label: 'Single Call', alignRight: false },
    { id: 'target', label: 'Target', alignRight: false },
    { id: 'pob', label: 'POB', alignRight: false },
    { id: 'remarks', label: 'Remarks', alignRight: false },
    // { id: '' },
];
const TABLE_HEAD1 = [
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'head_quarter', label: 'Head Quarter', alignRight: false },
    { id: 'all_call', label: 'All Call', alignRight: false },
    { id: 'remarks', label: 'Remarks', alignRight: false },
];


const DcrListData = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const role = searchParams.get('role');
    const navigate = useNavigate();
    const [companyUserList, setCompanyUserList] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const userList = useGetUsersByCompanyRoleIdQuery({ id: company_id, page: '' })

    const singleUser = useGetcompanyUserRolesByIdQuery(id);

    useEffect(() => {
        let dataList1 = []
        if (userList?.data) {
            userList.data.map((key) => {
                dataList1.push({ id: key.id, title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name, role: key.role_name.role_name.role_name })
            })
        }
        setCompanyUserList(dataList1);

    }, [userList])

    const handleOptionUserId = useCallback((e, value) => {
        setSelectedId(value);
    }, [])

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;

    const [selectedYear, setSelectedYear] = useState(yearData);
    const yearList = [2080, 2081, 2082, 2083, 2084, 2085, 2086, 2087, 2088, 2089, 2090]
    const months = [
        { value: 'Baisakh', label: 'Baisakh' },
        { value: 'Jesth', label: 'Jestha' },
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

    useEffect(() => {
        if (selectedId) {
            navigate(`/dashboard/admin/user/wise/dcr?id=${selectedId?.id}&role=${selectedId?.role}`)
        }
    }, [selectedId])
    const [MpoStat] = useGetStatDataofDcrByUserMutation()
    const [StatData, setStatData] = useState([]);
    const [HigherStat] = useGetStatDataofDcrByHigherUserMutation();

    useEffect(() => {
        if (role === 'MPO') {
            MpoStat({ mpo: id, year: selectedYear, month: selectedMonth })
                .then((res) => {
                    setStatData(res.data)
                })
        } else {
            HigherStat({ user: id, year: selectedYear, month: selectedMonth })
                .then((res) => {
                    setStatData(res.data)
                })
        }
    }, [role, selectedMonth, selectedYear, selectedId])


    return (
        <Box>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item md={2}>
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
                        <Grid item md={2}>
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
                        {
                            user_role === 'admin' &&
                            <Grid item xs={2.5}>
                                <FormControl>
                                    <Autocomplete
                                        options={companyUserList}
                                        getOptionLabel={(option) => option.title}
                                        onChange={handleOptionUserId}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Users" />
                                        )}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                {option.title}
                                            </li>
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                        }
                        <Grid item xs={6.5}>

                        </Grid>
                    </Grid>
                </Box>
                <Scrollbar>
                    {
                        role === "MPO" ?
                            <TableContainer sx={{ minWidth: 1450 }}>
                                <Table>
                                    <UserListHead
                                        headLabel={TABLE_HEAD}
                                    />
                                    <TableBody>
                                        {
                                            StatData && StatData.map((key, index) => {
                                                return (
                                                    <TableRow hover tabIndex={-1} key={`${key.id}-${index}`}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell align="left">{singleUser?.data?.user_name?.first_name + " " + singleUser?.data?.user_name?.middle_name + " " + singleUser?.data?.user_name?.last_name}</TableCell>
                                                        <TableCell align="left">{getNepaliMonthName(moment(key.date).month() + 1)} {moment(key.date).format('DD')}</TableCell>
                                                        <TableCell align="left">{singleUser?.data?.company_area?.company_area}</TableCell>
                                                        <TableCell align="center" style={{ color: '#2e8960', fontSize: '16px', fontWeight: '600' }}>{key.doctor_call}</TableCell>
                                                        <TableCell align="center" style={{ color: '#2e8960', fontSize: '16px', fontWeight: '600' }}>{key.chemist_call}</TableCell>
                                                        <TableCell align="center" style={{ color: '#2e8960', fontSize: '16px', fontWeight: '600' }}>{key.stockist_call}</TableCell>
                                                        <TableCell align="center" style={{ color: '#5e67e0', fontSize: '16px', fontWeight: '600' }}>{key.total_joined_call}</TableCell>
                                                        <TableCell align="center" style={{ color: '#5e67e0', fontSize: '16px', fontWeight: '600' }}>{key.doctor_call + key.chemist_call + key.stockist_call - key.total_joined_call}</TableCell>
                                                        <TableCell align="left"></TableCell>
                                                        <TableCell align="left"></TableCell>
                                                        <TableCell align="left">
                                                            <Link to={`/dashboard/admin/dcr?id=${id}&role=${role}&date=${key.date}`}>
                                                                <Button>VIEW DETAILS</Button>
                                                                {/* <IconButton>
                                                                    <Badge>
                                                                        <Iconify icon="mdi:eye" sx={{ color: 'primary.main' }} />
                                                                    </Badge>
                                                                </IconButton> */}
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}

                                    </TableBody>
                                </Table>
                            </TableContainer> :
                            <TableContainer >
                                <Table>
                                    <UserListHead
                                        headLabel={TABLE_HEAD1}
                                    />
                                    <TableBody>
                                        {
                                            StatData && StatData.map((key, index) => (
                                                <TableRow hover tabIndex={-1} key={`${key.id}-${index}`}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell align="left">{singleUser?.data?.user_name?.first_name + " " + singleUser?.data?.user_name?.middle_name + " " + singleUser?.data?.user_name?.last_name}</TableCell>
                                                    <TableCell align="left">{getNepaliMonthName(moment(key.date).month() + 1)} {moment(key.date).format('DD')}</TableCell>
                                                    <TableCell align="left">{singleUser?.data?.company_area?.company_area}</TableCell>
                                                    <TableCell align="left" style={{ color: '#2e8960', fontSize: '16px', fontWeight: '600', marginLeft: "10px" }}>{key.call_data}</TableCell>
                                                    <TableCell align="left">
                                                        <Link to={`/dashboard/admin/dcr?id=${id}&role=${role}&date=${key.date}`}>
                                                            <Button>VIEW DETAILS</Button>
                                                            {/* <IconButton>
                                                                <Badge>
                                                                    <Iconify icon="mdi:eye" sx={{ color: 'primary.main' }} />
                                                                </Badge>
                                                            </IconButton> */}
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                    }
                </Scrollbar>
            </Card>
        </Box>
    )
}


export default React.memo(DcrListData);