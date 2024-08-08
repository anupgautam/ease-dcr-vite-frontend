import { Box, Grid, Typography } from "@mui/material";
import React, { useState, useMemo } from "react";
import { useTransition } from 'react-transition-state';
import { FaPlus } from "react-icons/fa";
import RoundButton from "@/reusable/components/button/roundbutton";
import Controls from "@/reusable/forms/controls/Controls";
import { useGetAllRewardsByCompanyIdQuery, useGetRewardsByDcrIdQuery, useGetRewardsByIdQuery, usePostRewardForDcrMutation } from "@/api/DCRs Api Slice/rewardsAPISlice";
import Cookies from "js-cookie";

const EditDCRRewards = ({ id, context, editApi }) => {
  const [state, toggle] = useTransition({ timeout: 750, preEnter: true });
  // const companyRewards = useSelector(state => state.dcrData.rewards);
  const { data: rewardAllData } = useGetAllRewardsByCompanyIdQuery(Cookies.get('company_id'));
  const { data: rewardDcr } = useGetRewardsByDcrIdQuery(id);
  const [DcrRewardPost] = usePostRewardForDcrMutation();

  const rewardList = useMemo(() => {
    if (rewardAllData !== undefined) {
      return rewardAllData.map((key) => ({
        id: key.id,
        title: key.reward
      }))
    }
    return [];
  }, [rewardAllData])

  const [rewardData, setRewardData] = useState('');
  const [Caching, setCaching] = useState(null);

  const { data: rewardCaching } = useGetRewardsByIdQuery(Caching?.reward_id);

  const onRewardData = e => setRewardData(e.target.value);

  const handleReward = () => {
    const data = { dcr_id: id, reward_id: rewardData }
    DcrRewardPost(data)
      .then((res) => {
        if (res.data) {
          setRewardData('')
          setCaching(res.data)
        }
      })
      .catch((err) => {
      })
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
          <Grid item xs={11}>
            <Typography className="form-label-design">
              Rewards
            </Typography>
          </Grid>
          <Grid item xs={1}>
            <Box style={{ float: 'right' }}>
              {/* {state.status == "entered" ? (
                <FontAwesomeIcon icon={faChevronDown} size={14} />
              ) : (
                <FontAwesomeIcon icon={faChevronUp} size={14} />
              )} */}
            </Box>
          </Grid>
        </Grid>
        <Box className={`box-form-design example ${state.status}`}>
          {
            rewardDcr !== undefined ?
              <Box style={{ marginTop: '15px' }}>
                {
                  rewardDcr?.length !== 0 ?
                    <Grid container spacing={1}>
                      {
                        rewardDcr?.map((key, index) => (
                          <Grid item xs={4}>
                            <CompanyRewardList id={key.reward_id} key={index} />
                          </Grid>
                        ))
                      }
                      {/* {
                        Caching !== null ?
                          <Grid item xs={4}>
                            <Typography className="add-product-design">{rewardCaching?.reward}</Typography>
                          </Grid> : null
                      } */}
                    </Grid> : null
                }
              </Box> : null
          }
          <Box style={{ marginTop: '10px' }}>
            <Box style={{ marginBottom: '20px' }}>
              <Controls.Select
                name="reward_id"
                label="Reward*"
                value={rewardData}
                onChange={onRewardData}
                options={rewardList}
              />
            </Box>
          </Box>
          <Box style={{ marginTop: "5px" }}>
            <RoundButton
              classname="add-btn-design"
              buttonIcon={FaPlus}
              buttonText={"Add Reward"}
              backgroundColor="rgb(32, 101, 209)"
              color="white"
              handleClick={handleReward}
            />
          </Box>
          {/* <ReusableFormsSelect
            originalId={id}
            context={context}
            editApi={editApi}
            getApi={useGetDoctorAllDCRByIdQuery}
            fieldName="rewards"
            fieldList={[
              'company_product',
              'company_roles',
              'rewards']}
            postAPI={useAddDoctorsAllDCRMutation}
            deleteAPI={useDeleteDoctorsAllDCRByIdMutation}
            mappedData={[
              {
                field_name: "id",
                field_form: "select",
                label: "Reward Name",
                debounce_time: 0,
                default: null,
              },
            ]}
            defaultValue={companyRewards}
            defaultValueList={true}
          /> */}
        </Box>

      </Box>
    </Grid>
  )
}

const CompanyRewardList = ({ id }) => {
  const { data } = useGetRewardsByIdQuery(id);
  return (
    <Box>
      <Typography className="add-product-design">{data?.reward}</Typography>
    </Box>
  )
}

export default React.memo(EditDCRRewards);