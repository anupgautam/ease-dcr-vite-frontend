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
import {
    useCreateCompanyMutation
} from '../../../api/MPOSlices/SuperAdminSlice'

import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';

const AddCompany = () => {

    //! Create Chemist
    const [createCompany] = useCreateCompanyMutation()


    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('company_name' in fieldValues)
            temp.company_name = returnValidation(['null', 'lessThan50', 'specialcharacter'], values.company_name)
        if ('company_contact_number' in fieldValues)
            temp.company_contact_number = returnValidation(['null', 'phonenumber', 'specialchracter'], values.company_contact_number);
        if ('company_email_address' in fieldValues)
            temp.company_email_address = returnValidation(['null'], values.company_email_address);
        if ('company_address' in fieldValues)
            temp.company_address = returnValidation(['null'], values.company_address);
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const initialFValues = {
        // is_highest_priority: false
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

    }, [values.company_name])
    console.log('calues', values);

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });


    //!Modal wala ko click event
    const onAddCompany = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const jsonData = {
            company_name: values.company_name,
            company_phone_number: values.company_phone_number,
            company_email_address: values.company_email_address,
            company_address: values.company_address,
            exprired_at: values.exprired_at
        };
        try {
            const response = await createCompany(jsonData).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Added Company' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
                setIsDrawerOpen(false)
            }
            else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                setLoading(false);
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            }
            else {
                setErrorMessage({ show: true, message: "Error" });
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            }
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        } finally {
            setLoading(false)
        }

    }, [createCompany, values]);

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
                            Add Company
                        </Typography>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            id="autoFocus"
                            autoFocus
                            name="company_name"
                            label="Company Name*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.company_name}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="company_phone_number"
                            label="Phone Number*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.company_phone_number}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="company_email_address"
                            label="Email*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.company_email_address}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="company_address"
                            label="Address*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.company_address}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.DateTimePicker
                            name="exprired_at"
                            label="Exprired Time*"
                            value={values.exprired_at}
                            onChange={handleInputChange}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            onClick={(e) => onAddCompany(e)}
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
            </Drawer>

        </>
    )
}

export default React.memo(AddCompany)