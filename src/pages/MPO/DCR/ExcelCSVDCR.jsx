import React, { useState, useCallback, useMemo, useContext } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    TextField,
    MenuItem,
    Autocomplete
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';

import {
    useGetAllcompanyUserRolesWithoutPaginationQuery,
} from '@/api/CompanySlices/companyUserRoleSlice';

import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { CookieContext } from '@/App'


const ExcelCSVDCR = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    //! Get users wala
    const User = useGetAllcompanyUserRolesWithoutPaginationQuery({ id: company_id })

    const userOptions = useMemo(() => {
        if (User?.data) {
            return User?.data.map(key => ({
                id: key.id,
                title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name
            }))
        }
        return [];
    }, [User])

    const [selectedUser, setSelectedUser] = useState()
    const handleUserChange = useCallback((event, value) => {
        setSelectedUser(value?.id);
    }, [])

    //! Month Format 
    const now = new BSDate().now();

    const monthData1 = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;


    //! Months
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

    const [selectedMonth, setSelectedMonth] = useState(monthData1)

    const handleNepaliMonthChange = useCallback((event) => {
        setSelectedMonth(event.target.value);
    }, [])


    //! Year
    const years = [
        { value: 2075, label: "2075" },
        { value: 2076, label: "2076" },
        { value: 2077, label: "2077" },
        { value: 2078, label: "2078" },
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
    const [selectedYear, setSelectedYear] = useState(yearData);

    // 
    const handleYearChange = useCallback((event) => {
        setSelectedYear(event.target.value);
        setCompanyId(company_id);
    }, [])


    //! DCR 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <Button color="success" variant="contained" startIcon={<Iconify icon="mdi:microsoft-excel" />} onClick={() => setIsDrawerOpen(true)} >
            Export Data
            </Button>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                padding="16px"
                sx={{
                    width: 400, // Set the desired width of the Drawer
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400 // Set the same width for the paper inside the Drawer
                    }
                }}
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        // width="400px"
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: "40px" }}
                    >
                        <IconButton
                            className="close-button"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Export DCR
                        </Typography>

                    </Box>
                    <Box marginBottom={2}>
                        <Autocomplete
                            options={userOptions}
                            getOptionLabel={(option) => option.title}
                            onChange={handleUserChange}
                            renderInput={(params) => (
                                <TextField {...params} label="Users" />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.title}
                                </li>
                            )}
                        />
                    </Box>
                    <Box marginBottom={2}>
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
                    </Box>
                    <Box marginBottom={2}>
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
                        {/* {results?.data &&
                            <>
                                <Box marginTop={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        <CSVLink data={results?.data} headers={headers}>Download in Excel</CSVLink>
                                    </Button>
                                </Box>
                            </>
                        } */}
                    </Stack>
                </Box>
            </Drawer>
        </>
    )
}

export default React.memo(ExcelCSVDCR);