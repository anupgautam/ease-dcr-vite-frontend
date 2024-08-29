import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';

import { useForm } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';

import {
    useCreateCompanyRolesMutation,
    useGetAllRolesQuery
} from '@/api/MPOSlices/companyRolesSlice';
import { useSelector } from 'react-redux';


const AddCompanyRoles = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Create Chemist
    const [createCompanyRoles] = useCreateCompanyRolesMutation()

    //! Get other roles
    const Roles = useGetAllRolesQuery(company_id);

    const roles = useMemo(() => {
        if (Roles.data) {
            return Roles.data.map((key) => ({ id: key.role_id, title: key.role_name }))
        }
        return [];
    }, [Roles])

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('role_name' in fieldValues)
            temp.role_name = returnValidation(['null', 'lessThan50', 'specialcharacter'], values.role_name)
        temp.role_name = returnValidation(['null'], values.roles_name)
        temp.priority_value = returnValidation(['null', 'lessThan50'], values.priority_value)
        temp.is_highest_priority = returnValidation(['null', 'lessThan50'], values.is_highest_priority)

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const initialFValues = {
        is_highest_priority: false
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true)

    useEffect(() => {
        validate();

    }, [values.role_name, values.priority_value])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddRoles = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append("role_name", values.role_name);
        formData.append("priority_value", values.priority_value);
        formData.append('role_name_value', values.roles_name)
        formData.append('is_highest_priority', values.is_highest_priority)
        formData.append("company_name", company_id);
        try {
            const response = await createCompanyRoles(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Added Roles' });
            setTimeout(() => {
                setSuccessMessage({ show: false, message: '' });
            }, 3000);
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        } finally {
            setLoading(false)
        }

        setIsDrawerOpen(false)
    }, [createCompanyRoles, values]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsDrawerOpen(true)} >
                Add
            </Button>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                padding="16px"
                sx={{
                    width: 400, // Set the desired width of the Drawer
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400 // Set the same width for the paper inside the Drawer
                    }
                }}
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: "40px" }}
                    >
                        <IconButton
                            className="close-button"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Add CompanyRoles
                        </Typography>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="role_name"
                            label="Role Name*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.role_name}
                            options={roles}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            id="autoFocus"
                            autoFocus
                            name="roles_name"
                            label="Roles Name*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.roles_name}
                        />
                    </Box>

                    <Box marginBottom={2}>
                        <Controls.Input
                            name="priority_value"
                            label="Priority Value*"
                            value={values.name}
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
                            onClick={(e) => onAddRoles(e)}
                            text="Submit"
                        />
                        <Button
                            variant="outlined"
                            className="cancel-button"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Drawer>
            {loading && (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1000 }}>
                    <CircularProgress />
                </Grid>
            )}
            {ErrorMessage.show && (
                <Grid>
                    <Box className="messageContainer errorMessage">
                        <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                    </Box>
                </Grid>
            )}
            {SuccessMessage.show && (
                <Grid>
                    <Box className="messageContainer successMessage">
                        <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                    </Box>
                </Grid>
            )}
        </>
    )
}

export default React.memo(AddCompanyRoles)