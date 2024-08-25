import { Box, Grid, Typography } from "@mui/material";
import React, { useMemo, useContext } from "react";
import ReusableFormsSelect from "@/reusable/components/forms/controls/ReusableFormSelect";
import {
  useGetChemistAllDCRByIdQuery,
  useAddChemistsAllDCRMutation,
  useDeleteChemistsAllDCRByIdMutation
} from "@/api/DCRs Api Slice/chemistDCR/ChemistDCRAllSlice";
import { useTransition } from 'react-transition-state';
import { useGetAllRewardsByCompanyIdQuery } from "@/api/DCRs Api Slice/rewardsAPISlice";

const EditDCRChemistRewards = ({ id, context, editApi }) => {
  const [state, toggle] = useTransition({ timeout: 750, preEnter: true });
  // const companyRewards = useSelector(state => state.dcrData.rewards);
  const { data: rewardAllData } = useGetAllRewardsByCompanyIdQuery(company_id);

  const rewardList = useMemo(() => {
    if (rewardAllData !== undefined) {
      return rewardAllData.map((key) => ({
        id: key.id,
        title: key.reward
      }))
    }
    return [];
  }, [rewardAllData])

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
              Add Rewards
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
            fieldName="rewards"
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
                label: "Reward Name",
                debounce_time: 0,
                default: null,
              },
            ]}
            defaultValue={rewardList}
            defaultValueList={true}
          />
        </Box>

      </Box>
    </Grid>
  )
}

export default React.memo(EditDCRChemistRewards);