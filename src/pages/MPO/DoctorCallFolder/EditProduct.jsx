import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box,
    Typography, Button, Grid, CircularProgress
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
//! Reusable Component
import { useForm, Form } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
//! Api Slices 
import {
    useGetDoctorCallByIdQuery,
    useGetCompanyDivisionProductQuery,
    useUpdateDoctorCallMutation
} from '../../../api/MPOSlices/DoctorCallFolderSlice'
import { useSelector } from 'react-redux';

const EditProduct = ({ idharu, onClose }) => {

    const { company_id } = useSelector((state) => state.cookie);

    const [File, setFile] = useState(null);

    //!  Getting Users by ID
    const Product = useGetDoctorCallByIdQuery(idharu);

    const CompanyDivisionProduct = useGetCompanyDivisionProductQuery({ id: company_id })

    const companyDivisionProducts = useMemo(() => {
        if (CompanyDivisionProduct?.data) {
            return CompanyDivisionProduct?.data.map(key => ({ id: key.id, title: key.product_name.product_name }))
        }
        return [];
    }, [CompanyDivisionProduct])

    const [initialFValues, setInitialFValues] = useState({
        product_id: "",
        product_image: "",

    })

    useEffect(() => {
        if (Product?.data) {
            setInitialFValues({
                'product_id': Product?.data?.product_id.id,
                // 'product_id': 1,
                'product_image': Product?.data?.image
            })
            setFile(Product?.data?.image)
        }
    }, [Product?.data])

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

    //! Validation wala  
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

    //! Edit user
    const [updateProducts] = useUpdateDoctorCallMutation();
    const history = useNavigate()

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("image", File[0]);
        formData.append("product_id", values.product_id);
        formData.append('id', idharu);
        formData.append("company_name", company_id);
        try {
            const response = await updateProducts(formData).unwrap();
            // const response = await updateProducts({ formData, id: idharu }).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Products' });
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
            if (error) {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 2000);
            }
        } finally {
            setLoading(false)
        }
    }, [updateProducts, idharu, values])

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
                        <Typography variant="h6" className="drawer-box-text">
                            Edit Products
                            <IconButton
                                className="close-button"
                                onClick={onClose}
                            >
                                <Close />
                            </IconButton>
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>

                        <Box marginBottom={2}>
                            <Controls.Select
                                name="product_id"
                                label="Product Name*"
                                value={values.product_id}
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
                            {values && (
                                <Box marginTop={2}>
                                    <img src={File} alt="Uploaded" style={{ width: '120px', height: '120px' }} />
                                </Box>
                            )}
                        </Box>
                        <Stack spacing={1} direction="row">
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                onClick={(e) => handleSubmit(e)}
                                text="Submit"
                            />
                            <Button
                                variant="outlined"
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

export default React.memo(EditProduct);