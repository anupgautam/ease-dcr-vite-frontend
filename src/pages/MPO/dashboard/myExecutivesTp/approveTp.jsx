import React, { useState, useEffect, useCallback } from 'react'
import { Close } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Drawer, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import { BSDate } from "nepali-datepicker-react";
import { useBulkUpdateTourplanByHoMutation, useBulkUpdateTourplanByMpoMutation } from "@/api/MPOSlices/TourPlanSlice";
import { getNepaliMonthName } from "@/reusable/utils/reuseableMonth";
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { toast } from 'react-toastify';

const ApprovedTP = ({ mpoName, role }) => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const now = new BSDate().now();


    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedYear, setSelectedYear] = useState(yearData);
    const yearList = ['2075', '2076', '2077', '2078', '2079', '2080', '2081', '2082', '2083', '2084', '2085', '2086', '2087', '2088', '2089', '2090']

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
    useEffect(() => {
        if (monthData === "Asadh") {
            setSelectedMonth("Asadh");
        } else {
            setSelectedMonth(monthData);
        }
    }, []);

    const handleNepaliMonthChange = useCallback((event) => {
        setSelectedMonth(event.target.value);
    }, []);

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [UpdateBulkTourPlan] = useBulkUpdateTourplanByMpoMutation();

    const [UpdateHoTp] = useBulkUpdateTourplanByHoMutation();

    const UpdateTour = (e) => {
        e.preventDefault();
        if (role === "MPO") {
            const data = {
                month: selectedMonth,
                year: selectedYear,
                approved_by: company_user_role_id,
                mpo_name: mpoName,
            };
            UpdateBulkTourPlan(data)
                .then((res) => {
                    console.log(res)
                    if (res.data) {
                        setIsDrawerOpen(false)
                        // setSuccessMessage({ show: true, message: 'Tour Plan Successfully Verified.' });
                        // setTimeout(() => {
                        //     setSuccessMessage({ show: false, message: '' });
                        // }, 2000);
                        toast.success('Tour Plan Successfully Verified.')
                    } else {
                        // console.log(res?.error?.data?.message)
                        // setErrorMessage({ show: true, message: extractErrorMessage({ data: res?.error }) });
                        // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                        toast.error(`${res?.error?.data?.message}`);
                    }
                })
                .catch((err) => {
                    // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                    // setTimeout(() => {
                    //     setErrorMessage({ show: false, message: '' });
                    // }, 2000);
                    toast.error('Some Error Occurred. Try again later.')
                })
        } else {
            const data = {
                month: selectedMonth,
                year: selectedYear,
                approved_by: company_user_role_id,
                user_id: mpoName,
            };
            UpdateHoTp(data)
                .then((res) => {
                    if (res.data) {
                        setIsDrawerOpen(false)
                        // setSuccessMessage({ show: true, message: 'Tour Plan Successfully Verified HO.' });
                        // setTimeout(() => {
                        //     setSuccessMessage({ show: false, message: '' });
                        // }, 2000);
                        toast.success('Tour Plan Successfully Verified HO.')
                    } else {
                        // console.log("Here error 400")
                        // setErrorMessage({ show: true, message: extractErrorMessage({ data: res?.error }) });
                        // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                        toast.error(`${res?.error?.data?.message}`);
                    }
                })
                .catch((err) => {
                    // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                    // setTimeout(() => {
                    //     setErrorMessage({ show: false, message: '' });
                    // }, 2000);
                    toast.error('Some Error Occurred. Try again later.')
                })
        }
    }

    return (
        <>
            <LoadingButton onClick={() => setIsDrawerOpen(true)} className="loginbutton" fullWidth size="large" type="submit" variant="contained"  >
                Approve All
            </LoadingButton>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                padding="16px"
                sx={{
                    width: 300,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 350
                    }
                }}
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: "40px" }}
                    >

                        <Box style={{ textAlign: "center" }}>
                            <IconButton
                                className="close-button"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                <Close />
                            </IconButton>
                            <Typography variant="h6">
                                Approve All
                            </Typography>
                        </Box>
                        <Box style={{ marginTop: '40px' }}>
                            <Box marginBottom={2}>
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
                            </Box>
                            <Box marginBottom={3}>
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
                            </Box>
                            <Stack spacing={1} direction="row">
                                <Button
                                    variant="contained"
                                    className="summit-button"
                                    onClick={(e) => UpdateTour(e)}
                                >
                                    Submit{" "}
                                </Button>
                                <Button
                                    variant="outlined"
                                    className="cancel-button"
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Drawer>
            {
                ErrorMessage.show === true ? (
                    <Grid>
                        <Box className="messageContainer errorMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
            {
                SuccessMessage.show === true ? (
                    <Grid>
                        <Box className="messageContainer successMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
        </>
    )
}

export default React.memo(ApprovedTP);