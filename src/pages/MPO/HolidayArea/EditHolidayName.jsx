import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box,
    Typography, Button, Grid,
    Autocomplete, TextField
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
import Cookies from 'js-cookie'
//! Api Slices 
import { useGetCompanyHolidaysQuery, useGetHolidayNamesByIdQuery, useUpdateHolidayNameMutation } from '@/api/HolidaySlices/holidaySlices';
import {
    useGetAllCompanyAreasQuery,
} from '@/api/CompanySlices/companyAreaSlice';

const EditHolidayName = ({ idharu, onClose }) => {

    //! Getting  by ID
    const HolidayName = useGetHolidayNamesByIdQuery(idharu);

    const [initialFValues, setInitialFValues] = useState({
        holiday_name: "",
    })

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

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('holiday_name' in fieldValues)
            temp.holiday_name = returnValidation(['null'], values.holiday_name)
        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }
    useEffect(() => {
        validate();
    }, [values.holiday_name])

    useEffect(() => {
        if (HolidayName?.data) {
            setInitialFValues({
                holiday_name: HolidayName?.data?.holiday_name,
            });
        }
    }, [HolidayName?.data])


    //! Edit Holiday Area
    const [updateHolidayName] = useUpdateHolidayNameMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("holiday_name", values.holiday_name);
        formData.append("company_name", Cookies.get("company_id"));
        try {
            const response = await updateHolidayName({ "holiday_name": values.holiday_name, "company_area": areaOptions }).unwrap();
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
        onClose();
    }, [updateHolidayName, values])

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
                            Edit Holiday Areas
                        </Typography>
                    </Box>

                    <Box marginBottom={2}>
                        <Controls.Input
                            id="autoFocus"
                            autoFocus
                            name="holiday_name"
                            label="Holiday name*"
                            value={values.holiday_name}
                            onChange={handleInputChange}
                            error={errors.holiday_name}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
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

export default React.memo(EditHolidayName);