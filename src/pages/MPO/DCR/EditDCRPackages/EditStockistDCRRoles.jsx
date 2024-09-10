import { Box, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import ReusableFormsSelect from "@/reusable/components/forms/controls/ReusableFormSelect";
// import { 
// useGetDoctorAllDCRByIdQuery,
// useDeleteDoctorsAllDCRByIdMutation,
// useAddDoctorsAllDCRMutation } from "@/api/DCRs Api Slice/doctorDCR/DoctorDCRAllSlice";
import {
  useGetStockistAllDCRByIdQuery,
  useDeleteStockistsAllDCRByIdMutation,
  useAddStockistsAllDCRMutation
} from "@/api/DCRs Api Slice/stockistDCR/stockistDCRAllSlice";
import { useTransition } from 'react-transition-state';
import { useSelector } from "react-redux";
import { usePostHigherLevelExecutiveGetDataMutation } from '@/api/CompanySlices/companyUserRoleSlice';


const EditStockistDCRRoles = ({ id, context, editApi }) => {
  const [state, toggle] = useTransition({ timeout: 750, preEnter: true });
  const mpo_id = useSelector(state => state.dcrData.selected_user);
  const [companyRoles, setCompanyRoles] = useState([]);
  const [companyRole] = usePostHigherLevelExecutiveGetDataMutation();

  useEffect(() => {
    companyRole({ id: mpo_id }, {
      skip: !mpo_id
    }).then((res) => {
      const roles = []
      res.data.forEach((key) => {
        roles.push({ id: key.id, title: key.user_name.first_name + " " + key.user_name.last_name })
      })
      setCompanyRoles(roles);
    })
  }, [mpo_id])


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
              Add Roles
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
            getApi={useGetStockistAllDCRByIdQuery}
            fieldName="company_roles"
            fieldList={[
              'company_roles',
              'rewards']}
            postAPI={useAddStockistsAllDCRMutation}
            deleteAPI={useDeleteStockistsAllDCRByIdMutation}
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
          />
        </Box>

      </Box>
    </Grid>
  )
}

export default React.memo(EditStockistDCRRoles);