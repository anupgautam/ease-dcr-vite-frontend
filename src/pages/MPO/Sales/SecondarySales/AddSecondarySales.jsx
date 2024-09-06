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
    useCreateSecondarySalesMutation
} from '@/api/MPOSlices/SecondarySalesApiSlice';

import {
    NepaliDateConverter
} from "react-nepali-date-picker-lite";
import {
    useGetAllProductsOptionsQuery
} from '@/api/MPOSlices/productApiSlice'
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";


// const AddSecondarySales = ({ selectedOption, monthData, selectedYear }) => {
const AddSecondarySales = ({ selectedOption }) => {
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

    //! Get doctor categories
    const Products = useGetAllProductsOptionsQuery(company_id)

    const products = useMemo(() => {
        if (Products.status === 'fulfilled') {
            return Products.data.map((key) => ({ id: key.id, title: key.product_name.product_name }))
        }
        return [];
    }, [Products])

    //! Create Secondary Sales
    const [createSecondarySales] = useCreateSecondarySalesMutation()

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

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('product' in fieldValues)
            temp.product = returnValidation(['null'], values.product)
        temp.opening_stock = returnValidation(['null'], values.opening_stock)
        temp.closing_stock = returnValidation(['null'], values.closing_stock)
        temp.purchase = returnValidation(['null'], values.purchase)
        temp.sales_return = returnValidation(['null'], values.sales_return)
        temp.total = returnValidation(['null'], values.total)
        temp.sales = returnValidation(['null'], values.sales)
        temp.free = returnValidation(['null'], values.free)
        temp.exchange_breakage = returnValidation(['null'], values.exchange_breakage)
        temp.l_rate = returnValidation(['null'], values.l_rate)
        temp.st_value = returnValidation(['null'], values.st_value)
        temp.sl_value = returnValidation(['null'], values.sl_value)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


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

    useEffect(() => {
        validate();

    }, [
        values.product,
        values.opening_stock,
        values.closing_stock,
        values.purchase,
        values.sales_return,
        values.total,
        values.sales,
        values.free,
        values.exchange_breakage,
        values.l_rate,
        values.st_value,
        values.sl_value,
        values.stockist
    ])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddChemists = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append("stockist", values.stockist);
        formData.append("year", selectedYear);
        formData.append("month", selectedMonth);
        formData.append("product", values.product);
        formData.append("opening_stock", values.opening_stock);
        formData.append("closing_stock", values.closing_stock);
        formData.append("purchase", values.purchase);
        formData.append("sales_return", values.sales_return);
        formData.append("total", values.total);
        formData.append("sales", values.sales);
        formData.append("free", values.free);
        formData.append("exchange_breakage", values.exchange_breakage);
        formData.append("l_rate", values.l_rate);
        formData.append("st_value", values.st_value);
        formData.append("sl_value", values.sl_value);
        formData.append('company_name', company_id)
        try {
            const response = await createSecondarySales(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Added Secondary Sales' });
            setTimeout(() => {
                setSuccessMessage({ show: false, message: '' });
            }, 3000);
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        } finally {
            setLoading(false)
        }

        setIsDrawerOpen(false)
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
                            Add Secondary Sales
                        </Typography>
                    </Box>

                    <Box marginBottom={2}>

                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                {/* <Autocomplete
                                    multiple
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
                                <Controls.Select
                                    name="product"
                                    label="Product Name*"
                                    value={values.name}
                                    options={products}
                                    onChange={handleInputChange}
                                    error={errors.doctorDCRId}
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
                                <Controls.Select
                                    name="stockist"
                                    label="Stockist Name*"
                                    value={values.name}
                                    options={rolesOptions}
                                    onChange={handleInputChange}
                                    error={errors.doctorDCRId}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="opening_stock"
                                    label="Opening Stock*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.opening_stock}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="closing_stock"
                                    label="Closing Stock*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.closing_stock}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="total"
                                    label="Total*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.total}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="purchase"
                                    label="Purchase*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.purchase}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="sales_return"
                                    label="Sales Return*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.sales_return}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="sales"
                                    label="Sales*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.sales}
                                />
                            </Box>
                        </Grid>
                    </Grid>
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
                                <Controls.Input
                                    name="free"
                                    label="Free*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.free}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="exchange_breakage"
                                    label="Exchange Breakage*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.exchange_breakage}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="l_rate"
                                    label="L. Rate*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.l_rate}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="st_value"
                                    label="St. Value*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.st_value}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="sl_value"
                                    label="Sl. Rate*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.sl_value}
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
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

export default AddSecondarySales