import React, { useEffect, useState, useMemo, useContext } from 'react'
import {
    Box,
    Grid,
    Typography, Button, CircularProgress
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
import { CookieContext } from '@/App'


const EditPrimarySales = ({ idharu, onClose, selectedOption, monthData, selectedYear }) => {
    const { company_id, user_role, company_user_id, refresh, access } = useContext(CookieContext)

    //! Get doctor categories
    const Products = useGetAllProductsOptionsQuery(company_id)

    const products = useMemo(() => {
        if (Products.status === 'fulfilled') {
            return Products.data.map((key) => ({ id: key.id, title: key.product_name.product_name }))
        }
        return [];
    }, [Products])

    //! Getting chemist by ID
    const PrimarySales = useGetPrimarySalesByIdQuery(idharu);


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


    const [initialFValues, setInitialFValues] = useState({
        product: "",
        opening_stock: "",
        closing_stock: "",
        purchase: "",
        sales_return: "",
        sales: "",
        total: "",
        free: "",
        exchange_breakage: "",
        l_rate: "",
        st_value: "",
        sl_value: "",
    })

    useEffect(() => {
        if (PrimarySales.data) {
            setInitialFValues({
                'product': PrimarySales?.data?.product,
                'opening_stock': PrimarySales?.data?.opening_stock,
                'closing_stock': PrimarySales?.data?.closing_stock,
                'purchase': PrimarySales?.data?.purchase,
                'sales_return': PrimarySales?.data?.sales_return,
                'sales': PrimarySales?.data?.sales,
                'total': PrimarySales?.data?.total,
                'free': PrimarySales?.data?.free,
                'exchange_breakage': PrimarySales?.data?.exchange_breakage,
                'l_rate': PrimarySales?.data?.l_rate,
                'st_value': PrimarySales?.data?.st_value,
                'sl_value': PrimarySales?.data?.sl_value,
            });
        }
    }, [PrimarySales.data])

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
        values.sl_value
    ])

    //! Edit user
    const [updatePrimarySaless] = useUpdatePrimarySalesMutation();
    const history = useNavigate();

    const [isLoading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append("stockist", selectedOption);
        formData.append("year", selectedYear);
        formData.append("month", monthData);
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
        formData.append("company_name", company_id);
        formData.append('refresh', refresh);
        formData.append('access', access);
        formData.append('id', idharu);
        try {

            const response = await updatePrimarySaless(formData).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Primary Sales' });
                setTimeout(() => {
                    onClose();
                    setSuccessMessage({ show: false, message: '' });
                }, 2000);
            } else {
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
        } finally {
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
                            Edit Primary Sales
                        </Typography>
                    </Box>


                    <Form onSubmit={handleSubmit}>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="product"
                                label="Product Name*"
                                value={values.product}
                                options={products}
                                onChange={handleInputChange}
                                error={errors.doctorDCRId}
                            />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="opening_stock"
                                        label="Opening Stock*"
                                        value={values.opening_stock}
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
                                        value={values.closing_stock}
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
                                        value={values.total}
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
                                        value={values.purchase}
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
                                        value={values.sales_return}
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
                                        value={values.sales}
                                        onChange={handleInputChange}
                                        error={errors.sales}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="free"
                                        label="Free*"
                                        value={values.free}
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
                                        value={values.exchange_breakage}
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
                                        value={values.l_rate}
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
                                        value={values.st_value}
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
                                        value={values.sl_value}
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

export default React.memo(EditPrimarySales);