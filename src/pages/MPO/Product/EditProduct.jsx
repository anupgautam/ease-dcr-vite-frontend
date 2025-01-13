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
    useGetCompDivisionByIdQuery,
    useGetProductsByIdQuery,
    useUpdateProductsMutation,
    useGetCompanyDivisionByCompanyIdQuery
} from "@/api/MPOSlices/ProductSlice";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const EditProduct = ({ idharu, onClose, mpoGet }) => {

    const { company_id, user_role, company_user_id, access, refresh } = useSelector((state) => state.cookie);

    const [File, setFile] = useState(null);

    //!  Getting Users by ID
    const Product = useGetProductsByIdQuery(idharu);

    const [divisionKoId, setDivisionKoId] = useState(0)
    const [mpoKoId, setMpoKoId] = useState(0)
    useEffect(() => {
        if (Product?.data) {
            setDivisionKoId(Product?.data?.product_name?.id)
            // setMpoKoId(Product.data.mpo_name.id)
        }
    }, [Product])

    //! Get division 
    const Division = useGetCompanyDivisionByCompanyIdQuery(company_id, {
        skip: !company_id
    });

    const divisions = useMemo(() => {
        if (Division?.data) {
            return Division.data.map(key => ({ id: key.id, title: key.division_name }))
        }
        return [];
    }, [Division])

    //! GET division by id
    const DivisionById = useGetCompDivisionByIdQuery(divisionKoId, {
        skip: !divisionKoId
    })


    const prod_category = [
        { id: "Tablet", title: "Tablet" },
        { id: "Liquid", title: "Liquid" },
        { id: "Capsules", title: "Capsules" },
        { id: "Topical Medicines", title: "Topical Medicines" },
        { id: "Suppositories", title: "Suppositories" },
        { id: "Drops", title: "Drops" },
        { id: "Inhalers", title: "Inhalers" },
        { id: "Implants", title: "Implants" },
        { id: "Buccal", title: "Buccal" },
        { id: "Ointment", title: "Ointment" },
        { id: "Powder", title: "Powder" },
        { id: "Syrup", title: "Syrup" },
        { id: "Cream", title: "Cream" },
        { id: "Gel", title: "Gel" },
        { id: "Transdermal Patch", title: "Transdermal Patch" },
        { id: "Granules", title: "Granules" },
        { id: "Lozenge", title: "Lozenge" },
        { id: "Spray", title: "Spray" },
        { id: "Injectable", title: "Injectable" },
        { id: "Foam", title: "Foam" },
        { id: "Tube", title: "Tube" },
        { id: "Strip", title: "Strip" },
        { id: "Sachet", title: "Sachet" },
        { id: "1X6", title: "1X6" },
    ];

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('product_name' in fieldValues)
            temp.product_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.product_name)
        // temp.product_molecular_name = returnValidation(['null'], values.product_molecular_name)
        temp.division_name = returnValidation(['null'], values.division_name)
        temp.product_price_per_strip_in_mrp = returnValidation(['null'], values.product_price_per_strip_in_mrp)
        temp.product_price_for_stockist = returnValidation(['null'], values.product_price_for_stockist)
        // temp.product_description = returnValidation(['null'], values.product_description)
        // temp.product_image = returnValidation(['null'], values.product_image)
        temp.product_type = returnValidation(['null'], values.product_type)
        // temp.bonus = returnValidation(['null'], values.bonus)
        // temp.primary_rate = returnValidation(['null'], values.primary_rate)
        // temp.secondary_rate = returnValidation(['null'], values.secondary_rate)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const [initialFValues, setInitialFValues] = useState({
        // product_image: null,
        product_name: "",
        product_molecular_name: "",
        division_name: "",
        product_price_per_strip_in_mrp: "",
        product_price_for_stockist: "",
        product_description: "",
        product_type: "",
        bonus: "",
        // primary_rate: "",
        // secondary_rate: "",
    })

    useEffect(() => {
        if (Product?.data) {
            setInitialFValues({
                'product_name': Product.data.product_name.product_name,
                'product_molecular_name': Product.data.product_name.product_molecular_name,
                'product_description': Product.data.product_name.product_description,
                'product_price_per_strip_in_mrp': Product.data.product_name.product_price_per_strip_in_mrp,
                'product_price_for_stockist': Product.data.product_name.product_price_for_stockist,
                'company_name': Product.data.company_name.company_name,
                'division_name': Product.data.division_name.id,
                'product_type': Product.data?.product_type,
                'product_image': Product.data.product_image
            })
        }
    }, [Product, DivisionById])

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
        // product_image,
        values.product_name,
        values.product_type,
        // values.product_molecular_name,
        // values.product_description,
        // values.bonus,
        values.product_price_per_strip_in_mrp,
        values.product_price_for_stockist,
        values.division_name,
        // values.primary_rate,
        // values.secondary_rate
    ])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);

        setIsButtonDisabled(!valid);
    }, [
        // product_image,
        values.product_name,
        values.product_type,
        // values.product_molecular_name,
        // values.product_description,
        // values.bonus,
        values.product_price_per_strip_in_mrp,
        values.product_price_for_stockist,
        values.division_name,
        // values.primary_rate,
        // values.secondary_rate
    ]);

    //! Edit user
    const [updateProducts] = useUpdateProductsMutation();
    const history = useNavigate()

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        // const file = BlobToFile(File, "product_image");

        const file = Array.isArray(File) && File.length > 0 ? File[0] : null;

        if (file) {
            formData.append("product_image", file);
        }
        formData.append("product_name", values.product_name);
        formData.append("product_molecular_name", values.product_molecular_name);
        formData.append("product_description", values.product_description);
        formData.append("product_price_per_strip_in_mrp", values.product_price_per_strip_in_mrp);
        formData.append("product_price_for_stockist", values.product_price_for_stockist);
        formData.append("product_type", values.product_type);
        formData.append("company_id", company_id);
        formData.append("division_name", values.division_name);
        formData.append('product_id', idharu);
        formData.append('refresh', refresh)
        formData.append('access', access);
        try {
            const response = await updateProducts(formData).unwrap();
            console.log(response)
            if (response?.msg) {
                // setSuccessMessage({ show: true, message: 'Successfully Edited Products' });
                // setTimeout(() => {
                //     onClose();
                //     setSuccessMessage({ show: false, message: '' });
                // }, 2000);

                toast.success(`${response?.msg}`)
                setIsButtonDisabled(true)
                setLoading(false);
                onClose();
            } else if (response?.error) {
                // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                // setTimeout(() => {
                //     setErrorMessage({ show: false, message: '' });
                // }, 2000);

                toast.error(`${response?.error?.data?.msg}`)
                setLoading(false);
            }
            else {
                toast.error(`Some Error Occured`)
            }
        }
        catch (error) {
            if (error) {
                // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                // setTimeout(() => {
                //     setErrorMessage({ show: false, message: '' });
                // }, 2000);

                toast.error('Backend Error')
            }
        } finally {
            setLoading(false)
        }
    }, [updateProducts, values])


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
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        id="autoFocus"
                                        autoFocus
                                        name="product_name"
                                        label="Product name*"
                                        value={values.product_name}
                                        onChange={handleInputChange}
                                        error={errors.product_name}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box style={{ marginTop: '1px' }}>
                                    <Controls.Select
                                        name="product_type"
                                        label="Product Type*"
                                        value={values.product_type}
                                        options={prod_category}
                                        onChange={handleInputChange}
                                        error={errors.product_type}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="product_molecular_name"
                                label="Product Molecular Name*"
                                value={values.product_molecular_name}
                                onChange={handleInputChange}
                                error={errors.product_molecular_name}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="product_description"
                                label="Product Description*"
                                value={values.product_description}
                                onChange={handleInputChange}
                                error={errors.product_description}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="product_price_per_strip_in_mrp"
                                label="Product Price in MRP*"
                                value={values.product_price_per_strip_in_mrp}
                                onChange={handleInputChange}
                                error={errors.product_price_per_strip_in_mrp}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="product_price_for_stockist"
                                label="Product price for Stockist*"
                                value={values.product_price_for_stockist}
                                onChange={handleInputChange}
                                error={errors.product_price_for_stockist}
                            />
                        </Box>

                        <Box marginBottom={2}>
                            <Controls.Select
                                name="division_name"
                                label=" Division Name*"
                                value={values.division_name || ''}
                                options={divisions}
                                onChange={handleInputChange}
                                error={errors.division_name}
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
                                disabled={isButtonDisabled}
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