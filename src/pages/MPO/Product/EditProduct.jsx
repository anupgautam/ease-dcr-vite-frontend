import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box,
    Typography, Button, Grid
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
import Cookies from 'js-cookie'

const EditProduct = ({ idharu, onClose, mpoGet }) => {

    //!  Getting Users by ID
    const Product = useGetProductsByIdQuery(idharu);

    const [divisionKoId, setDivisionKoId] = useState(0)
    const [mpoKoId, setMpoKoId] = useState(0)
    useEffect(() => {
        if (Product.data) {
            setDivisionKoId(Product.data.product_name.id)
            // setMpoKoId(Product.data.mpo_name.id)
        }
    }, [Product.data])

    //! Get division 
    const Division = useGetCompanyDivisionByCompanyIdQuery(Cookies.get('company_id'));

    const divisions = useMemo(() => {
        if (Division?.data) {
            return Division.data.map(key => ({ id: key.id, title: key.division_name }))
        }
        return [];
    }, [Division])

    //! GET division by id
    const DivisionById = useGetCompDivisionByIdQuery(divisionKoId)


    const prod_category = [
        { id: "tab", title: "Tablet" },
        { id: "liquid", title: "Liquid" },
        { id: "cap", title: "Capsules" },
        { id: "tm", title: "Topical Medicines" },
        { id: "sup", title: "Suppositories" },
        { id: "drop", title: "Drops" },
        { id: "inhaler", title: "Inhalers" },
        { id: "implant", title: "Implants" },
        { id: "buccal", title: "Buccal" },
        { id: "ointment", title: "Ointment" },
        { id: "powder", title: "Powder" },
        { id: "syrup", title: "Syrup" },
        { id: "cream", title: "Cream" },
        { id: "gel", title: "Gel" },
        { id: "patch", title: "Transdermal Patch" },
        { id: "granules", title: "Granules" },
        { id: "lozenge", title: "Lozenge" },
        { id: "spray", title: "Spray" },
        { id: "injectable", title: "Injectable" },
        { id: "foam", title: "Foam" },
        { id: "tube", title: "Tube" },
        { id: "strip", title: "Strip" },
        { id: "sachet", title: "Sachet" },
        { id: "1X6", title: "1X6" },
    ];

    const [initialFValues, setInitialFValues] = useState({
        product_name: "",
        product_molecular_name: "",
        product_description: '',
        product_price_per_strip_in_mrp: "",
        product_price_for_stockist: "",
        company_name: "",
        division_name: "",
        product_type: "",
    })

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
        // 
        let temp = { ...errors }
        if ('product_name' in fieldValues)
            temp.product_name = returnValidation(['null', 'number'], values.product_name)
        temp.product_molecular_name = returnValidation(['null'], values.product_molecular_name)
        temp.product_description = returnValidation(['null'], values.product_description)
        temp.division_name = returnValidation(['null'], values.division_name)
        temp.company_name = returnValidation(['null'], values.company_name)
        temp.product_price_per_strip_in_mrp = returnValidation(['null', 'isNumberEdit'], values.product_price_per_strip_in_mrp)
        temp.product_price_for_stockist = returnValidation(['null', 'isNumberEdit'], values.product_price_for_stockist)

        temp.product_type = returnValidation(['null'], values.product_type)
        temp.batch_no = returnValidation(['null'], values.batch_no)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    useEffect(() => {
        if (Product.data) {
            setInitialFValues({
                'product_name': Product.data.product_name.product_name,
                'product_molecular_name': Product.data.product_name.product_molecular_name,
                'product_description': Product.data.product_name.product_description,
                'product_price_per_strip_in_mrp': Product.data.product_name.product_price_per_strip_in_mrp,
                'product_price_for_stockist': Product.data.product_name.product_price_for_stockist,
                'company_name': Product.data.company_name.company_name,
                'division_name': Product.data.division_name.id,
                'product_type': Product.data.product_type
            })
        }
    }, [Product.data, DivisionById.data])

    //! Edit user
    const [updateProducts] = useUpdateProductsMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("product_name", values.product_name);
        formData.append("product_molecular_name", values.product_molecular_name);
        formData.append("product_description", values.product_description);
        formData.append("product_price_per_strip_in_mrp", values.product_price_per_strip_in_mrp);
        formData.append("product_price_for_stockist", values.product_price_for_stockist);
        formData.append("product_type", values.product_type);
        formData.append("company_id", Cookies.get('company_id'));
        formData.append("division_name", values.division_name);
        formData.append('product_id', idharu);
        formData.append('refresh', Cookies.get('refresh'))
        formData.append('access', Cookies.get('access'));
        try {
            const response = await updateProducts(formData).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Products' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            }
        }
        catch (error) {
            if (error) {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        }
    }, [updateProducts, idharu, values, mpoGet])

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
                                <Box style={{ marginTop: '-5px' }}>
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
                        <Stack spacing={1} direction="row">
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                onClick={(e) => { handleSubmit(e); onClose() }}
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
            </Drawer>
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
        </>
    );
};

export default React.memo(EditProduct);