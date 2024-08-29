import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress
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

import {
    useCreatePrimarySalesMutation
} from '@/api/MPOSlices/PrimarySalesApiSlice';

import {
    useGetAllProductsOptionsQuery
} from '@/api/MPOSlices/productApiSlice'

const AddPrimarySales = ({ selectedOption, monthData, selectedYear }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Get doctor categories
    const Products = useGetAllProductsOptionsQuery(company_id)

    const products = useMemo(() => {
        if (Products.status === 'fulfilled') {
            return Products.data.map((key) => ({ id: key.id, title: key.product_name.product_name }))
        }
        return [];
    }, [Products])

    //! Create Primary Sales
    const [createPrimarySales] = useCreatePrimarySalesMutation()


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
        values.sl_value
    ])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddPrimarySales = useCallback(async (e) => {
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
        formData.append('company_name', company_id)
        try {
            const response = await createPrimarySales(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Added Primary Sales' });
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
    }, [onAddPrimarySales, values]);

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

                    <Box marginBottom={2}>
                        <Controls.Select
                            name="product"
                            label="Product Name*"
                            value={values.name}
                            options={products}
                            onChange={handleInputChange}
                            error={errors.doctorDCRId}
                        />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    id="autoFocus"
                                    autoFocus
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
                            onClick={(e) => onAddPrimarySales(e)}
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
            </Drawer>
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
        </>
    )
}

export default React.memo(AddPrimarySales)