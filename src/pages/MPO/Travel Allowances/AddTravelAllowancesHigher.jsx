import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress,
    FormControl,
    InputLabel,
    TextField,
    Select,
    MenuItem
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';

import { useForm } from '../../../reusable/forms/useForm'
import Controls from "../../../reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
import {
    NepaliDateConverter
} from "react-nepali-date-picker-lite";
import { useSelector } from 'react-redux';

import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { usePostHigherExpensesMutation } from '../../../api/CompanySlices/companyAreaWiseExpenses';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';

const AddTravelAllowancesHigher = () => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const now = new BSDate().now();
    const [companyId, setCompanyId] = useState(parseInt(company_id));

    const month = now._date.month;
    const yearData = now._date.year;

    //! Months
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

    const [selectedMonth, setSelectedMonth] = useState(month)

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


    //! Format Date
    const today = NepaliDateConverter.getNepaliDate();
    const [selectedDates, setSelectedDates] = useState(today);

    const [createTravelAllowances] = usePostHigherExpensesMutation()

    const initialFValues = {

    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true)

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('travel_allowance' in fieldValues)
            temp.travel_allowance = fieldValues.travel_allowance ? returnValidation(['null', 'isNumberOnly'], fieldValues.travel_allowance) : "";
        if ('daily_allowance' in fieldValues)
            temp.daily_allowance = fieldValues.daily_allowance ? returnValidation(['null', 'isNumberOnly'], fieldValues.daily_allowance) : "";
        temp.area_from = returnValidation(['null'], values.area_from)
        temp.area_to = returnValidation(['null'], values.area_to)

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    useEffect(() => {
        validate();

    }, [values.leave_cause, values.daily_allowance])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddDoctors = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const jsonData = {
            travel_allowance: values.travel_allowance,
            daily_allowance: values.daily_allowance,
            other_allowance: values.other_allowance,
            date: selectedDates,
            month: selectedMonth,
            year: selectedYear,
            user_id: company_user_role_id,
            company_name: company_id,
        };

        try {
            const response = await createTravelAllowances(jsonData)
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Added Allowances.' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
                setIsDrawerOpen(false)
            } else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                setLoading(false);
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            } else {
                setErrorMessage({ show: true, message: "Unable to Add Allowances" });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        } finally {
            setLoading(false)
        }
    }, [createTravelAllowances, values])

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsDrawerOpen(true)} >
                Add
            </Button>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                padding="16px"
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        width="340px"
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
                            Add Higher Expenses
                        </Typography>
                    </Box>
                    {/* <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    id="auto-focus"
                                    autoFocus
                                    name="area_from"
                                    label="Morning Area*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    errors={errors.area_from}
                                />

                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="area_to"
                                    label="Evening Area*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    errors={errors.area_to}
                                />
                            </Box>
                        </Grid>
                    </Grid> */}
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="travel_allowance"
                            label="Travel Allowance"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.travel_allowance}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="daily_allowance"
                            label="Daily Allowance"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.daily_allowance}
                        />
                    </Box>
                    {/* <Box marginBottom={2}>
                        <Controls.Input
                            name="miscellaneous_allowance"
                            label="Miscellaneous Expenses"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.miscellaneous_allowance}
                        />
                    </Box> */}
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="other_allowance"
                            label="Other Expenses"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.other_allowance}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <label htmlFor="date" style={{ fontSize: '13px', color: "grey", fontWeight: '600', marginBottom: "15px" }}>Date*</label><br />
                        <NepaliDatePicker
                            value={selectedDates}
                            format="YYYY-MM-DD"
                            onChange={(value) => setSelectedDates(value)} />
                    </Box>

                    {/* <Controls.Select
                            name="daily_allowance"
                            label="Leave Type*"
                            value={values.name}
                            options={leaves}
                            onChange={handleInputChange}
                            error={errors.daily_allowance}
                        /> */}
                    <Box marginBottom={2}>
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
                        <Button
                            variant="contained"
                            className="summit-button"
                            onClick={(e) => onAddDoctors(e)}
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
                {loading && (
                    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1000 }}>
                        <CircularProgress />
                    </Grid>
                )
                }
                {
                    ErrorMessage.show && (
                        <Grid>
                            <Box className="messageContainer errorMessage">
                                <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                            </Box>
                        </Grid>
                    )
                }
                {
                    SuccessMessage.show && (
                        <Grid>
                            <Box className="messageContainer successMessage">
                                <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                            </Box>
                        </Grid>
                    )
                }
            </Drawer>

        </>
    )
}

export default React.memo(AddTravelAllowancesHigher);