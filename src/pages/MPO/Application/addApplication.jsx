import React, { useState, useEffect, useCallback } from 'react'
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
import Controls from "../../../reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
import {
    NepaliDateConverter
} from "react-nepali-date-picker-lite";
import { useSelector } from 'react-redux';

import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { useCreateApplicationsMutation } from '../../../api/ApplicationSlices/ApplicationSlices';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';

const AddApplication = () => {
    const { company_id, user_role, company_user_id,company_user_role_id } = useSelector((state) => state.cookie);

    //! Format Date
    const today = NepaliDateConverter.getNepaliDate();
    const [selectedDates, setSelectedDates] = useState(today);
    const [selectedDatesTo, setSelectedDatesTo] = useState(today);

    const leaves = [
        { id: "CL", title: "Casual Leave" },
        { id: "SP", title: "Sick Leave" },
        { id: "PL", title: "Paid Leave" },
        { id: "LWP", title: "Leave Without Pay" }
    ]

    const [createDoctors] = useCreateApplicationsMutation()

    const initialFValues = {

    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true)

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('leave_type' in fieldValues)
            temp.leave_type = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.leave_type)
        temp.leave_cause = returnValidation(['null'], values.leave_cause)

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    useEffect(() => {
        validate();

    }, [values.leave_cause, values.leave_type])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddDoctors = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = {
            leave_cause: values.leave_cause,
            leave_type: values.leave_type,
            leave_from: selectedDates,
            leave_to: selectedDatesTo,
            user_id: company_user_role_id,
            company_name: company_id,
            is_submitted: true,
            leave_status: 'pending'
        };
        try {
            const response = await createDoctors(formData)
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Added Leave Application.' });
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
                setErrorMessage({ show: true, message: "Unable to Add Application" });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        } finally {
            setLoading(false)
        }
    }, [createDoctors, values])

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
                    width: 400,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400
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
                            Add Application
                        </Typography>
                    </Box>
                    <Box marginBottom={0}>
                        <label htmlFor="date" style={{ fontSize: '13px', color: "grey", fontWeight: '600', marginBottom: "15px" }}>Leave From*</label><br />
                        {/* <NepaliDatePicker
                            value={selectedDates}
                            onSelect={setSelectedDates}
                            renderInput={(props) => <input className='input-datepicker-fields1' value={selectedDates} type="text" {...props} />}
                        /> */}
                        <NepaliDatePicker
                            value={selectedDates}
                            format="YYYY-MM-DD"
                            onChange={(value) => setSelectedDates(value)} />
                    </Box>
                    <Box marginBottom={2}>
                        <label htmlFor="date" style={{ fontSize: '13px', color: "grey", fontWeight: '600', marginBottom: "15px" }}>Leave To*</label><br />
                        {/* <NepaliDatePicker
                            value={selectedDatesTo}
                            onSelect={setSelectedDatesTo}
                            renderInput={(props) => <input className='input-datepicker-fields1' value={selectedDatesTo} type="text" {...props} />}
                        /> */}
                        <NepaliDatePicker
                            value={selectedDatesTo}
                            format="YYYY-MM-DD"
                            onChange={(value) => setSelectedDatesTo(value)} />
                    </Box>
                    <Box marginBottom={2}>
                        {/* <Controls.Input
                            name="leave_type"
                            label="Leave Type"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.leave_type}
                        /> */}
                        <Controls.Select
                            name="leave_type"
                            label="Leave Type*"
                            value={values.name}
                            options={leaves}
                            onChange={handleInputChange}
                            error={errors.leave_type}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="leave_cause"
                            label="Leave Cause"
                            value={values.name}
                            onChange={handleInputChange}
                            errors={errors.leave_cause}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Button
                            variant="contained"
                            className="summit-button"
                            onClick={(e) => onAddDoctors(e)}
                        >
                            Submit{" "}
                        </Button>
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

export default React.memo(AddApplication);