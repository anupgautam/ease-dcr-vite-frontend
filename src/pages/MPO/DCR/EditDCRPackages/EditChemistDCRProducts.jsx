import { Box, Grid, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import ReusableFormsSelect from "@/reusable/components/forms/controls/ReusableFormSelect";

import {
  useGetChemistAllDCRByIdQuery,
  useAddChemistsAllDCRMutation,
  useDeleteChemistsAllDCRByIdMutation
} from "@/api/DCRs Api Slice/chemistDCR/ChemistDCRAllSlice";
import { useTransition } from 'react-transition-state';
import { useSelector } from "react-redux";
import { useGetUsersByIdQuery } from "@/api/DemoUserSlice";
import Cookies from "js-cookie";
import { useGetAllProductsOptionsWithDivisionQuery } from "@/api/MPOSlices/productApiSlice";

const EditChemistDCRProducts = ({ id, context, editApi }) => {
  const [state, toggle] = useTransition({ timeout: 750, preEnter: true });
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
              Add Promoted Product
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
            fieldName="company_product"
            fieldList={[
              'company_product',
              'company_roles',
              'rewards',
              'ordered_products']}
            postAPI={useAddChemistsAllDCRMutation}
            deleteAPI={useDeleteChemistsAllDCRByIdMutation}
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

      </Box>
    </Grid>
  )
}

export default React.memo(EditChemistDCRProducts);