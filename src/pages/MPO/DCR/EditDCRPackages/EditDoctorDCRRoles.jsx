import { Box, Grid, Typography } from "@mui/material";
import React, { useState, useEffect} from "react";
import { useTransition } from 'react-transition-state';
import {  usePostHigherLevelExecutiveGetDataMutation } from '@/api/CompanySlices/companyUserRoleSlice';
import Controls from "@/reusable/forms/controls/Controls";
import RoundButton from "@/reusable/components/button/roundbutton";
import { FaPlus } from "react-icons/fa";
import { usePostVisitedWithMutation } from "@/api/MPOSlices/productApiSlice";
import { useGetVisitedWithByDcrIdQuery } from "@/api/MPOSlices/companyRolesSlice";
import { useGetUsersByIdQuery } from "@/api/MPOSlices/UserSlice";

const EditDoctorDCRRoles = ({ id, context, editApi, mpoId }) => {
  const [state, toggle] = useTransition({ timeout: 750, preEnter: true });
  // const mpo_id = useSelector(state => state.dcrData.selected_user);
  const [companyRoles, setCompanyRoles] = useState([]);
  const [companyRole] = usePostHigherLevelExecutiveGetDataMutation();
  const { data } = useGetVisitedWithByDcrIdQuery(id);

  useEffect(() => {
    companyRole({ id: mpoId })
      .then((res) => {
        const roles = []
        res.data.forEach((key) => {
          roles.push({ id: key.id, title: key.user_name.first_name + " " + key.user_name.last_name })
        })
        setCompanyRoles(roles);
      })
  }, [mpoId])

  const [CompanyRolesData, setCompanyRolesData] = useState('');
  const [Caching, setCaching] = useState(null);

  const { data: roleData } = useGetUsersByIdQuery(Caching?.roles_id);


  const onCompanyRolesData = e => setCompanyRolesData(e.target.value);

  const [PostVisitedWith] = usePostVisitedWithMutation();


  const handleVisitedWith = () => {
    const data = { dcr_id: id, roles_id: CompanyRolesData }
    PostVisitedWith(data)
      .then((res) => {
        if (res.data) {
          setCaching(res.data);
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
          // className="box-design-service1"
          onClick={
            () => toggle()}
          style={{ paddingBottom: '15px' }}
        >
          <Grid item xs={9}>
            <Typography className="form-label-design">
              Visited With
            </Typography>
          </Grid>
          <Grid item xs={3}>
            {/* <Box style={{ float: 'right' }}>
              {state.status == "entered" ? (
                <FontAwesomeIcon icon={faChevronDown} size={14} />
              ) : (
                <FontAwesomeIcon icon={faChevronUp} size={14} />
              )}
            </Box> */}
          </Grid>
        </Grid>
        <Box className={`box-form-design example ${state.status}`}>
          {
            data !== undefined ?
              <Box style={{ marginTop: '15px' }}>
                {
                  data?.length !== 0 ?
                    <Grid container spacing={1}>
                      {
                        data?.map((key, index) => (
                          <Grid item xs={4}>
                            <VisitedWithData id={key.roles_id} key={index} />
                          </Grid>
                        ))
                      }
                      {
                        Caching !== null ?
                          <Grid item xs={4}>
                            <Typography className="add-product-design">{roleData?.user_name?.first_name + ' ' + roleData?.user_name?.last_name}</Typography>
                          </Grid> : null
                      }
                    </Grid> : null
                }
              </Box> : null
          }
          <Box style={{ marginTop: '10px' }}>
            <Box style={{ marginBottom: '20px' }}>
              <Controls.Select
                name="roles_id"
                label="Visited With*"
                value={CompanyRolesData}
                onChange={onCompanyRolesData}
                options={companyRoles}
              />
            </Box>
          </Box>
          <Box style={{ marginTop: "5px" }}>
            <RoundButton
              classname="add-btn-design"
              buttonIcon={FaPlus}
              buttonText={"Add Visited With"}
              backgroundColor="rgb(32, 101, 209)"
              color="white"
              handleClick={handleVisitedWith}
            />
          </Box>
          {/* <ReusableFormsSelect
            originalId={id}
            context={context}
            editApi={editApi}
            getApi={useGetDoctorAllDCRByIdQuery}
            fieldName="company_roles"
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
                label: "Roles",
                debounce_time: 0,
                default: null,
              },
            ]}
            defaultValue={companyRoles}
            defaultValueList={true}
          /> */}
        </Box>

      </Box>
    </Grid>
  )
}

const VisitedWithData = ({ id }) => {
  const { data } = useGetUsersByIdQuery(id);
  return (
    <Box>
      <Typography className="add-product-design">{data?.user_name?.first_name + ' ' + data?.user_name?.last_name}</Typography>
    </Box>
  )
}

export default React.memo(EditDoctorDCRRoles);