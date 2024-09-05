import React, { useEffect, useState, useMemo } from "react";
import {
    Box,
    Card,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Paper,
    Autocomplete,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Stack
} from "@mui/material";
import { BSDate } from "nepali-datepicker-react";
import Scrollbar from "../../components/scrollbar/Scrollbar";
import { useGetUsersByCompanyRoleIdQuery } from "../../api/MPOSlices/UserSlice";
import { usePostingAllUserAttendanceMutation } from "../../api/CompanySlices/companyUserSlice";
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import ExportToExcel from '@/reusable/utils/exportSheet';
import { useSelector } from 'react-redux';



const bsMonthDays = {
    2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2081: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2082: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
    2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2087: [31, 31, 32, 31, 31, 31, 30, 30, 30, 30, 30, 30],
    2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
    2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2091: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2092: [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2093: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2094: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2095: [31, 31, 32, 31, 31, 31, 30, 29, 30, 30, 30, 30],
    2096: [30, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2097: [31, 32, 31, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2098: [31, 31, 32, 31, 31, 31, 29, 30, 29, 30, 29, 31],
    2099: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
};

function getBsMonthDays(year, month) {
    const days = bsMonthDays[year];
    if (days && month >= 1 && month <= 12) {
        return days[month - 1];
    }
    return null;
}

function getAllDaysInMonth(year, month) {
    const daysInMonth = getBsMonthDays(year, month);
    const daysArray = [];
    if (daysInMonth !== null) {
        for (let day = 1; day <= daysInMonth; day++) {
            const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            daysArray.push(formattedDate);
        }
    } else {
        console.error("Number of days in month is not available for the current year and month.");
    }
    return daysArray;
}

const ListofAttendance = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Export To excel wala
    const headers = [
        { label: 'S.No.', key: 'sno' },
        { label: 'First Name', key: 'first_name' },
        { label: 'Middle Name', key: 'middle_name' },
        { label: 'Last Name', key: 'last_name' },
        { label: 'Company Name', key: 'company_name' },
        { label: 'Email', key: 'email' },
        { label: 'Head Quarter', key: 'head_quarter' },
        { label: 'Phone Number', key: 'phone_number' },
        { label: 'Role', key: 'role_name' },
    ];

    // const templateData = data?.map((values, index) => ({
    //     sno: index + 1,
    //     first_name: values?.user_name?.first_name,
    //     middle_name: values?.user_name?.middle_name,
    //     last_name: values?.user_name?.last_name,
    //     company_name: values?.company_name?.company_name,
    //     email: values?.user_name?.email,
    //     head_quarter: values?.company_area?.company_area,
    //     phone_number: values?.user_name?.phone_number,
    //     role_name: values?.role_name?.role_name_value
    // }));

    const templateData = {
        sno: "1",
        first_name: "lemon",
        middle_name: "wala",
        last_name: "Gautam",

    }


    const now = new BSDate().now();
    const year = now._date.year;
    const month = now._date.month;

    const months = [
        { value: 1, label: "Baisakh" },
        { value: 2, label: "Jestha" },
        { value: 3, label: "Asadh" },
        { value: 4, label: "Shrawan" },
        { value: 5, label: "Bhadra" },
        { value: 6, label: "Ashwin" },
        { value: 7, label: "Kartik" },
        { value: 8, label: "Mangsir" },
        { value: 9, label: "Poush" },
        { value: 10, label: "Magh" },
        { value: 11, label: "Falgun" },
        { value: 12, label: "Chaitra" }
    ];

    const [selectedMonth, setSelectedMonth] = useState(month);
    const handleNepaliMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const years = Array.from({ length: 20 }, (_, index) => ({
        value: 2080 + index,
        label: (2080 + index).toString()
    }));

    const [selectedYear, setSelectedYear] = useState(year);
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    //! Handle Next and Previous functionality
    const handlePrevMonth = () => {
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(prevYear => prevYear - 1);
        } else {
            setSelectedMonth(prevMonth => prevMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(prevYear => prevYear + 1);
        } else {
            setSelectedMonth(prevMonth => prevMonth + 1);
        }
    };


    const allDaysInMonth = getAllDaysInMonth(selectedYear, selectedMonth);
    const userList = useGetUsersByCompanyRoleIdQuery({
        id: company_id,
        page: ""
    }, {
        skip: !company_id
    });

    const companyUserList = useMemo(() => {
        if (userList) {
            return userList?.data?.map(key => ({ id: key.id, title: `${key.user_name.first_name} ${key.user_name.middle_name} ${key.user_name.last_name}` }))
        }
        return []
    }, [userList])


    //! User Options
    const [userName, setUserName] = useState();
    const [userNameValue, setUserNameValue] = useState();

    useEffect(() => {
        if (companyUserList?.length > 0) {
            setUserName(companyUserList[0]?.id);
            setUserNameValue(companyUserList[0]?.title);
        }
    }, [companyUserList]);


    const handleUserNameChange = (event, value) => {
        setUserName(value?.id || '')
        setUserNameValue(value?.title || '')
    }

    const [AttendanceDateData, setAttendanceDateData] = useState();

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Typography style={{ fontWeight: "600", fontSize: "18px" }}>
                        User Attendance
                    </Typography>
                </Grid>
            </Grid>
            {/* //! Export to Excel */}
            {userName && (
                <Box sx={{ display: 'flex', justifyContent: 'right' }}>
                    <ExportToExcel headers={headers} fileName={'Attendance'} data={templateData} />
                </Box>
            )}
            <Box style={{ marginTop: "20px" }}>
                <Card>
                    <Box style={{ padding: "15px" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Year</InputLabel>
                                    <Select
                                        value={selectedYear}
                                        onChange={handleYearChange}
                                        label="Year"
                                    >
                                        {years.map((year) => (
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
                                    options={companyUserList}
                                    getOptionLabel={(option) => option.title}
                                    value={companyUserList?.find(user => user?.id === userName) || null}
                                    onChange={handleUserNameChange}
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

                        </Grid>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: 2, marginLeft: '20px' }}>
                        {/* Previous Button */}
                        <IconButton
                            onClick={handlePrevMonth}
                            sx={{
                                fontSize: 16,
                                textTransform: 'uppercase',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f5f5f5',
                                color: '#333',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0',
                                },

                            }}
                        >
                            <Typography variant="button" sx={{ fontWeight: 'bold' }}>Previous</Typography>
                        </IconButton>

                        <IconButton
                            onClick={handleNextMonth}
                            sx={{
                                fontSize: 16,
                                textTransform: 'uppercase',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                backgroundColor: '#f5f5f5',
                                color: '#333',
                                '&:hover': {
                                    backgroundColor: '#e0e0e0',
                                }
                            }}
                        >
                            <Typography variant="button" sx={{ fontWeight: 'bold' }}>Next</Typography>
                        </IconButton>
                    </Box>


                    <Box style={{ paddingTop: "5px", paddingBottom: "15px" }}>
                        <Scrollbar>
                            <Paper elevation={3} sx={{ padding: "16px" }}>
                                <Grid container spacing={1} align="center">
                                    {userName && (
                                        <AttendanceList
                                            setAttendanceDateData={setAttendanceDateData}
                                            data={AttendanceDateData?.attendance_data}
                                            allDaysInMonth={allDaysInMonth}
                                            userList={userName}
                                            selectedMonth={selectedMonth}
                                            selectedYear={selectedYear}
                                            userNameValue={userNameValue}
                                        />
                                    )}
                                </Grid>
                            </Paper>
                        </Scrollbar>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
};

//! Original
const AttendanceList = ({ data = [], userList, allDaysInMonth, selectedMonth, selectedYear, setAttendanceDateData, userNameValue }) => {
    const [AttendanceData] = usePostingAllUserAttendanceMutation();
    const [AttendData, setAttendData] = useState();

    useEffect(() => {
        if (userList) {
            AttendanceData({ year: selectedYear, month: selectedMonth, user_id: userList }, {
                skip: !selectedYear || !selectedMonth || !userList
            })
                .then((res) => {
                    setAttendanceDateData(res?.data);
                    setAttendData(res?.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [selectedYear, selectedMonth, userList]);

    const daysInWeek = 7;
    const firstDay = new Date(`${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`).getDay();
    const paddedDays = Array.from({ length: firstDay }, () => null);

    // Calculate total days and number of rows needed
    const totalDays = paddedDays.length + allDaysInMonth.length;
    const rows = Math.ceil(totalDays / daysInWeek);

    return (
        <Grid container spacing={1} sx={{ padding: '8px' }}>
            {AttendData !== undefined ? (
                <>
                    {/* Display User Name */}


                    {/* Calendar Table */}
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                            <TableCell key={day} sx={{ textAlign: "center", fontSize: "20px", fontWeight: "bold", color: "#0d0d0d", border: '1px solid #ddd' }}>
                                                {day}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.from({ length: rows }).map((_, rowIndex) => (
                                        <TableRow key={rowIndex}>
                                            {Array.from({ length: daysInWeek }).map((_, colIndex) => {
                                                const index = rowIndex * daysInWeek + colIndex;
                                                const date = paddedDays[index] || allDaysInMonth[index - paddedDays.length];
                                                const day = date ? parseInt(date.split("-").pop()) : null;
                                                const isPresent = AttendData[userList[0]?.id]?.includes(date);

                                                return (
                                                    <TableCell
                                                        key={index}
                                                        sx={{
                                                            textAlign: "center",
                                                            height: "60px",
                                                            width: "60px",
                                                            lineHeight: "60px",
                                                            fontSize: "22px", // Increased font size
                                                            color: isPresent ? "#2e7d32" : "#c62828",
                                                            // color: isPresent ? "#2e7d32" : "#c62828", 

                                                            fontWeight: "bold",
                                                            border: '1px solid #ddd', // Soft border
                                                        }}
                                                    >
                                                        {day}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Leave Summary */}
                    <Grid item xs={12} sx={{ marginTop: "20px" }}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Typography color="#637381" variant="h6">SL: {AttendData.sick_leave}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography color="#637381" variant="h6">CL: {AttendData.casual_leave}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography color="#637381" variant="h6">PL: {AttendData.paid_leave}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography color="#637381" variant="h6">LWP: {AttendData.leave_without_pay_leave}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography color="#637381" variant="h6">H: {AttendData.holiday_leave}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography color="#637381" variant="h6">S: {AttendData.saturday}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            ) : null}
        </Grid>
    );
};




export default ListofAttendance;
