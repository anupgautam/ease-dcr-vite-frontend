import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";

import { useForm } from '../../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../../validation';

import {
    useCreateDoctorsEventsMutation
} from '../../../../api/MPOSlices/DoctorSlice'
import Cookies from 'js-cookie'
import { useGetAllProductsOptionsWithDivisionQuery } from '@/api/MPOSlices/productApiSlice';
import { useGetUsersByIdQuery } from '@/api/DemoUserSlice';
import { useGetAllChemistsWithoutPaginationQuery } from '@/api/MPOSlices/ChemistSlice';
import { useAddChemistOrderedProductByIdMutation, useAddChemistOrderedProductMutation } from '@/api/DCRs Api Slice/chemistDCR/chemistOrderedProductInformation';
import { useGetAllCompanyProductsWithoutPaginationQuery } from '@/api/productSlices/companyProductSlice';
import { useAddOrderedProductInformationChemistMutation } from '@/api/MPOSlices/tourPlan&Dcr';

const ChemistOrderProduct = ({ id, data, handleOrderProductChange }) => {

    const { data: mpoArea } = useGetUsersByIdQuery(Cookies.get('company_user_id'));
    const { data: productData } = useGetAllCompanyProductsWithoutPaginationQuery(Cookies.get('company_id'))

    const companyProducts = useMemo(() => {
        if (productData !== undefined) {
            return productData.map((key, index) => ({
                id: key.id,
                title: key.product_name.product_name
            }))
        }
        return [];
    }, [productData])

    const company_id = Cookies.get('company_id');
    const company_area_id = mpoArea?.company_area?.id;

    const { data: ChemistData } = useGetAllChemistsWithoutPaginationQuery({
        company_name: company_id,
        company_area: company_area_id,
    })

    const chemistList = useMemo(() => {
        if (ChemistData !== undefined) {
            return ChemistData?.map((key, index) => ({
                id: key.id,
                title: key.chemist_name.chemist_name
            }))
        }
        return [];
    }, [ChemistData])

    const [OrderProduct] = useAddOrderedProductInformationChemistMutation();
    const [AddProduct, setAddProduct] = useState([]);
    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('product_name' in fieldValues)
            //     temp.product_name = returnValidation(['null'], values.product_name)
            // temp.chemist_name = returnValidation(['null'], values.chemist_name)
            // temp.selectedDates = returnValidation(['null'], selectedDates)

            setErrors({
                ...temp
            })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const [initialFValues, setInitialFValues] = useState({
        product_name: "",
        chemist_name: "",
        quantity: ""
    })

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
    }, [values.product_name, values.chemist_name])


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddOrderProduct = async (e) => {
        e.preventDefault();
        try {
            for (const product of AddProduct) {
                const response = await OrderProduct(product);
                if (response.data) {
                    setSuccessMessage({ show: true, message: 'Successfully Order Product.' });
                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                        setInitialFValues({
                            product_name: "",
                            chemist_name: "",
                            quantity: ""
                        });
                    }, 3000);
                } else {
                    setErrorMessage({ show: true, message: response.error.data[0] });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 3000);
                }
            }
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
        setIsDrawerOpen(false);
    };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <Button
                variant="outlined"
                className="cancel-button"
                style={{ width: "100%", padding: '15px' }}
                onClick={() => setIsDrawerOpen(true)}
            >
                Chemist Ordered Product
            </Button>
            {/* <Button
                variant="contained"
                className="user-drawer-button"
                onClick={() => setIsDrawerOpen(true)}
            >
                Add Chemist
            </Button> */}
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                padding="16px"
                sx={{
                    width: 400, // Set the desired width of the Drawer
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400 // Set the same width for the paper inside the Drawer
                    }
                }}
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        // width="400px"
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
                            Add Chemist Order Products
                        </Typography>
                    </Box>
                    {/* <Box marginBottom={2}>
                        <Controls.Select
                            name="product_name"
                            label="Select the Product*"
                            value={data}
                            onChange={handleOrderProductChange}
                            // error={errors.product_name}
                            options={companyProducts}
                        />
                    </Box> */}
                    <Box marginBottom={2}>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel>{"Select the Visited With*"}</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                value={data}
                                onChange={handleOrderProductChange}
                                input={<OutlinedInput label="Select the Visited With*" />}
                                sx={{ width: '100%' }}
                                style={{
                                    borderBlockColor: "white",
                                    width: "100%",
                                    textAlign: 'start'
                                }}
                            >
                                {companyProducts.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {
                        data.map((key, index) => (
                            <MyChemist id={key} key={index} AddProduct={AddProduct} setAddProduct={setAddProduct} chemistList={chemistList} />
                        ))
                    }
                    <Stack spacing={1} direction="row">
                        <Button
                            variant="contained"
                            className="summit-button"
                            onClick={(e) => onAddOrderProduct(e)}
                        >
                            Submit{" "}
                        </Button>
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
    )
}



const MyChemist = ({ id, AddProduct, chemistList, setAddProduct }) => {
    const [orderedQuantity, setOrderQuantity] = useState({
        quantity: "",
        chemist_name: "",
    });

    useEffect(() => {
        if (id && orderedQuantity.quantity && orderedQuantity.chemist_name) {
            // Check if the product already exists in AddProduct
            const existingProductIndex = AddProduct.findIndex(item => item.id === id);
            if (existingProductIndex !== -1) {
                // Update existing product
                setAddProduct(prevAddProduct => {
                    const updatedAddProduct = [...prevAddProduct];
                    updatedAddProduct[existingProductIndex].product_information = [{
                        ordered_quantity: orderedQuantity.quantity,
                        select_the_chemist: orderedQuantity.chemist_name
                    }];
                    return updatedAddProduct;
                });
            } else {
                // Add new product
                setAddProduct(prevAddProduct => [
                    ...prevAddProduct,
                    {
                        id: id,
                        product_information: [{
                            ordered_quantity: orderedQuantity.quantity,
                            select_the_chemist: orderedQuantity.stockist_name
                        }]
                    }
                ]);
            }
        }
    }, [id, orderedQuantity]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setOrderQuantity(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <Box marginBottom={2}>
                <Controls.Select
                    name="chemist_name"
                    label="Select the Chemist*"
                    value={orderedQuantity.chemist_name}
                    onChange={handleInputChange}
                    options={chemistList}
                />
            </Box>
            <Box marginBottom={2}>
                <Controls.Input
                    name="quantity"
                    label="Order Quantity*"
                    value={orderedQuantity.quantity}
                    onChange={handleInputChange}
                />
            </Box>
        </>
    )
};


export default React.memo(ChemistOrderProduct); 