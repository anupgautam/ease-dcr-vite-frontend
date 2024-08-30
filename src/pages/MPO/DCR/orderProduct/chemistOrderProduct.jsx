import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
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
import { useSelector } from 'react-redux';
import { useForm } from '../../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { useGetChemistOrderProductDataQuery } from '@/api/DCRs Api Slice/chemistDCR/chemistOrderedProductInformation';
import { useGetAllCompanyProductsWithoutPaginationQuery } from '@/api/productSlices/companyProductSlice';
import { useAddOrderedProductInformationChemistMutation } from '@/api/MPOSlices/tourPlan&Dcr';
import {
    useUpdateDcrForChemistValuesMutation
} from "@/api/MPOSlices/tourPlan&Dcr";
import { useGetStockistsByCompanyAreaQuery } from '@/api/MPOSlices/StockistSlice';


const ChemistOrderProduct = ({ id, data, handleOrderProductChange, allData }) => {
    const { company_id, user_role, company_user_id, company_area_id } = useSelector((state) => state.cookie);

    const [updateDcr] = useUpdateDcrForChemistValuesMutation();

    const { data: productData } = useGetAllCompanyProductsWithoutPaginationQuery(company_id)

    useEffect(() => {
        if (allData?.Formdata?.ordered_products?.length !== 0) {
            let sendingData = { id: allData?.id, visited_chemist: "", visited_area: "", date: "", shift: "", company_roles: [], ordered_products: allData?.Formdata?.ordered_products, company_product: [], rewards: [] };
            updateDcr({ id: allData?.id, value: sendingData })
                .then((res) => {
                })
        }
    }, [allData?.Formdata?.ordered_products, id])


    const companyProducts = useMemo(() => {
        if (productData !== undefined) {
            return productData.map((key, index) => ({
                id: key.id,
                title: key.product_name.product_name
            }))
        }
        return [];
    }, [productData])


    const { data: StockistsData } = useGetStockistsByCompanyAreaQuery({ company_name: company_id, company_area: company_area_id })


    const chemistList = useMemo(() => {
        if (StockistsData !== undefined) {
            return StockistsData.results?.map((key, index) => ({
                id: key.id,
                title: key.stockist_name.stockist_name
            }))
        }
        return [];
    }, [StockistsData])


    const [OrderProduct] = useAddOrderedProductInformationChemistMutation();
    const [AddProduct, setAddProduct] = useState([]);
    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('product_name' in fieldValues)
            //     temp.product_name = returnValidation(['null'], values.product_name)
            // temp.stockist_name = returnValidation(['null'], values.stockist_name)
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
    } = useForm(initialFValues, true)

    useEffect(() => {
        validate();
    }, [values.product_name, values.stockist_name])


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
                            stockist_name: "",
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
                            <InputLabel>{"Select the Product*"}</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                value={data}
                                onChange={handleOrderProductChange}
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
                    {
                        data.map((key, index) => (
                            <MyChemist id={key} dcr_id={allData?.id} key={index} AddProduct={AddProduct} setAddProduct={setAddProduct} chemistList={chemistList} />
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



const MyChemist = ({ id, AddProduct, chemistList, setAddProduct, dcr_id }) => {
    const [orderedInformation, setOrderInformation] = useState({
        id: "",
        product_information: [],
    });


    const { data: dcrData } = useGetChemistOrderProductDataQuery({ dcr_id: dcr_id, id: id });

    const transformDataWithKeys = (dataArray) => {
        if (dataArray && dataArray.length > 0) {
            const obj = dataArray[0];
            let transformed = {};

            Object.entries(obj).forEach(([key, value]) => {
                transformed[key] = value;
            });

            return transformed;
        }
        return null;
    };

    const transformedData = transformDataWithKeys(dcrData);
    const prevStockistDataIdRef = useRef(transformedData?.id);

    useEffect(() => {
        if (transformedData?.id) {
            prevStockistDataIdRef.current = transformedData.id;
        }
    }, [transformedData?.id]);

    useEffect(() => {
        if (prevStockistDataIdRef.current) {
            setOrderInformation((prev) => ({
                ...prev,
                id: prevStockistDataIdRef.current,
            }));
        }
    }, [prevStockistDataIdRef.current]);

    const [OrderData, setOrderedData] = useState([]);
    const [orderedQuantity, setOrderedQuantity] = useState({});

    const handleStockistChange = (event) => {
        const {
            target: { value },
        } = event;

        setOrderedData(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    const handleInputChange = (event, stockistId) => {
        const { name, value } = event.target;

        setOrderedQuantity((prevState) => ({
            ...prevState,
            [stockistId]: {
                ...prevState[stockistId],
                [name]: value,
            },
        }));
    };

    useEffect(() => {
        if (orderedInformation.id && OrderData.length > 0) {
            setAddProduct((prevAddProduct) => {
                const existingProductIndex = prevAddProduct.findIndex(item => item.id === id);

                const productInformation = OrderData.map(stockistId => ({
                    ordered_quantity: orderedQuantity[stockistId]?.quantity || "",
                    select_the_stockist: stockistId,
                }));

                if (existingProductIndex !== -1) {
                    const updatedAddProduct = [...prevAddProduct];
                    updatedAddProduct[existingProductIndex].product_information = productInformation;
                    return updatedAddProduct;
                } else {
                    return [
                        ...prevAddProduct,
                        {
                            id: orderedInformation.id,
                            product_information: productInformation,
                        },
                    ];
                }
            });
        }
    }, [orderedInformation.id, OrderData, orderedQuantity]);

    return (
        <>
            <Box marginBottom={2}>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel>{"Select the Stockist With*"}</InputLabel>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        multiple
                        value={OrderData}
                        onChange={handleStockistChange}
                        input={<OutlinedInput label="Select the Stockist With*" />}
                        sx={{ width: '100%' }}
                        style={{
                            borderBlockColor: "white",
                            width: "100%",
                            textAlign: 'start'
                        }}
                    >
                        {chemistList.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                                {item.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {OrderData.map((stockistId) => (
                <Box marginBottom={2} key={stockistId}>
                    <Controls.Input
                        name="quantity"
                        label="Order Quantity*"
                        value={orderedQuantity[stockistId]?.quantity || ""}
                        onChange={(event) => handleInputChange(event, stockistId)}
                    />
                </Box>
            ))}
        </>
    );
};



export default React.memo(ChemistOrderProduct); 