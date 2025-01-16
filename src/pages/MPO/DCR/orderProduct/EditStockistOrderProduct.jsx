import React, { useState, useEffect, useCallback, useMemo } from 'react'
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
import { toast } from 'react-toastify';
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
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { useGetStockistOrderedProductsByDCRIdQuery } from '@/api/DCRs Api Slice/chemistDCR/chemistOrderedProductInformation';
import { useUpdateDcrForStockistValuesMutation, usePostStockistOrderedProductMutation } from '../../../../api/MPOSlices/tourPlan&Dcr';
import { useGetStockistsByCompanyAreaQuery } from '@/api/MPOSlices/StockistSlice';
import { useDeleteStockistOrderedProductByIdMutation } from '../../../../api/DCRs Api Slice/chemistDCR/chemistOrderedProductInformation';

const EditStockistOrderProduct = ({ id, allData }) => {

    const { company_id, user_role, company_user_id, company_user_role_id, company_division_name, company_area_id } = useSelector((state) => state.cookie);

    const newId = allData?.id ? allData?.id : allData?.data?.id;

    const [OrderedProductState, setOrderedProductState] = useState({
        dcr_id: id,
        product_id: "",
        ordered_quantity: "",
        company_name: company_id,
        mpo_name: company_user_role_id
    })

    // const { data: mpoArea } = useGetUsersByIdQuery(company_user_role_id, {
    //     skip: !company_user_role_id
    // });

    const { data: stockistOrderedProducts } = useGetStockistOrderedProductsByDCRIdQuery({ dcr_id: newId, company_name: company_id })

    console.log(stockistOrderedProducts)

    const [deleteOrderedProducts] = useDeleteStockistOrderedProductByIdMutation()

    const deleteProduct = (id) => {
        deleteOrderedProducts({ id })
    }

    const handleDelete = async (id) => {
        try {
            const response = await deleteOrderedProducts({ id });
            if (response?.data) {
                toast.success(`${response?.data?.message}`)
            } else if (response?.error) {
                toast.error(`Error: ${response?.error?.data?.message || "Failed to delete Ordered Product"}`);
            }
        } catch (error) {
            toast.error("An unexpected error occurred during deletion.");
        }
    };

    // const stockistOrderedProducts = useGetStockistOrderedProductsByDCRIdQuery(id)

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('ordered_product' in fieldValues)
            temp.ordered_product = returnValidation(['null'], values.ordered_product)
        temp.ordered_quantity = returnValidation(['null', 'OnlyNumber'], values.ordered_quantity)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const [initialFValues, setInitialFValues] = useState({
        product_name: "",
        stockist_name: "",
        quantity: ""
    })

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true, validate)

    useEffect(() => {
        validate();
    }, [values.product_name, values.stockist_name, values.quantity])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);

        setIsButtonDisabled(!valid);
    }, [values.product_name,
    values.stockist_name,
    values.quantity]);

    const [PostStockistOrderProduct] = usePostStockistOrderedProductMutation();



    const handleOrderedProductChange = (e) => {
        const { name, value } = e.target;
        setOrderedProductState({ ...OrderedProductState, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        PostStockistOrderProduct({ dcr_id: allData.id?allData.id:allData.data.id, product_id: OrderedProductState.product_id, ordered_quantity: OrderedProductState.ordered_quantity, company_name: company_id, mpo_name: allData?.mpo_name?allData.mpo_name.id:allData.data.mpo_name.id, })
            .then((res) => {
                if (res?.data) {
                    toast.success("Successfully Order Product")
                    // setSuccessMessage({ show: true, message: 'Successfully Order Product.' });
                    setOrderedProductState({
                        dcr_id: allData.id,
                        product_id: "",
                        ordered_quantity: "",
                        company_name: company_id,
                        select_the_stockist: "",
                        mpo_name: company_user_role_id,
                    });
                } else {
                    // setErrorMessage({ show: true, message: extractErrorMessage(res.error) });
                    // setTimeout(() => {
                    //     setErrorMessage({ show: false, message: '' });
                    // }, 3000);
                    toast.error(`${res?.error?.message}`)
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                // toast.error(error)
            });
    }

    const [updateDcr] = useUpdateDcrForStockistValuesMutation();

    useEffect(() => {
        if (allData?.Formdata?.ordered_products?.length !== 0) {
            let sendingData = { id: allData?.id, visited_stockist: "", visited_area: "", date: "", shift: "", company_roles: [], ordered_products: allData?.Formdata?.ordered_products, company_product: [], rewards: [] };
            updateDcr({ id: allData?.id, value: sendingData }, {
                skip: !allData?.id || !sendingData
            })
                .then((res) => {
                })
        }
    }, [allData?.Formdata?.ordered_products, id])

    const { data: productData } = useGetAllProductsOptionsWithDivisionQuery({ company_name: company_id, division_name: user_role === "admin" ? allData?.data?.mpo_name?.division_name?.id : company_division_name }, {
        skip: !company_id || !company_division_name
    })

    const companyProducts = useMemo(() => {
        if (productData !== undefined) {
            return productData?.map((key, index) => ({
                id: key.id,
                title: key.product_name?.product_name
            }))
        }
        return [];
    }, [productData])


    const { data: StockistsData } = useGetStockistsByCompanyAreaQuery({ company_name: company_id, company_area: company_area_id }, {
        skip: !company_user_role_id || !company_area_id
    })

    const chemistList = useMemo(() => {
        if (StockistsData !== undefined) {
            return StockistsData?.results?.map((key, index) => ({
                id: key.id,
                title: key?.stockist_name?.stockist_name
            }))
        }
        return [];
    }, [StockistsData])


    const [OrderProduct] = useAddStockistOrderedProductMutation();
    const [AddProduct, setAddProduct] = useState([]);


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddOrderProduct = async (e) => {
        e.preventDefault();
        // const data = {
        //     'product_id': values.ordered_product, 'ordered_quantity': values.ordered_quantity, 'dcr_id': id,
        // }
        // try {
        //     const response = await OrderProduct(data)
        //     if (response.data) {
        //         setSuccessMessage({ show: true, message: 'Successfully Order Product.' });
        //         setInitialFValues({
        //             ordered_quantity: "",
        //             ordered_product: "",
        //         })
        //         setTimeout(() => {
        //             setSuccessMessage({ show: false, message: '' });
        //         }, 3000);
        //     }
        //     else if (response?.error) {
        //         setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
        //         setLoading(false);
        //         setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
        //     }
        //     else {
        //         setErrorMessage({ show: true, message: "Something went wrong." });
        //         setTimeout(() => {
        //             setErrorMessage({ show: false, message: '' });
        //         }, 3000);
        //     }
        // } catch (error) {
        //     setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
        //     setTimeout(() => {
        //         setErrorMessage({ show: false, message: '' });
        //     }, 3000);
        // }
        // setIsDrawerOpen(false)

        try {
            for (const product of AddProduct) {
                const response = await OrderProduct(product);
                if (response?.data) {
                    toast.success("Successfully Order Product")
                    // setSuccessMessage({ show: true, message: 'Successfully Order Product.' });
                    setTimeout(() => {
                        // setSuccessMessage({ show: false, message: '' });
                        setInitialFValues({
                            product_name: "",
                            stockist_name: "",
                            quantity: ""
                        });
                    }, 3000);

                }
                else if (response?.error) {
                    // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                    toast.error(`${response?.error}`)
                    setLoading(false);
                    // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                }
                else {
                    // setErrorMessage({ show: true, message: "Something went wrong." });
                    // setTimeout(() => {
                    //     setErrorMessage({ show: false, message: '' });
                    // }, 3000);
                    toast.error("Something went wrong!")
                }
            }
        } catch (error) {
            toast.error("Some Error Occured. Try again Later.")
            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 3000);
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

                    <Box style={{ marginTop: "15px" }}>
                        {stockistOrderedProducts?.length > 0 ? (
                            <Box style={{ marginBottom: '20px' }}>
                                <Box
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        overflowX: "auto",
                                        padding: "10px 0",
                                        cursor: "pointer",
                                    }}
                                >
                                    {stockistOrderedProducts.map((key, index) => (
                                        <Box
                                            key={index}
                                            onClick={() => selectTourPlanById(key)}
                                            style={{
                                                position: "relative", // Allow positioning of the delete icon
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                width: '200px',
                                                padding: "15px",
                                                borderRadius: "8px",
                                                border: '1.2px solid #dbe0e4',
                                                backgroundColor: "#f7f8fa",
                                            }}
                                        >
                                            {/* Delete Icon */}
                                            <Box
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent parent onClick from firing
                                                    handleDelete(key.id);
                                                }}
                                                style={{
                                                    position: "absolute",
                                                    top: "10px",
                                                    right: "10px",
                                                    width: "20px",
                                                    height: "20px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "red",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "white",
                                                    fontWeight: "bold",
                                                    cursor: "pointer",
                                                    fontSize: "14px",
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                                                </svg>

                                            </Box>

                                            {/* Product Name */}
                                            <Box
                                                style={{
                                                    padding: "10px",
                                                    textAlign: 'center',
                                                    border: '1.2px solid #2d8960',
                                                    borderRadius: "5px",
                                                    width: '100%',
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                <Typography
                                                    style={{
                                                        fontSize: "16px",
                                                        fontWeight: '600',
                                                        color: '#2d8960'
                                                    }}
                                                >
                                                    {key?.product_id?.product_name?.product_name || 'N/A'}
                                                </Typography>
                                            </Box>

                                            {/* Quantity */}
                                            <Box
                                                style={{
                                                    backgroundColor: "#2d8960",
                                                    padding: "8px 12px",
                                                    borderRadius: "20px",
                                                    textAlign: "center",
                                                    color: "white",
                                                    fontWeight: '700',
                                                    fontSize: "14px",
                                                    width: 'fit-content'
                                                }}
                                            >
                                                Quantity: {key?.ordered_quantity || 0}
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        ) : (
                            <Typography>No stockist ordered products found.</Typography>
                        )}
                    </Box>


                    {/* <Box marginBottom={2}>
                        <Controls.Select
                            name="ordered_product"
                            label="Select the Product*"
                            value={values.ordered_product}
                            onChange={handleInputChange}
                            error={errors.ordered_product}
                            options={companyProducts}
                        />
                    </Box> */}

                    <Box marginBottom={2}>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel>{"Select the Product*"}</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple={false}
                                name="product_id"
                                value={OrderedProductState.product_id}
                                onChange={handleOrderedProductChange}
                                input={<OutlinedInput label="Select the Product*" />}
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
                    <Box marginTop={2} marginBottom={2}>
                        <Controls.Input
                            name="ordered_quantity"
                            label="Order Quantity*"
                            value={OrderedProductState.ordered_quantity}
                            onChange={handleOrderedProductChange}
                            error={errors.ordered_quantity}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        {/* <Button
                            variant="contained"
                            className="summit-button"
                            onClick={handleSubmit}
                        >
                            Submit{" "}
                        </Button> */}
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            disabled={isButtonDisabled}
                            onClick={(e) => handleSubmit(e)}
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

export default React.memo(EditStockistOrderProduct);