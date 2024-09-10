import { Box, Grid, Typography } from "@mui/material";
import RoundButton from "@/reusable/components/button/roundbutton";
import { FaPlus } from "react-icons/fa";
import React, { useState, useCallback, useMemo } from "react";
import { useTransition } from 'react-transition-state';
import {
    useGetStockistOrderedProductByDCRIdQuery,
    useAddStockistOrderedProductMutation,
    useDeleteStockistOrderedProductByIdMutation,
    useUpdateStockistOrderedProductMutation
} from "@/api/DCRs Api Slice/stockistDCR/stockistOrderedProductSlice";
import Controls from "@/reusable/components/forms/controls/Controls";
import { useGetAllProductsOptionsWithDivisionQuery } from "@/api/MPOSlices/productApiSlice";
import { useSelector } from 'react-redux';

const EditStockistDCRProducts = ({ id, context, editApi, division }) => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const [state, toggle] = useTransition({ timeout: 750, preEnter: true });
    const [postData, setPostData] = useState({});
    // const companyProducts = useSelector(state => state.dcrData.company_products);
    const { data: productData } = useGetAllProductsOptionsWithDivisionQuery({ company_name: company_id, division_name: division?.id }, {
        skip: !company_id || !division?.id
    })

    const companyProducts = useMemo(() => {
        if (productData !== undefined) {
            return productData.map((key) => ({
                id: key.id,
                title: key.product_name.product_name
            }))
        }
        return [];
    }, [productData])

    const stockistOrderedProduct = useGetStockistOrderedProductByDCRIdQuery(id);
    const [updateOrderedProduct] = useUpdateStockistOrderedProductMutation();
    const [addOrderedProduct] = useAddStockistOrderedProductMutation();
    const [deleteOrderedProduct] = useDeleteStockistOrderedProductByIdMutation();

    const addForm = (e) => {

    }

    const changeProduct = (e, id, data, timeout = false) => {
        const postData = { ...data, id: id, [e.target.name]: e.target.value }
        if (timeout) {
            setTimeout(() => {
                updateOrderedProduct(postData);
            }, [2000])
        }
        else {
            updateOrderedProduct(postData);
        }

    }

    const addProduct = (e) => {
        addOrderedProduct({
            'dcr_id': id,
            'product_id': null,
            'ordered_quantity': null,
        })
    }

    const deleteProduct = (e, id) => {
        deleteOrderedProduct(id);
    }

    return (
        <Grid item xs={12}>
            <Box className="box-design-service">
                <Grid
                    container
                    className="box-design-service1"
                    onClick={
                        () => toggle()}
                >
                    <Grid item xs={9}>
                        <Typography className="form-label-design">
                            Add Products
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Box style={{ textAlign: "end" }}>
                            {/* {state.status == "entered" ? (
                                <FontAwesomeIcon icon={faChevronDown} size={14} />
                            ) : (
                                <FontAwesomeIcon icon={faChevronUp} size={14} />
                            )} */}
                        </Box>
                    </Grid>
                </Grid>
                <Box className={`box-form-design example ${state.status}`} style={{ marginTop: "15px" }}>
                    {stockistOrderedProduct?.data?.map((key) => (
                        <>
                            <Box marginBottom={2}>
                                <Controls.Select
                                    name="product_id"
                                    label="Product Id*"
                                    value={key.ordered_product.ordered_product}
                                    onChange={(e) => changeProduct(e, key.id, { 'dcr_id': key.dcr_id, 'ordered_quantity': key.ordered_product.ordered_quantity })}
                                    options={companyProducts}
                                />
                            </Box>
                            <Box style={{ marginTop: '20px', marginBottom: "15px" }}>
                                <Controls.Input
                                    name="ordered_quantity"
                                    label="Ordered Quantity*"
                                    value={key.ordered_product.ordered_quantity}
                                    onChange={(e) => changeProduct(e, key.id, { 'dcr_id': key.dcr_id, 'product_id': key.ordered_product.ordered_product })}
                                />
                            </Box>
                            <RoundButton
                                classname="add-btn-design"
                                buttonIcon={FaPlus}
                                buttonText={"Delete"}
                                handleClick={(e) => deleteProduct(e, key.id)}
                                backgroundColor="#ab0403"
                                color="white"
                            />

                        </>
                    ))}
                    {'   '}
                    <RoundButton
                        classname="add-btn-design"
                        buttonIcon={FaPlus}
                        buttonText={"Add"}
                        handleClick={(e) => addProduct(e)}
                        backgroundColor="rgb(32, 101, 209)"
                        color="white"
                    />

                </Box>

            </Box>
        </Grid>
    )
}

export default React.memo(EditStockistDCRProducts);