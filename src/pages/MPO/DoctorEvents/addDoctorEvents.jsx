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
    usePostAllMPONamesNoPageMutation,
    useCreateDoctorsEventsMutation
} from '../../../api/MPOSlices/DoctorSlice'
import {
    NepaliDateConverter,
} from "react-nepali-date-picker-lite";
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { useGetAllVisitedMpoWiseDoctorQuery } from '@/api/MPOSlices/doctorApiSlice';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';


const AddDoctorEvents = () => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);


    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [mpoName, setMPOName] = useState('');
    const [MpoList, setMpoList] = useState([]);

    const mpoNames = [];
    if (MpoList.length !== 0) {
        MpoList.map((key) => {
            mpoNames.push({
                id: key.id,
                title: key.user_name.first_name + ' ' + key.user_name.last_name
            })
        })
    }

    useEffect(() => {
        if (company_id) {
            MpoData({ company_name: company_id }, {
                skip: !company_id
            })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [company_id])

    const [companyId, setCompanyId] = useState();

    const handleMPONameChange = useCallback((event, value) => {
        setMPOName(value?.id || "")
        setCompanyId(company_id);
    }, []);


    //! Format Date
    const today = NepaliDateConverter.getNepaliDate();
    const [selectedDates, setSelectedDates] = useState(today);

    const DoctorData = useGetAllVisitedMpoWiseDoctorQuery({ company_name: company_id, mpo_name: user_role === "admin" ? mpoName : company_user_role_id, mpo_area: "" }, {
        skip: !company_id || !company_user_role_id
    })

    const doctor = useMemo(() => {
        if (DoctorData?.data) {
            return DoctorData?.data.map((key) => ({ id: key.id, title: key.doctor_name.doctor_name }))
        }
        return [];
    }, [DoctorData])

    const [createDoctors] = useCreateDoctorsEventsMutation()

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

    useEffect(() => {
        validate();
    }, [values.event_title, values.doctor_id, selectedDates])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddEvents = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append("event_title", values.event_title);
        formData.append("doctor_id", values.doctor_id);
        formData.append("event_date", selectedDates);
        formData.append("mpo_name", user_role === "admin" ? mpoName : company_user_role_id);
        formData.append('company_name', company_id)
        try {
            const response = await createDoctors(formData)
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Added Doctor Event.' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
                setIsDrawerOpen(false)
            } else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                setLoading(false);
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            } else {
                setErrorMessage({ show: true, message: "Something went wrong." });
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
    }, [createDoctors, values]);

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
                                    id="autoFocus"
                                    autoFocus
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    {user_role === "admin" &&
                        <Box marginBottom={1}>
                            <Autocomplete
                                options={mpoNames}
                                getOptionLabel={(option) => option.title}
                                onChange={handleMPONameChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="MPO Names" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                )}
                            />
                        </Box>
                    }
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
                        <NepaliDatePicker
                            value={selectedDates}
                            format="YYYY-MM-DD"
                            onChange={(value) => setSelectedDates(value)} />
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

export default React.memo(AddDoctorEvents); 