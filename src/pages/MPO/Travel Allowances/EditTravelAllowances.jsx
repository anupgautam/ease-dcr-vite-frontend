import React, { useEffect, useState, useCallback } from 'react'
import {
    Box, Grid,
    Typography, Button, CircularProgress, FormControl,
    InputLabel,
    TextField,
    Select,
    MenuItem
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import 'react-datepicker/dist/react-datepicker.css';

//! Reusable Component
import { useForm, Form } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
//! Api Slices 
import {
    useGetExpenseByTheIdQuery,
    useUpdateTravelAllowancesMutation,
} from '@/api/CompanySlices/companyAreaWiseExpenses'
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';

const EditTravelAllowances = ({ mpoId, idharu, onClose }) => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const now = new BSDate().now();
    const userList = useSelector(state => state?.tourPlan?.dataList);

    //! Getting TravelAllowance by ID
    const TravelAllowance = useGetExpenseByTheIdQuery(idharu);

    //! Months
    const months = [
        { value: "Baishkh", label: "Baisakh" },
        { value: "Jestha", label: "Jestha" },
        { value: "Asadh", label: "Asadh" },
        { value: "Shrawan", label: "Shrawan" },
        { value: "Bhadra", label: "Bhadra" },
        { value: "Ashwin", label: "Ashwin" },
        { value: "Kartik", label: "Kartik" },
        { value: "Mangsir", label: "Mangsir" },
        { value: "Poush", label: "Poush" },
        { value: "Magh", label: "Magh" },
        { value: "Falgun", label: "Falgun" },
        { value: "Chaitra", label: "Chaitra" }
    ];
    const [companyId, setCompanyId] = useState(parseInt(company_id))
    const [selectedMonth, setSelectedMonth] = useState('')

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
    const [dateData, setDateData] = useState()
    const [selectedYear, setSelectedYear] = useState('');

    const handleYearChange = useCallback((event) => {
        setSelectedYear(event.target.value);
        setCompanyId(company_id);
    }, []);

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('travel_allowance' in fieldValues)

            temp.travel_allowance = returnValidation(['null', 'isNumberOnly'], values.travel_allowance)
        temp.daily_allowance = returnValidation(['null', 'isNumberOnly'], values.daily_allowance)
        temp.miscellaneous_allowance = returnValidation(['null', 'isNumberOnly'], values.miscellaneous_allowance)
        temp.other_allowance = returnValidation(['null', 'isNumberOnly'], values.other_allowance)
        // temp.area_from = returnValidation(['null'], values.area_from)
        // temp.area_to = returnValidation(['null'], values.area_to)
        // temp.year = returnValidation(['null'], values.year)
        // temp.month = returnValidation(['null'], values.month)

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const [initialFValues, setInitialFValues] = useState({
        // area_from: "",
        // area_to: "",
        travel_allowance: "",
        miscellaneous_allowance: "",
        daily_allowance: "",
        company_name: "",
        user_id: "",
        date: "",
        year: "",
        month: "",
    })

    useEffect(() => {
        if (TravelAllowance?.data) {
            setInitialFValues({
                // area_from: TravelAllowance?.data?.area_from,
                // area_to: TravelAllowance?.data?.area_to,
                daily_allowance: TravelAllowance?.data?.daily_allowance,
                travel_allowance: TravelAllowance?.data?.travel_allowance,
                miscellaneous_allowance: TravelAllowance?.data?.miscellaneous_allowance,
                other_allowance: TravelAllowance?.data?.other_allowance,
                company_name: TravelAllowance?.data?.company_name,
                user_id: TravelAllowance?.data?.user_id,
                year: TravelAllowance?.data?.year,
                month: TravelAllowance?.data?.month
            });
            setDateData(TravelAllowance?.data?.date ? TravelAllowance?.data?.date : now);
            setSelectedMonth(TravelAllowance?.data?.month ? TravelAllowance?.data?.month : now)
            setSelectedYear(TravelAllowance?.data?.year ? TravelAllowance?.data?.year : now)
        }
    }, [TravelAllowance.data])


    const { values,
        errors,
        setErrors,
        handleInputChange,
    } = useForm(
        initialFValues,
        true,
        false,
        true
    )


    useEffect(() => {
        validate();
    }, [
        // values.area_from,
        // values.area_to,
        values.daily_allowance,
        values.travel_allowance,
        values.miscellaneous_allowance,
        values.other_allowance
    ])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Edit tourplan
    const [updateTravelAllowances] = useUpdateTravelAllowancesMutation();
    const history = useNavigate()
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)

        const formData = new FormData();
        formData.append("travel_allowance", values.travel_allowance);
        formData.append("daily_allowance", values.daily_allowance);
        formData.append("miscellaneous_allowance", values.miscellaneous_allowance);
        formData.append("other_allowance", values.other_allowance);
        formData.append("date", dateData);
        formData.append("area_to", values.area_to);
        formData.append("area_from", values.area_from);
        formData.append("month", selectedMonth);
        formData.append("year", selectedYear);
        formData.append("user_id", company_user_role_id);
        formData.append('company_name', company_id);
        formData.append('id', idharu)
        try {
            const response = await updateTravelAllowances(formData).unwrap()
                .then((response) => {
                    if (response?.data) {
                        // setSuccessMessage({ show: true, message: 'Successfully Edited TravelAllowance' });
                        // setTimeout(() => {
                        //     setSuccessMessage({ show: false, message: '' });
                        // }, 3000);

                        toast.success(`${response?.data?.msg}`)
                        setIsButtonDisabled(true)
                        setLoading(false);
                        onClose();
                    } else if (response?.error) {
                        // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                        // setLoading(false);
                        // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);

                        console.log(response?.error)
                        toast.error(`${response?.error?.data?.msg}`)
                        setLoading(false);
                    } else {
                        // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                        // setTimeout(() => {
                        //     setErrorMessage({ show: false, message: '' });
                        // }, 3000);

                        toast.error(`Some Error Occured`)
                    }
                })
                .catch((err) => {
                    // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                    // setTimeout(() => {
                    //     setErrorMessage({ show: false, message: '' });
                    // }, 3000);

                    console.log(error)
                    toast.error('Backend Error')
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        catch (error) {
            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 3000);

            console.log(error)
            toast.error('Backend Error')
        }
        finally {
            setLoading(false)
        }
    }, [updateTravelAllowances, values, idharu, dateData, selectedMonth, selectedYear])

    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
                padding="16px"
            >
                <Box style={{ padding: '20px' }}>
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
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6">
                            Edit TravelAllowance
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        id="auto-focus"
                                        autoFocus
                                        name="area_from"
                                        label="Morning Area"
                                        value={values.area_from}
                                        onChange={handleInputChange}
                                        error={errors.area_from}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="area_to"
                                        label="Evening Area"
                                        value={values.area_to}
                                        onChange={handleInputChange}
                                        errors={errors.area_to}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="travel_allowance"
                                    label="Travel Allowance"
                                    value={values.travel_allowance}
                                    onChange={handleInputChange}
                                    errors={errors.travel_allowance}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="daily_allowance"
                                    label="Daily Allowance"
                                    value={values.daily_allowance}
                                    onChange={handleInputChange}
                                    errors={errors.daily_allowance}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="miscellaneous_allowance"
                                    label="Miscellaneous Expenses"
                                    value={values.miscellaneous_allowance}
                                    onChange={handleInputChange}
                                    errors={errors.miscellaneous_allowance}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="other_allowance"
                                    label="Other Expenses"
                                    value={values.other_allowance}
                                    onChange={handleInputChange}
                                    errors={errors.other_allowance}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <label htmlFor="date" style={{ fontSize: '13px', color: "grey", fontWeight: '600', marginBottom: "15px" }}>Date*</label><br />
                                <NepaliDatePicker
                                    value={dateData}
                                    format="YYYY-MM-DD"
                                    onChange={(value) => setDateData(value)} />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
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
                        </Grid>
                        <Grid item xs={6}>
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
                        </Grid>

                        <Stack spacing={1} direction="row">
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                disabled={isButtonDisabled}
                                onClick={(e) => { handleSubmit(e); onClose() }}
                                text="Submit"
                            />
                            <Button
                                variant="outlined"
                                // className="cancel-button"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Form>
                </Box>
                {loading && (
                    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1000 }}>
                        <CircularProgress />
                    </Grid>
                )}
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
            </Drawer>

        </>
    );
};

export default React.memo(EditTravelAllowances);