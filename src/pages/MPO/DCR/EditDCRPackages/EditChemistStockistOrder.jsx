import { Box, Grid, Typography } from "@mui/material";
import React, { useMemo } from "react";
import {
  useGetChemistOrderedProductByIdQuery,
  useDeleteChemistOrderedProductByIdMutation,
  useAddChemistOrderedProductMutation
} from '@/api/DCRs Api Slice/chemistDCR/chemistOrderedProductInformation';
import ReusableForms from "@/reusable/components/forms/controls/ReusableForms";

import { useTransition } from 'react-transition-state';
import { useSelector } from "react-redux";
import { useGetAllStockistsWithoutPaginationQuery } from "@/api/MPOSlices/StockistSlice";
import { useGetUsersByIdQuery } from "@/api/DemoUserSlice";

const EditChemistStockistOrder = ({ id, context, editApi, companyArea }) => {
  const [state, toggle] = useTransition({ timeout: 750, preEnter: true });
  // const companyStockists = useSelector(state => state.dcrData.visited_stockist);
  const mpo_id = useSelector(state => state.dcrData.selected_user);
  const { data: mpoArea } = useGetUsersByIdQuery(mpo_id);
  const { data: StockistData } = useGetAllStockistsWithoutPaginationQuery({ company_name: company_id, company_area: mpoArea?.company_area?.id }, {
    skip: mpoArea,
  })

  const companyStockists = useMemo(() => {
    if (StockistData !== undefined) {
      return StockistData.data.map((key) => ({
        id: key.id,
        title: key.stockist_name.stockist_name
      }))
    }
    return [];
  }, [StockistData])


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
        <Box className={`example ${state.status}`}>
          <ReusableForms
            originalId={id}
            context={context}
            editApi={editApi}
            getApi={useGetChemistOrderedProductByIdQuery}
            fieldName="product_information"
            fieldList={[
              'product_information']}
            postAPI={useAddChemistOrderedProductMutation}
            deleteAPI={useDeleteChemistOrderedProductByIdMutation}
            mappedData={[
              {
                field_name: "select_the_stockist",
                field_form: "select",
                label: "Select Stockists",
                debounce_time: 0,
                default: null,
                options: companyStockists,
                isUpdate: false,
              },
              {
                field_name: "ordered_quantity",
                field_form: "input",
                default: null,
                label: "Ordered Quantity"
              }
            ]}

          />
        </Box>
      </Box>
    </Grid>
  )
}

export default React.memo(EditChemistStockistOrder);