import React, { useState, useEffect, useMemo } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid
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
    useCreateDoctorsEventsMutation
} from '../../../api/MPOSlices/DoctorSlice'
import Cookies from 'js-cookie'
// import NepaliDatePicker, {
//     NepaliDateConverter,
// } from "react-nepali-date-picker-lite";
import { useGetAllVisitedMpoWiseDoctorQuery } from '@/api/MPOSlices/doctorApiSlice';

const AddDoctorEvents = () => {

    let today;
    // const today = NepaliDateConverter.getNepaliDate();
    const [selectedDates, setSelectedDates] = useState(today);

    const DoctorData = useGetAllVisitedMpoWiseDoctorQuery({ company_name: Cookies.get('company_id'), mpo_name: Cookies.get('company_user_id'), mpo_area: "" })

    const doctor = useMemo(() => {
        if (DoctorData?.data) {
            return DoctorData?.data.map((key) => ({ id: key.id, title: key.doctor_name.doctor_name }))
        }
        return [];
    }, [DoctorData])

    const [createDoctors] = useCreateDoctorsEventsMutation()

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('event_title' in fieldValues)
            temp.event_title = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.event_title)
        temp.doctor_id = returnValidation(['null'], values.doctor_id)
        temp.selectedDates = returnValidation(['null'], selectedDates)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

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

    useEffect(() => {
        validate();
    }, [values.event_title, values.doctor_id, selectedDates])


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddEvents = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("event_title", values.event_title);
        formData.append("doctor_id", values.doctor_id);
        formData.append("event_date", selectedDates);
        formData.append("event_type", "");
        formData.append("mpo_id", Cookies.get('company_user_id'));
        formData.append('company_name', Cookies.get('company_id'))
        try {
            const response = await createDoctors(formData)
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Added Doctor.' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            } else {
                setErrorMessage({ show: true, message: response.error.data[0] });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
        setIsDrawerOpen(false)
    };

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
                            Add Doctor Events
                        </Typography>

                    </Box>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="event_title"
                                    label="Event Title*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.event_title}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Box marginBottom={1}>
                        <Controls.Select
                            name="doctor_id"
                            label="Select the Doctor*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.doctor_id}
                            options={doctor}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <label htmlFor="date" style={{ fontSize: '13px', color: "grey", fontWeight: '600', marginBottom: "10px" }}>Event Date*</label><br />
                        {/* <NepaliDatePicker
                            value={selectedDates}
                            onSelect={setSelectedDates}
                            renderInput={(props) => <input className='input-datepicker-fields1' value={selectedDates} type="text" {...props} />}
                        /> */}
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            onClick={(e) => onAddEvents(e)}
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
    )
}

export default React.memo(AddDoctorEvents); 