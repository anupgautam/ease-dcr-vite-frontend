import { Box, Card, FormControl, Grid, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

import { BSDate } from "nepali-datepicker-react";
import React, { useEffect, useState } from "react";
import { useGetAllUserAttendanceQuery, usePostingAllUserAttendanceMutation } from "../../api/CompanySlices/companyUserSlice";
import { useGetUsersByCompanyRoleIdQuery } from "../../api/MPOSlices/UserSlice";
import Scrollbar from "../../components/scrollbar/Scrollbar";
import ExportToExcel from "../../reusable/utils/exportSheet";
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
            const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            daysArray.push(formattedDate);
        }
    } else {
        console.error("Number of days in month is not available for the current year and month.");
    }
    return daysArray;
}


const ListofAttendance = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const now = new BSDate().now();
    const year = now._date.year;
    const month = now._date.month;


    const months = [
        { value: 1, label: 'Baisakh' },
        { value: 2, label: 'Jestha' },
        { value: 3, label: 'Asadh' },
        { value: 4, label: 'Shrawan' },
        { value: 5, label: 'Bhadra' },
        { value: 6, label: 'Ashwin' },
        { value: 7, label: 'Kartik' },
        { value: 8, label: 'Mangsir' },
        { value: 9, label: 'Poush' },
        { value: 10, label: 'Magh' },
        { value: 11, label: 'Falgun' },
        { value: 12, label: 'Chaitra' },
    ]

    const [selectedMonth, setSelectedMonth] = useState(month)

    const handleNepaliMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };
    const years = [
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
        { value: 2091, label: "2091" },
        { value: 2092, label: "2092" },
        { value: 2093, label: "2093" },
        { value: 2094, label: "2094" },
        { value: 2095, label: "2095" },
        { value: 2096, label: "2096" },
        { value: 2097, label: "2097" },
        { value: 2098, label: "2098" },
        { value: 2099, label: "2099" },
    ]
    const [selectedYear, setSelectedYear] = useState(year);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    };

    const allDaysInMonth = getAllDaysInMonth(selectedYear, selectedMonth);
    const userList = useGetUsersByCompanyRoleIdQuery({ id: company_id, page: '' }, {
        skip: !company_id || !page
    });

    const companyUserList = [];

    if (userList !== undefined) {
        userList?.data?.map((key) => {
            companyUserList.push({ id: key.id, title: `${key.user_name.first_name} ${key.user_name.middle_name} ${key.user_name.last_name}` });
        })
    }
    const [AttendanceDateData, setAttendanceDateData] = useState();
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <Typography style={{ fontWeight: '600', fontSize: '18px' }}>
                        User Attendance
                    </Typography>
                </Grid>
                {/* <Grid item xs={2}>
                    <Box style={{ float: "right" }}>
                        <ExportToExcel headers={'headers'} fileName={'userList'} data={'templateData'} />
                    </Box>
                </Grid> */}
            </Grid>
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
                        </Grid>
                    </Box>
                    <Box style={{ paddingTop: "5px", paddingBottom: "15px" }}>
                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 2500 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow style={{ height: '60px' }}>
                                            <TableCell>
                                                <Typography style={{ width: "13rem", color: "grey", fontSize: '15px', fontWeight: '600' }}>User</Typography>
                                            </TableCell>
                                            <TableCell>
                                                CL
                                            </TableCell>
                                            <TableCell>
                                                SL
                                            </TableCell>
                                            <TableCell>
                                                PL
                                            </TableCell>
                                            <TableCell>
                                                LWP
                                            </TableCell>
                                            <TableCell>
                                                H
                                            </TableCell>
                                            <TableCell>
                                                S
                                            </TableCell>
                                            {allDaysInMonth.map((date, index) => {
                                                const day = date.split('-').pop();
                                                return (
                                                    <TableCell key={index}>{day}</TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    </TableHead>
                                    {/* <UserListHead
                                        headLabel={TABLE_HEAD}
                                        sn={false}
                                    /> */}
                                    <TableBody>
                                        {companyUserList.map((key, index) => (
                                            <TableRow key={index} style={{ height: '80px' }}>
                                                <TableCell key={key} style={{ fontWeight: '600' }}>{key.title}</TableCell>
                                                <TableCell>{AttendanceDateData?.casual_leave}</TableCell>
                                                <TableCell>{AttendanceDateData?.sick_leave}</TableCell>
                                                <TableCell>{AttendanceDateData?.paid_leave}</TableCell>
                                                <TableCell>{AttendanceDateData?.leave_without_pay_leave}</TableCell>
                                                <TableCell>{AttendanceDateData?.holiday_leave}</TableCell>
                                                <TableCell>{AttendanceDateData?.saturday}</TableCell>
                                                <AttendanceList setAttendanceDateData={setAttendanceDateData} data={AttendanceDateData?.attendance_data} allDaysInMonth={allDaysInMonth} userId={key.id} month={selectedMonth} year={selectedYear} />
                                            </TableRow>
                                        ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Scrollbar>
                    </Box>
                </Card>
            </Box>
        </Box>
    )
}


const AttendanceList = ({ data = [], userId, month, year, setAttendanceDateData, allDaysInMonth }) => {
    const [AttendanceData] = usePostingAllUserAttendanceMutation();

    useEffect(() => {
        AttendanceData({ year: year, month: month, user_id: userId })
            .then((res) => {
                setAttendanceDateData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [year, month, userId]);

    return (
        <>
            {allDaysInMonth?.map((key, index) => (
                <>
                    {
                        data.includes(key) ? (
                            <TableCell key={index} style={{ color: 'green' }}>P</TableCell>
                        ) : (
                            <TableCell key={index} style={{ color: 'red' }}>A</TableCell>
                        )
                    }
                </>
            ))}
        </>
    );
};


export default ListofAttendance;