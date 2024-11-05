import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box,
    Grid,
    Typography, Button, CircularProgress, FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
//! Reusable Component
import { useForm, Form } from '../../../../reusable/forms/useForm'
import Controls from '../../../../reusable/components/forms/controls/Controls';
import { returnValidation } from '../../../../validation';
//! Api Slices 
import {
    useGetPrimarySalesByIdQuery,
    useUpdatePrimarySalesMutation,
} from "@/api/MPOSlices/PrimarySalesApiSlice";

import {
    useGetAllProductsOptionsQuery
} from '@/api/MPOSlices/productApiSlice'
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { useGetStockistsWithoutPaginationQuery } from '@/api/MPOSlices/stockistApiSlice';
import {
    NepaliDateConverter
} from "react-nepali-date-picker-lite";
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";


const EditPrimarySales = ({ idharu, onClose, selectedOption }) => {

    const { company_id, refresh, access } = useSelector((state) => state.cookie);

    //! Get doctor categories
    const Products = useGetAllProductsOptionsQuery(company_id)

    const products = useMemo(() => {
        if (Products.status === 'fulfilled') {
            return Products.data.map((key) => ({ id: key.id, title: key.product_name.product_name }))
        }
        return [];
    }, [Products])

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

    //! Getting chemist by ID
    const SecondarySales = useGetPrimarySalesByIdQuery(idharu);

    const now = new BSDate().now();
    const [companyId, setCompanyId] = useState(parseInt(company_id));

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



    //! Year
    const years = [
        { value: "2079", label: "2079" },
        { value: "2080", label: "2080" },
        { value: "2081", label: "2081" },
        { value: "2082", label: "2082" },
        { value: "2083", label: "2083" },
        { value: "2084", label: "2084" },
        { value: "2085", label: "2085" },
        { value: "2086", label: "2086" },
        { value: "2087", label: "2087" },
        { value: "2088", label: "2088" },
        { value: "2089", label: "2089" },
        { value: "2090", label: "2090" },
    ];
    // const [dateData, setDateData] = useState('')

    const [updatedMonth, setUpdatedMonth] = useState("")

    const handleNepaliMonthChange = useCallback((event) => {
        setUpdatedMonth(event.target.value);
        setCompanyId(company_id);
    }, []);

    const [updatedYear, setUpdatedYear] = useState("");
    console.log(updatedMonth, updatedYear)

    const handleYearChange = useCallback((event) => {
        setUpdatedYear(event.target.value);
        setCompanyId(company_id);
    }, []);

    //! Format Date
    const today = NepaliDateConverter.getNepaliDate();
    const [selectedDates, setSelectedDates] = useState(today);

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('product_id' in fieldValues)
            temp.product_id = returnValidation(['null'], values.product_id)
        temp.stockist_name = returnValidation(['null'], values.stockist_name)
        temp.year = returnValidation(['null'], values.year)
        temp.month = returnValidation(['null'], values.month)
        temp.quantity = returnValidation(['null'], values.quantity)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        product_id: "",
        stockist_name: "",
        quantity: "",
    })

    useEffect(() => {
        if (SecondarySales.data) {
            setInitialFValues({
                'product_id': SecondarySales?.data?.product_id.id,
                'stockist_name': SecondarySales?.data?.stockist_name.id,
                'quantity': SecondarySales?.data?.quantity,
                // 'year': parseInt(SecondarySales?.data?.year),
                // 'month': SecondarySales?.data?.month,
            });
            setUpdatedMonth(String(SecondarySales?.data?.month))
            setUpdatedYear(String(SecondarySales?.data?.year))
        }
    }, [SecondarySales.data])

    const { values,
        errors,
        setErrors,
        handleInputChange
    } = useForm(
        initialFValues,
        true,
        false,
        true
    )


    useEffect(() => {
        validate();

    }, [
        values.product_id,
        values.quantity,
        values.stockist_name,
        values.year,
        values.month,

    ])

    //! Edit user
    const [updateSecondarySaless] = useUpdatePrimarySalesMutation();
    const history = useNavigate();
    const [loading, setLoading] = useState(false)
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const jsonData = {
            year: updatedYear,
            month: updatedMonth,
            product_id: values.product_id,
            company_name: company_id,
            quantity: values.quantity,
            stockist_name: selectedOption,
            id: idharu,
        }
        try {
            const response = await updateSecondarySaless(jsonData).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Secondary Sales' });
                setTimeout(() => {
                    onClose();
                    setSuccessMessage({ show: false, message: '' });
                }, 2000);
            } else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                setLoading(false);
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            }
            else {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 2000);
            }
        }
        catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 2000);
        }
        finally {
            setLoading(false)
        }
    }



    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
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
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6">
                            Edit Secondary Sales
                        </Typography>
                    </Box>


                    <Form onSubmit={handleSubmit}>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="product_id"
                                        label="Product Name*"
                                        value={values.product_id}
                                        options={products}
                                        onChange={handleInputChange}
                                        error={errors.product_id}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="stockist_name"
                                        label="Stockist Name*"
                                        value={values.stockist_name}
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
                                    <FormControl fullWidth>
                                        <InputLabel>Year</InputLabel>
                                        <Select
                                            value={updatedYear}
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
                                            value={updatedMonth}
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
                                        name="quantity"
                                        label="Quantity*"
                                        value={values.quantity}
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
                                onClick={(e) => handleSubmit(e)}
                                text="Submit"
                            />
                            <Button
                                variant="outlined"
                                className="cancel-button"
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
    );
};

export default EditPrimarySales;