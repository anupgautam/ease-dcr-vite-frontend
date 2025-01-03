import React, { useEffect, useState, useCallback, useMemo } from 'react'
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
import { useGetAllCompanyQuery, useGetAllRoleQuery, useGetCompanyRoleByIdQuery, useUpdateCompanyRoleMutation } from '../../../api/MPOSlices/SuperAdminSlice';

const EditCompanyRoles = ({ idharu, onClose }) => {

    //! Get other roles 
    const Roles = useGetAllRoleQuery();

    const roles = useMemo(() => {
        if (Roles.data) {
            return Roles.data.map((key) => ({ id: key.id, title: key.role_name }))
        }
        return [];
    }, [Roles])


    //! Getting CompanyRoles by ID
    const CompanyRoles = useGetCompanyRoleByIdQuery(idharu);

    const { data } = useGetAllCompanyQuery()

    const companies = useMemo(() => {
        if (data) {
            return data.map((key) => ({ id: key.id, title: key.company_name }))
        }
        return [];
    }, [data])


    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('role_name_value' in fieldValues)
            temp.role_name_value = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.role_name_value)
        temp.is_highest_priority = returnValidation(['null', 'lessThan50'], values.is_highest_priority)
        temp.role_name = returnValidation(['null'], values.role_name)
        temp.company_name = returnValidation(['null'], values.company_name)
        temp.priority_value = returnValidation(['null', 'lessThan50'], values.priority_value)
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
        company_name: '',
        role_name_value: "",
        priority_value: ""
    })

    useEffect(() => {
        if (CompanyRoles.data) {
            setInitialFValues({
                role_name: CompanyRoles.data.role_name,
                is_highest_priority: CompanyRoles.data.is_highest_priority,
                role_name_value: CompanyRoles.data.role_name_value,
                company_name: CompanyRoles.data.company_name,
                priority_value: CompanyRoles.data.priority_value

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
    const [updateCompanyRoles] = useUpdateCompanyRoleMutation();
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
            company_name: values.company_name
        };
        try {
            const response = await updateCompanyRoles(jsonData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Edited Company Roles' });
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
                            <Box marginBottom={2}>
                                <Controls.Select
                                    name="company_name"
                                    label="Company Name*"
                                    value={values.company_name}
                                    onChange={handleInputChange}
                                    error={errors.company_name}
                                    options={companies}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <Controls.Select
                                    name="role_name"
                                    label="Role Name*"
                                    value={values.role_name}
                                    onChange={handleInputChange}
                                    error={errors.role_name}
                                    options={roles}
                                />
                            </Box>
                            <Controls.Input
                                id="autoFocus"
                                autoFocus
                                name="role_name_value"
                                label="Roles Name Value*"
                                value={values.role_name_value}
                                onChange={handleInputChange}
                                error={errors.role_name_value}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="priority_value"
                                label="Priority Value*"
                                value={values.priority_value}
                                onChange={handleInputChange}
                                error={errors.priority_value}
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
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                onClick={(e) => { handleSubmit(e); onClose() }}
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