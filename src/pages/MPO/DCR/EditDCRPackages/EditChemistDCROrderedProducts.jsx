import { Box, Grid, Typography } from "@material-ui/core";
import React, { useState, useCallback, useMemo } from "react";
import ReusableFormsSelect from "@/reusable/components/forms/controls/ReusableFormSelect";
import {
    useGetChemistAllDCRByIdQuery,
    useAddChemistsAllDCRMutation,
    useDeleteChemistsAllDCRByIdMutation
} from "@/api/DCRs Api Slice/chemistDCR/ChemistDCRAllSlice";
import { useTransition } from 'react-transition-state';
import { useSelector } from "react-redux";
import EditChemistOrderedProduct from "../EditDCRs/EditChemistOrderedProduct";
import {
    Drawer,
} from '@mui/material';
import { useGetUsersByIdQuery } from "@/api/DemoUserSlice";
import { useGetAllProductsOptionsWithDivisionQuery } from "@/api/MPOSlices/productApiSlice";
import Cookies from "js-cookie";

const EditChemistDCROrderedProducts = ({ id, context, editApi }) => {
    const [state, toggle] = useTransition({ timeout: 750, preEnter: true });
    const [updateClick, setUpdateClick] = useState(false);
    const [productID, setProductID] = useState(null);
    const mpo_id = useSelector(state => state.dcrData.selected_user);
    const { data: mpoArea } = useGetUsersByIdQuery(mpo_id);
    const { data: productData } = useGetAllProductsOptionsWithDivisionQuery({ company_name: Cookies.get('company_id'), division_name: mpoArea?.division_name })

    const companyProducts = useMemo(() => {
        if (productData !== undefined) {
            return productData.map((key) => ({
                id: key.id,
                title: key.product_name.product_name
            }))
        }
        return [];
    }, [productData])

    const handleClick = useCallback((e, id) => {
        setProductID(id);
        setUpdateClick(!updateClick);
    }, [])

    const companyArea = 1;

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
                            Add Chemist Ordered Products
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
                <Box className={`box-form-design example ${state.status}`}>
                    <ReusableFormsSelect
                        originalId={id}
                        context={context}
                        editApi={editApi}
                        getApi={useGetChemistAllDCRByIdQuery}
                        fieldName="ordered_products"
                        fieldList={[
                            'company_product',
                            'company_roles',
                            'rewards',
                            'ordered_products']}
                        postAPI={useAddChemistsAllDCRMutation}
                        deleteAPI={useDeleteChemistsAllDCRByIdMutation}
                        isUpdate={true}
                        updateComponent={handleClick}
                        mappedData={[
                            {
                                field_name: "id",
                                field_form: "select",
                                label: "Promoted Products",
                                debounce_time: 0,
                                default: null,
                            },
                        ]}
                        defaultValue={companyProducts}
                        defaultValueList={true}
                    />
                </Box>
                <Drawer
                    open={updateClick}
                    onClose={handleClick}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    {/* <Box style={{padding:'20px',width: '18rem'}}>
                              <Typography id="modal-modal-title" variant="h6" component="h2">
                                Text in a modal
                              </Typography>
                              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                              </Typography>
                            </Box> */}
                    <EditChemistOrderedProduct id={productID} onClose={handleClick} companyArea={companyArea} />
                </Drawer>

            </Box>
        </Grid>
    )
}

export default React.memo(EditChemistDCROrderedProducts);