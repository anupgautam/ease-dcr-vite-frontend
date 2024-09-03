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
import BlobToFile from '@/reusable/forms/utils/blobToFile';

import {
    useGetCompDivisionQuery,
    useCreateProductsMutation,
} from '@/api/MPOSlices/ProductSlice';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const AddProduct = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const [File, setFile] = useState(null);

    const [createProducts] = useCreateProductsMutation();
    const [loading, setLoading] = useState(false);

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const initialFValues = {
        product_image: null,
    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('product_name' in fieldValues)
            temp.product_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.product_name)
        temp.product_molecular_name = returnValidation(['null'], values.product_molecular_name)
        temp.division_name = returnValidation(['null'], values.division_name)
        temp.product_price_per_strip_in_mrp = returnValidation(['null'], values.product_price_per_strip_in_mrp)
        temp.product_price_for_stockist = returnValidation(['null'], values.product_price_for_stockist)
        temp.product_description = returnValidation(['null'], values.product_description)
        temp.product_image = returnValidation(['null'], values.product_image)
        temp.product_type = returnValidation(['null'], values.product_type)
        temp.bonus = returnValidation(['null'], values.bonus)
        temp.primary_rate = returnValidation(['null'], values.primary_rate)
        temp.secondary_rate = returnValidation(['null'], values.secondary_rate)

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

    const Division = useGetCompDivisionQuery(company_id, {
        skip: !company_id
    });

    const divisions = useMemo(() => {
        if (Division?.data) {
            return Division.data.map(key => ({ id: key.id, title: key.division_name }))
        }
        return [];
    }, [Division])

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

    const onAddProducts = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        const file = BlobToFile(values.product_image, "productimage");

        if (file && file.size !== 0) {
            formData.append("image", file, "productImage.jpg");
        }

        formData.append("product_name", values.product_name);
        formData.append("product_molecular_name", values.product_molecular_name);
        formData.append("product_price_per_strip_in_mrp", values.product_price_per_strip_in_mrp);
        formData.append("product_price_for_stockist", values.product_price_for_stockist);
        formData.append("product_description", values.product_description);
        formData.append("division_name", values.division_name);
        formData.append('company_id', company_id);
        formData.append("bonus", values.bonus);
        formData.append("product_type", values.product_type);
        try {
            await createProducts(formData)
                .then((response) => {
                    if (response.data) {
                        setSuccessMessage({ show: true, message: 'Successfully Added Product' });
                        setTimeout((e) => {
                            setSuccessMessage({ show: false, message: '' });
                        }, 3000);
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
        setIsDrawerOpen(false);

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

    const [MutipleProduct, setAddMutipleProduct] = useState(false);

    const addMutipleProduct = () => {
        setAddMutipleProduct(!MutipleProduct);
    }

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
                    {
                        MutipleProduct ?
                            <>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        id="autoFocus"
                                        autoFocus
                                        name="no_of_product"
                                        label="Number of Product*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                    />
                                </Box>
                                <Stack spacing={1} direction="row">
                                    <Link to={`/dashboard/admin/add/mutiple/product?number=${values.no_of_product}`}>
                                        <Button
                                            variant="contained"
                                            className="summit-button"
                                        >
                                            Submit{" "}
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outlined"
                                        className="cancel-button"
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </> :
                            <>
                                <Box marginBottom={4}>
                                    <Button
                                        variant="contained"
                                        className="summit-button"
                                        style={{ width: "100%", padding: "10px" }}
                                        onClick={addMutipleProduct}
                                    >
                                        Add Multiple Product
                                    </Button>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box marginBottom={2}>
                                            <Controls.Input
                                                id="autoFocus"
                                                autoFocus
                                                name="product_name"
                                                label="Product name*"
                                                value={values.name}
                                                onChange={handleInputChange}
                                                error={errors.product_name}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box marginBottom={2} style={{ marginTop: "-5px" }}>
                                            <Controls.Select
                                                name="product_type"
                                                label="Product Type*"
                                                value={values.name}
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
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.product_molecular_name}
                                        className={"drawer-first-name-input"}
                                    />
                                </Box>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="product_description"
                                        label="Product Description*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.product_description}
                                        className={"drawer-first-name-input"}
                                    />
                                </Box>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="bonus"
                                        label="Bonus*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.bonus}
                                        className={"drawer-first-name-input"}
                                    />
                                </Box>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="product_price_per_strip_in_mrp"
                                        label="Product Price in MRP*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.product_price_per_strip_in_mrp}
                                        className={"drawer-first-name-input"}
                                    />
                                </Box>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="product_price_for_stockist"
                                        label="Product price for Stockist*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.product_price_for_stockist}
                                        className={"drawer-first-name-input"}
                                    />
                                </Box>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="division_name"
                                        label="Division Name*"
                                        value={values.name}
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
                            </>
                    }
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

export default React.memo(AddProduct);
