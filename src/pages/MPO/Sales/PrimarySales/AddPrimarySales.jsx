import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../../components/iconify';
import { useForm } from '../../../../reusable/forms/useForm'
import Controls from '../../../../reusable/components/forms/controls/Controls';
import { returnValidation } from '../../../../validation';
import { useSelector } from 'react-redux';
import { useGetStockistsWithoutPaginationQuery } from '@/api/MPOSlices/stockistApiSlice';
import {
    useCreatePrimarySalesMutation
} from '../../../../api/MPOSlices/PrimarySalesApiSlice';

import {
    NepaliDateConverter
} from "react-nepali-date-picker-lite";
import {
    useGetAllProductsOptionsQuery
} from '@/api/MPOSlices/productApiSlice'
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { toast } from 'react-toastify';

const BS_MONTHS = [
    "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

// const AddSecondarySales = ({ selectedOption, monthData, selectedYear }) => {
const AddPrimarySales = ({ selectedOption }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);


    //! Get Stockist
    const mpo_id = useSelector(state => state.dcrData.selected_user);

    // const { Stockist } = useGetAllStockistsWithoutPaginationQuery({ company_name: company_id, company_area: mpoArea?.company_area?.id })
    const Stockist = useGetStockistsWithoutPaginationQuery(company_id);

    const rolesOptions = useMemo(() => {
        if (Stockist?.data) {
            return Stockist?.data?.map((key) => ({
                id: key.id,
                title: key.stockist_name.stockist_name
            }))
        }
        return [];
    }, [Stockist])

    //! Get Company Division Product
    const Products = useGetAllProductsOptionsQuery(company_id)

    const products = useMemo(() => {
        if (Products.status === 'fulfilled') {
            return Products.data.map((key) => ({ id: key.id, title: key.product_name.product_name }))
        }
        return [];
    }, [Products])

    //! Create Secondary Sales
    const [createPrimarySales] = useCreatePrimarySalesMutation()

    const now = new BSDate().now();
    const [companyId, setCompanyId] = useState(parseInt(company_id));

    const monthNumber = now._date.month;
    const month = BS_MONTHS[monthNumber - 1];
    const yearData = now._date.year;

    //! Months
    // const months = [
    //     { value: 1, label: "Baisakh" },
    //     { value: 2, label: "Jestha" },
    //     { value: 3, label: "Asadh" },
    //     { value: 4, label: "Shrawan" },
    //     { value: 5, label: "Bhadra" },
    //     { value: 6, label: "Ashwin" },
    //     { value: 7, label: "Kartik" },
    //     { value: 8, label: "Mangsir" },
    //     { value: 9, label: "Poush" },
    //     { value: 10, label: "Magh" },
    //     { value: 11, label: "Falgun" },
    //     { value: 12, label: "Chaitra" }
    // ];

    const months = [
        { value: "Baisakh", label: "Baisakh" },
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
    ]

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

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('stockist_name' in fieldValues)
            temp.stockist_name = returnValidation(['null'], values.stockist_name)
        temp.year = returnValidation(['null'], values.year)
        temp.month = returnValidation(['null'], values.month)
        temp.quantity = returnValidation(['null', 'alpha', 'specialcharacter', 'lessthan3'], values.quantity)
        temp.total_amount = returnValidation(['null', 'specialcharacter', 'lessthan3'], values.total_amount)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const initialFValues = {
        stockist_name: "",
        year: "",
        month: "",
        quantity: "",
        total_amount: ""
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true, validate)

    useEffect(() => {
        validate();

    }, [
        // values.product_id,
        values.stockist_name,
        values.quantity,
        values.year,
        values.month,
        values.total_amount
    ])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);

        setIsButtonDisabled(!valid);
    }, [
    values.stockist_name,
    values.quantity,
    values.year,
    values.month,
    values.total_amount]);

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddChemists = async (e) => {
        e.preventDefault();
        setLoading(true)
        const jsonData = {
            year: selectedYear,
            month: selectedMonth,
            company_name: company_id,
            quantity: values.quantity,
            stockist_name: values.stockist_name,
            total_amount: values.total_amount
        }
        try {
            const response = await createPrimarySales(jsonData)
            if (response?.data) {
                // setSuccessMessage({ show: true, message: 'Successfully Added Secondary Sales' });
                // setTimeout(() => {
                //     setSuccessMessage({ show: false, message: '' });
                // }, 3000);
                // setIsDrawerOpen(false)

                toast.success(`${response?.data?.message}`)
                setIsButtonDisabled(true)
                setIsDrawerOpen(false)
            }
            else if (response?.error) {
                // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                // setLoading(false);
                // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);

                toast.error(`${response?.error?.data?.message}`)
                setLoading(false);
            }
            else {
                toast.error(`Some Error Occured`)
            }
        } catch (error) {
            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 3000);
            console.log(error)
            toast.error('Backend Error')
        } finally {
            setLoading(false)
        }
    };
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
                        width="400px"
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
                            Add Primary Sales
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
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
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Select
                                    name="stockist_name"
                                    label="Stockist Name*"
                                    value={values.name}
                                    options={rolesOptions}
                                    onChange={handleInputChange}
                                    error={errors.stockist_name}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                {/* <Autocomplete
                                    options={rolesOptions}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleOptionChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Stockist" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                /> */}
                                <Controls.Input
                                    name="total_amount"
                                    label="Total Amount*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.total_amount}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="quantity"
                                    label="Quantity*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.quantity}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            disabled={isButtonDisabled}
                            onClick={(e) => onAddChemists(e)}
                            text="Submit"
                        />
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
                )}
                {ErrorMessage.show && (
                    <Grid>
                        <Box className="messageContainer errorMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                        </Box>
                    </Grid>
                )}
                {SuccessMessage.show && (
                    <Grid>
                        <Box className="messageContainer successMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                        </Box>
                    </Grid>
                )}
            </Drawer>

        </>
    )
}

export default AddPrimarySales