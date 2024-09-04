import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid
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
import { useGetAllProductsOptionsWithDivisionQuery } from '@/api/MPOSlices/productApiSlice';
import { useGetUsersByIdQuery } from '@/api/DemoUserSlice';
import { useAddChemistOrderedProductMutation } from '@/api/DCRs Api Slice/chemistDCR/chemistOrderedProductInformation';
import { useAddStockistOrderedProductMutation } from '@/api/DCRs Api Slice/stockistDCR/stockistOrderedProductSlice';
import { useSelector } from 'react-redux';


const StockistOrderedProduct = ({ id }) => {
    const { company_id, user_role, company_user_id, company_user_role_id, company_division_name } = useSelector((state) => state.cookie);

    const { data: mpoArea } = useGetUsersByIdQuery(company_user_role_id, {
        skip: !company_user_role_id
    });
    const { data: productData } = useGetAllProductsOptionsWithDivisionQuery({ company_name: company_id, division_name: company_division_name })

    const companyProducts = useMemo(() => {
        if (productData !== undefined) {
            return productData.map((key, index) => ({
                id: key.id,
                title: key.product_name.product_name
            }))
        }
        return [];
    }, [productData])

    const [OrderProduct] = useAddStockistOrderedProductMutation()

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('ordered_product' in fieldValues)
            //     temp.ordered_product = returnValidation(['null'], values.ordered_product)
            // temp.ordered_quantity = returnValidation(['null'], values.ordered_quantity)
            // temp.selectedDates = returnValidation(['null'], selectedDates)

            setErrors({
                ...temp
            })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const [initialFValues, setInitialFValues] = useState({
        ordered_quantity: "",
        ordered_product: ""
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
    }, [values.ordered_quantity, values.ordered_product])


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddOrderProduct = async (e) => {
        e.preventDefault();
        const data = {
            'product_id': values.ordered_product, 'ordered_quantity': values.ordered_quantity, 'dcr_id': id,
        }
        try {
            const response = await OrderProduct(data)
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Order Product.' });
                setInitialFValues({
                    ordered_quantity: "",
                    ordered_product: "",
                })
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            } else {
                setErrorMessage({ show: true, message: response.error.data[0] });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
        setIsDrawerOpen(false)
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
                Stockist Ordered Product
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
                            Add Stockist Order Products
                        </Typography>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="ordered_product"
                            label="Select the Product*"
                            value={values.ordered_product}
                            onChange={handleInputChange}
                            error={errors.ordered_product}
                            options={companyProducts}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="ordered_quantity"
                            label="Order Quantity*"
                            value={values.ordered_quantity}
                            onChange={handleInputChange}
                            error={errors.ordered_quantity}
                        // className={"drawer-first-name-input"}
                        />
                    </Box>
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

export default React.memo(StockistOrderedProduct);