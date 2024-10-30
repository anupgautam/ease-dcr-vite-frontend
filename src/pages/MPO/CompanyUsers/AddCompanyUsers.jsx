import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';

import { useForm } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { useCreateCompanyUserMutation, useGetAllCompanyRoleQuery, useGetAllCompanyQuery } from '../../../api/MPOSlices/SuperAdminSlice';

const AddCompanyUsers = () => {

    //! Get Companies
    const { data } = useGetAllCompanyQuery()

    const companies = useMemo(() => {
        if (data) {
            return data.map((key) => ({ id: key.id, title: key.company_name }))
        }
        return [];
    }, [data])



    //! Create Chemist
    const [createCompanyUser] = useCreateCompanyUserMutation()

    const initialFValues = {
        middle_name: "",
    };


    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('first_name' in fieldValues)
            temp.first_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.first_name);
        temp.middle_name = returnValidation(['number', 'lessThan50', 'specialcharacter'], values.middle_name);
        if ('last_name' in fieldValues)
            temp.last_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.last_name);
        if ('address' in fieldValues)
            temp.address = returnValidation(['null'], values.address);
        if ('role_name' in fieldValues)
            temp.role_name = returnValidation(['null'], values.role_name);
        if ('phone_number' in fieldValues)
            temp.phone_number = returnValidation(['null', 'phonenumber', 'specialchracter'], values.phone_number);
        if ('email' in fieldValues)
            temp.email = returnValidation(['null', 'email'], values.email);
        setErrors({
            ...temp
        })
        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
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

    }, [values])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Get other roles 
    const Roles = useGetAllCompanyRoleQuery({ company_name: values.company_name });

    const roles = useMemo(() => {
        if (Roles.data) {
            return Roles.data.map((key) => ({ id: key.id, title: key.role_name.role_name }))
        }
        return [];
    }, [Roles])


    //!Modal wala ko click event
    const onAddCompanyUsers = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const jsonData = {
            first_name: values.first_name,
            middle_name: values.middle_name,
            last_name: values.last_name,
            address: values.address,
            phone_number: values.phone_number,
            email: values.email,
            role_name: values.role_name,
            company_name:values.company_name
            // executive_level: values.executive_level,
            // company_name: company_id,
            // is_tp_locked: false,
            // company_area: areaOptions,
            // division_name: divisionOptions,
            // station_type: values.station_type,
            // is_active: true,
            // date_of_joining: formattedDate,
        };
        console.log(jsonData)
        try {
            const response = await createCompanyUser(jsonData)
            if (response?.data) {
                setSuccessMessage({ show: true, message: 'Successfully Added User' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
                setIsDrawerOpen(false);
            } else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                setLoading(false);
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            } else {
                setErrorMessage({ show: true, message: response?.error?.data[0] || response?.error?.data?.user_name?.email[0] });
                setTimeout(() => {
                    setIsDrawerOpen(false);
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        } catch (err) {
            setErrorMessage({ show: true, message: 'Backend error' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
        finally {
            setLoading(false)
        }

    }, [createCompanyUser, values]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsDrawerOpen(true)}>
                Add
            </Button>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sx={{
                    width: 400,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400
                    }
                }}
            >
                <Box padding="20px">
                    <Box
                        p={1}
                        textAlign="center"
                        role="presentation"
                        style={{ marginBottom: "40px" }}
                    >
                        <IconButton onClick={() => setIsDrawerOpen(false)}>
                            <Close />
                        </IconButton>
                        <Typography variant="h6">Add CompanyUser</Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={6} marginBottom={2}>
                            <Controls.Input
                                id="autoFocus"
                                autoFocus
                                name="first_name"
                                label="First name*"
                                value={values.first_name}
                                onChange={handleInputChange}
                                error={errors.first_name}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controls.Input
                                name="middle_name"
                                label="Middle name"
                                value={values.middle_name}
                                onChange={handleInputChange}
                                error={errors.middle_name}
                            />
                        </Grid>
                    </Grid>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="last_name"
                            label="Last name*"
                            value={values.last_name}
                            onChange={handleInputChange}
                            error={errors.last_name}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="email"
                            label="Email*"
                            value={values.email}
                            onChange={handleInputChange}
                            error={errors.email}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="company_name"
                            label="Company Name*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.company_name}
                            options={companies}
                        />
                    </Box>
                    <Grid container spacing={2} marginBottom={2}>
                        <Grid item xs={6}>
                            <Controls.Input
                                name="address"
                                label="Address*"
                                value={values.address}
                                onChange={handleInputChange}
                                error={errors.address}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controls.Input
                                name="phone_number"
                                label="Contact Number*"
                                value={values.phone_number}
                                onChange={handleInputChange}
                                error={errors.phone_number}
                            />
                        </Grid>
                    </Grid>

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
                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            onClick={(e) => onAddCompanyUsers(e)}
                            text="Submit"
                        />
                        <Button
                            variant="outlined"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Stack>

                    {loading && (
                        <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1000 }}>
                            <CircularProgress />
                        </Grid>
                    )}

                    {ErrorMessage.show && (
                        <Box className="messageContainer errorMessage">
                            <Typography style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</Typography>
                        </Box>
                    )}

                    {SuccessMessage.show && (
                        <Box className="messageContainer successMessage">
                            <Typography style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</Typography>
                        </Box>
                    )}
                </Box>
            </Drawer>
        </>
    )
}

export default React.memo(AddCompanyUsers)