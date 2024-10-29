import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import Iconify from '../../../components/iconify';

import { useForm } from '../../../reusable/forms/useForm';
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';

import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { useGetCompanyDivisionProductQuery, useCreateDoctorCallMutation } from '../../../api/MPOSlices/DoctorCallFolderSlice';

const AddProduct = () => {
    const { company_id } = useSelector((state) => state.cookie);

    const CompanyDivisionProduct = useGetCompanyDivisionProductQuery({ id: company_id })

    const companyDivisionProducts = useMemo(() => {
        if (CompanyDivisionProduct?.data) {
            return CompanyDivisionProduct?.data.map(key => ({ id: key.id, title: key.product_name.product_name }))
        }
        return [];
    }, [CompanyDivisionProduct])

    const [File, setFile] = useState(null);

    const [createProducts] = useCreateDoctorCallMutation();
    const [loading, setLoading] = useState(false);

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const initialFValues = {
        product_image: null,
    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('product_id' in fieldValues)
            temp.product_id = returnValidation(['null'], values.product_id)
        temp.product_image = returnValidation(['null'], values.product_image)

        setErrors({
            ...temp
        });

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        handleImageUpload,
        resetForm,
    } = useForm(initialFValues, true, validate);

    const onAddProducts = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append("image", File[0]);
        formData.append("product_id", values.product_id);
        formData.append("company_name", company_id);

        try {
            await createProducts(formData)
                .then((response) => {
                    if (response.data) {
                        setSuccessMessage({ show: true, message: 'Successfully Added Doctor Call' });
                        setTimeout((e) => {
                            setSuccessMessage({ show: false, message: '' });
                        }, 3000);
                        setIsDrawerOpen(false);
                    } else if (response?.error) {
                        setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                        setLoading(false);
                        setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                    } else {
                        setErrorMessage({ show: true, message: response.error.data[0] });
                        setTimeout(() => {
                            setErrorMessage({ show: false, message: '' });
                        }, 3000);
                    }
                }).catch((err) => {
                    setErrorMessage({ show: true, message: 'Some Error Occured.' });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 3000);
                })
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        } finally {
            setLoading(false)
        }

    }, [createProducts, values])


    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        if (File) {
            handleImageUpload('image', File);
        }
    }, [File]);

    useEffect(() => {
        validate();
    }, [values]);

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
                sx={{
                    width: 400,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400
                    }
                }}
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
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
                            Add Product
                        </Typography>
                    </Box>
                    {/* <Box marginBottom={2}>
                            <Controls.Input
                                id="autoFocus"
                                autoFocus
                                name="product_name"
                                label="Product name*"
                                value={values.name}
                                onChange={handleInputChange}
                                error={errors.product_name}
                            />
                        </Box> */}
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="product_id"
                            label="Product Name*"
                            value={values.name}
                            options={companyDivisionProducts}
                            onChange={handleInputChange}
                            error={errors.product_id}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Image
                            setFile={setFile}
                            aspectRatio={373 / 280}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            onClick={(e) => onAddProducts(e)}
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

export default React.memo(AddProduct);
