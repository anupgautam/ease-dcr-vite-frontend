import { Box, Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import ReusableFormsSelect from "@/reusable/components/forms/controls/ReusableFormSelect";
import {
  useGetChemistAllDCRByIdQuery,
  useAddChemistsAllDCRMutation,
  useDeleteChemistsAllDCRByIdMutation
} from "@/api/DCRs Api Slice/chemistDCR/ChemistDCRAllSlice";
import { useTransition } from 'react-transition-state';
import { useSelector } from "react-redux";
import { usePostHigherLevelExecutiveGetDataMutation } from '@/api/CompanySlices/companyUserRoleSlice';


const EditChemistDCRRoles = ({ id, context, editApi, mpoId }) => {
  const [state, toggle] = useTransition({ timeout: 750, preEnter: true });
  const mpo_id = useSelector(state => state.dcrData.selected_user);
  const [companyRoles, setCompanyRoles] = useState([]);
  const [companyRole] = usePostHigherLevelExecutiveGetDataMutation();

  useEffect(() => {
    companyRole({ id: mpo_id }).then((res) => {
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
          // className="box-design-service1"
          onClick={
            () => toggle()}
        >
          <Grid item xs={10}>
            <Typography className="form-label-design">
              Add Visited With
            </Typography>
          </Grid>
          <Grid item xs={1}>
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
            fieldName="company_roles"
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

export default React.memo(EditChemistDCRRoles);