import React, { useEffect, useState, useCallback } from 'react'
import {
    Box,
    Typography, Button, Grid
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
//! Reusable Component
import { useForm, Form } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
//! Api Slices 
import {
    useGetCompanyRolesByIdQuery,
    useUpdateCompanyRolesMutation
} from '@/api/MPOSlices/companyRolesSlice';
import { useSelector } from 'react-redux';

const EditCompanyRoles = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Getting CompanyRoles by ID
    const CompanyRoles = useGetCompanyRolesByIdQuery(idharu);

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('role_name' in fieldValues)
            temp.role_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.role_name)
        temp.is_highest_value = returnValidation(['null', 'lessThan50'], values.is_highest_value)
        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        role_name: "",
        is_highest_priority: '',
    })

    useEffect(() => {
        if (CompanyRoles.data) {
            setInitialFValues({
                role_name: CompanyRoles.data.role_name.role_name,
                is_highest_priority: CompanyRoles.data.role_name.is_highest_priority,
            });
        }
    }, [CompanyRoles.data])


    const { values,
        errors,
        setErrors,
        handleInputChange
    } = useForm(
        initialFValues,
        true,
        false,
        true
    )


    useEffect(() => {
        validate();
    }, [
        values.role_name])

    //! Edit user
    const [updateCompanyRoles] = useUpdateCompanyRolesMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const jsonData = {
            id: idharu,
            role_name: values.role_name,
            priority_value: values.priority_value,
            role_name_value: values.role_name_value,
            is_highest_priority: values.is_highest_priority,
            company_name: company_id
        };
        try {
            const response = await updateCompanyRoles(jsonData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Edited CompanyRoles' });
            setTimeout(() => {
                setSuccessMessage({ show: false, message: '' });
            }, 3000);
        }
        catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
    }, [updateCompanyRoles, values])

    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
                padding="16px"
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        width="400px"
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: "40px" }}
                    >
                        <IconButton
                            className="close-button"
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Edit CompanyRoles
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>
                        <Box marginBottom={2}>
                            <Controls.Input
                                id="autoFocus"
                                autoFocus
                                name="role_name"
                                label="Role Name*"
                                value={values.role_name}
                                onChange={handleInputChange}
                                error={errors.role_name}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Checkbox
                                name="is_highest_priority"
                                label="Is Highest Priority"
                                value={values.is_highest_priority}
                                onChange={handleInputChange}
                            />
                        </Box>
                        <Stack spacing={1} direction="row">
                            {/* <Button
                                variant="contained"
                                className="summit-button"
                                onClick={(e) => { handleSubmit(e); onClose() }}
                            >
                                Submit{" "}
                            </Button> */}
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                onClick={(e) => handleSubmit(e)}
                                text="Submit"
                            />
                            <Button
                                variant="outlined"
                                className="cancel-button"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Form>

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
    );
};

export default React.memo(EditCompanyRoles);