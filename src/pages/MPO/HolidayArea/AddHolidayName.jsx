import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    Autocomplete,
    TextField,
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
    useGetAllCompanyAreasQuery,
} from '@/api/CompanySlices/companyAreaSlice';
import { useCreateHolidayNamesMutation } from '@/api/HolidaySlices/holidaySlices';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { toast } from 'react-toastify';

const AddHolidayName = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Create Holiday Name
    const [createHolidayName] = useCreateHolidayNamesMutation()

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('holiday_name' in fieldValues)
            temp.holiday_name = returnValidation(['null', 'lessThan50', 'specialcharacter', 'minLength3'], values.holiday_name)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const initialFValues = {
        holiday_name: "",
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true, validate)

    useEffect(() => {
        validate();

    }, [values.holiday_name])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);

        setIsButtonDisabled(!valid);
    }, [values.holiday_name]);

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddHolidayName = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)

        const data = { company_name: company_id, holiday_name: values.holiday_name }

        try {
            const response = await createHolidayName(data)
            console.log(response)
            if (response?.data?.message) {
                // setSuccessMessage({ show: true, message: 'Successfully Added Holidays' });
                // setTimeout(() => {
                //     setSuccessMessage({ show: false, message: '' });
                // }, 3000);
                // setIsDrawerOpen(false)

                toast.success(`${response?.data?.message}`)
                setIsButtonDisabled(true)
                setIsDrawerOpen(false)
            }
            else if (response?.error) {
                // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                // setLoading(false);
                // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                toast.error(`${response?.error?.data?.msg}`)
                setLoading(false);
            }
            else {
                // setErrorMessage({ show: true, message: "Error" });
                // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);

                toast.error(`Some Error Occured`)

            }
        } catch (error) {
            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 3000);
            console.log(error)
            toast.error('Backend Error')
        } finally {
            setLoading(false)
        }
    }, [createHolidayName, values]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsDrawerOpen(true)} >
                Add Holiday Name
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
                        // width="400px"
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
                            Add Holiday Names
                        </Typography>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            id="autoFocus"
                            autoFocus
                            name="holiday_name"
                            label="Holiday name*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.holiday_name}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            disabled={isButtonDisabled}
                            onClick={(e) => onAddHolidayName(e)}
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

export default React.memo(AddHolidayName)