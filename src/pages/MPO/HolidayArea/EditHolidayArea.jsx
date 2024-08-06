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
import { useGetHolidayAreasQuery, useGetHolidaysAreaByIdQuery, useUpdateHolidayAreaMutation } from '@/api/HolidaySlices/holidaySlices';

const EditHolidayArea = ({ idharu, onClose }) => {

    //! Getting  by ID
    const HolidayArea = useGetHolidaysAreaByIdQuery(idharu);

    //! Get all holidays 
    const Areas = useGetHolidayAreasQuery(Cookies.get('company_id'))

    const areas = useMemo(() => {
        if (Areas.data) {
            return Areas.data.map((key) => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [Areas])

    const [areaOptions, setAreaOptions] = useState([])
    //! Options
    const handleHolidayAreas = useCallback((event, value) => {
        setAreaOptions(value.map(option => option.id));
    }, []);

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('company_area' in fieldValues)
            temp.company_area = returnValidation(['null'], values.company_area)
        temp.holiday_type = returnValidation(['null'], values.holiday_type)
        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        holiday_type: "",
        company_area: ""
    })

    useEffect(() => {
        if (HolidayArea.data) {
            setInitialFValues({
                holiday_type: HolidayArea.data.holiday_type,
                company_area: HolidayArea.data.company_area,
            });
        }
    }, [HolidayArea.data])


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
        values.company_name, values.holiday_type])

    //! Edit Holiday Area
    const [updateHolidayArea] = useUpdateHolidayAreaMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("holiday_type", values.holiday_type);
        areaOptions.forEach(areaId => {
            formData.append("company_area", areaId);
        });
        formData.append('id', idharu);
        formData.append("company_name", Cookies.get('company_id'));
        formData.append('refresh', Cookies.get('refresh'))
        formData.append('access', Cookies.get('access'));
        try {
            const response = await updateHolidayArea(formData).unwrap();
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
        // setIsDrawerOpen(false)
    }, [updateHolidayArea, values])

    // const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

                    <Form onSubmit={handleSubmit}>
                        <Box marginBottom={2}>
                            <Autocomplete
                                multiple
                                options={areas}
                                getOptionLabel={(option) => option.title}
                                onChange={handleHolidayAreas}
                                renderInput={(params) => (
                                    <TextField {...params} label="Company Areas" />
                                )}
                                renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                id="focus"
                                name="holiday_type"
                                label="Holiday Type*"
                                value={values.holiday_type}
                                onChange={handleInputChange}
                                error={errors.holiday_type}
                                autoFocus
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

export default React.memo(EditHolidayArea);