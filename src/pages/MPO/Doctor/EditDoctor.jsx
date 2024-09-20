import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box,
    Typography, Button, Grid, CircularProgress
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
import {
    useGetDoctorsByIdQuery,
    useGetDoctorsSpecializationQuery,
    useGetDoctorsSpecialiationByIdQuery,
    useUpdateDoctorsMutation,
} from "@/api/MPOSlices/DoctorSlice";
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';

import { useGetMpoAreaQuery } from '@/api/MPOSlices/TourPlanSlice';

const EditDoctor = ({ id, onClose, divisionId }) => {

    const { company_user_role_id, user_role, company_user_id, refresh, access, company_id } = useSelector((state) => state.cookie);

    //! Getting doctor by ID
    const Doctor = useGetDoctorsByIdQuery(id);

    //! Get doctor categories
    const DoctorSpecialization = useGetDoctorsSpecializationQuery(company_id, {
        skip: !company_id
    })


    const doctorspecializations = useMemo(() => {
        if (DoctorSpecialization?.data) {
            return DoctorSpecialization?.data?.map(key => ({ id: key.id, title: key.category_name }))
        }
        return [];
    }, [DoctorSpecialization])


    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: Doctor?.data?.mpo_name }, {
        skip: !company_id || !Doctor?.data?.mpo_name
    });

    const mpoAreaData = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data?.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])

    //! Get doctor specialization by id 
    const SpecializationById = useGetDoctorsSpecialiationByIdQuery(divisionId)

    //! Doctor category
    const doctorcategories = [
        { id: "A", title: "A" },
        { id: "B", title: "B" },
        { id: "C", title: "C" },
    ]

    const doctorGender = [
        { id: "Male", title: "Male" },
        { id: "Female", title: "Female" },
        { id: "Others", title: "Others" },
    ]

    const [initialFValues, setInitialFValues] = useState({
        doctor_name: "",
        doctor_address: "",
        doctor_gender: "",
        doctor_phone_number: "",
        doctor_territory: "",
        doctor_specialization: "",
        doctor_category: "",
        doctor_nmc_number: "",
        doctor_qualification: "",
        is_invested: "",
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
    const validate = useCallback((fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('doctor_name' in fieldValues)
            temp.doctor_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.doctor_name)
        temp.doctor_territory = returnValidation(['null'], values.doctor_territory)
        temp.doctor_specialization = returnValidation(['null'], values.doctor_specialization)
        temp.doctor_category = returnValidation(['null'], values.doctor_category)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }, [values, errors])


    useEffect(() => {
        if (Doctor.data) {
            setInitialFValues({
                'doctor_id': Doctor?.data?.id,
                'doctor_name': Doctor?.data?.doctor_name?.doctor_name,
                'doctor_address': Doctor?.data?.doctor_name?.doctor_address,
                'doctor_gender': Doctor?.data?.doctor_name?.doctor_gender,
                'doctor_phone_number': Doctor?.data?.doctor_name?.doctor_phone_number,
                'doctor_territory': Doctor?.data?.doctor_name?.doctor_territory,
                'doctor_category': Doctor?.data?.doctor_name?.doctor_category,
                'doctor_nmc_number': Doctor?.data?.doctor_name?.doctor_nmc_number,
                'doctor_qualification': Doctor?.data?.doctor_name?.doctor_qualification,
                'doctor_specialization': Doctor?.data?.doctor_name?.doctor_specialization?.id,
                'mpo_name': Doctor?.data?.mpo_name,
                'is_invested': false,
            });
        }
    }, [Doctor.data])

    useEffect(() => {
        validate();

    }, [
        values
    ])

    //! Edit user
    const [updateDoctors] = useUpdateDoctorsMutation();
    const history = useNavigate()

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append("doctor_name", values.doctor_name);
        formData.append("doctor_address", values.doctor_address);
        formData.append("doctor_gender", values.doctor_gender);
        formData.append("doctor_phone_number", values.doctor_phone_number);
        formData.append("doctor_territory", values.doctor_territory);
        formData.append("doctor_specialization", values.doctor_specialization);
        formData.append("doctor_category", values.doctor_category);
        formData.append("doctor_nmc_number", values.doctor_nmc_number);
        formData.append("doctor_qualification", values.doctor_qualification);
        formData.append("mpo_name", values.mpo_name);
        formData.append("company_id", company_id);
        formData.append('id', Doctor.data.doctor_name.id);
        formData.append('refresh', refresh)
        formData.append('access', access);
        formData.append('is_investment', false)
        try {
            const response = await updateDoctors(formData).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Doctor' });
                setTimeout(() => {
                    onClose();
                    setSuccessMessage({ show: false, message: '' });
                }, 2000);
            } else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                setLoading(false);
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            } else {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 2000);
            }
        }
        catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 2000);
        } finally {
            setLoading(false)
        }
    }, [updateDoctors, id, values])


    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
                padding="16px"
                sx={{
                    width: 400,
                    flexShrink: 0,
                    boxSizing: 'border-box',
                    '& .MuiDrawer-paper': {
                        width: 400,
                    },
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
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6">
                            Edit Doctor
                        </Typography>
                    </Box>
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        id="autoFocus"
                                        autoFocus
                                        name="doctor_name"
                                        label="Doctor Name*"
                                        value={values.doctor_name}
                                        onChange={handleInputChange}
                                        error={errors.doctor_name}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="doctor_specialization"
                                        label="Doctor Specialization*"
                                        value={values.doctor_specialization}
                                        onChange={handleInputChange}
                                        error={errors.doctor_specialization}
                                        options={doctorspecializations}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="doctor_address"
                                        label="Doctor Address*"
                                        value={values.doctor_address}
                                        onChange={handleInputChange}
                                        error={errors.doctor_address}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="doctor_phone_number"
                                        label="Phone Number*"
                                        value={values.doctor_phone_number}
                                        onChange={handleInputChange}
                                        error={errors.doctor_phone_number}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="doctor_gender"
                                        label="Doctor Gender"
                                        value={values.doctor_gender || ''}
                                        options={doctorGender}
                                        onChange={handleInputChange}
                                        error={errors.doctor_gender}
                                    />
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="doctor_territory"
                                        label="Doctor Territory*"
                                        value={values.doctor_territory}
                                        onChange={handleInputChange}
                                        error={errors.doctor_territory}
                                        options={mpoAreaData}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="doctor_nmc_number"
                                    label="Doctor NMC Number*"
                                    value={values.doctor_nmc_number}
                                    onChange={handleInputChange}
                                    error={errors.doctor_nmc_number}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="doctor_qualification"
                                    label="Doctor Qualification*"
                                    value={values.doctor_qualification}
                                    onChange={handleInputChange}
                                    error={errors.doctor_qualification}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box marginBottom={2}>
                                <Controls.Select
                                    name="doctor_category"
                                    label="Doctor Category*"
                                    value={values.doctor_category}
                                    onChange={handleInputChange}
                                    error={errors.doctor_category}
                                    options={doctorcategories}
                                />
                            </Box>
                        </Grid>
                        {/* <Box marginBottom={2}>
                            <Controls.Checkbox
                                name="is_invested"
                                value={values.is_invested}
                                onChange={handleInputChange}
                                label="Is Invested"
                            />
                        </Box> */}

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
                                style={{ padding: '10px' }}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Form>
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
    );
};

export default React.memo(EditDoctor);