import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box,
    Typography, Button, Grid
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


import Cookies from 'js-cookie'
import { useGetMpoAreaQuery } from '@/api/MPOSlices/TourPlanSlice';

const EditDoctor = ({ id, onClose, divisionId }) => {

    //! Getting doctor by ID
    const Doctor = useGetDoctorsByIdQuery(id);

    //! Get doctor categories
    const DoctorSpecialization = useGetDoctorsSpecializationQuery(Cookies.get('company_id'))


    const doctorspecializations = useMemo(() => {
        if (DoctorSpecialization?.data) {
            return DoctorSpecialization?.data.map(key => ({ id: key.id, title: key.category_name }))
        }
        return [];
    }, [DoctorSpecialization])


    const MpoArea = useGetMpoAreaQuery({ company_name: Cookies.get('company_id'), mpo_name: Doctor?.data?.mpo_name });

    const mpoAreaData = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map(key => ({ id: key.id, title: key.area_name }))
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
                'doctor_specialization': Doctor?.data?.doctor_name?.doctor_specialization,
                'mpo_name': Doctor?.data?.mpo_name,
                'is_invested': Doctor?.data?.is_investment,
            });
        }
    }, [Doctor.data])

    useEffect(() => {
        validate();

    }, [
        values.doctor_name,
        values.doctor_address,
        values.doctor_gender,
        values.doctor_phone_number,
        values.doctor_territory,
        values.doctor_specialization,
        values.doctor_category,
        values.doctor_nmc_number,
        values.doctor_qualification,
        values.mpo_name,
        values.is_invested
    ])

    //! Edit user
    const [updateDoctors] = useUpdateDoctorsMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
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
        formData.append("company_id", Cookies.get('company_id'));
        formData.append('id', Doctor.data.doctor_name.id);
        formData.append('refresh', Cookies.get('refresh'))
        formData.append('access', Cookies.get('access'));
        formData.append('is_investment', values.is_invested)
        try {
            const response = await updateDoctors(formData)
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Doctor' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            } else {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        }
        catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
    }, [updateDoctors, id, values])

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
                        <Typography variant="h6">
                            Edit Doctor
                        </Typography>
                    </Box>
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
                                <Box marginBottom={4}>
                                    <Controls.Input
                                        name="doctor_address"
                                        label="Doctor Address*"
                                        value={values.doctor_address}
                                        onChange={handleInputChange}
                                        error={errors.doctor_address}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="doctor_gender"
                                        label="Doctor Gender"
                                        // className={"drawer-first-name-input"}
                                        value={values.doctor_gender || ''}
                                        options={doctorGender}
                                        onChange={handleInputChange}
                                        error={errors.doctor_gender}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
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
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={6}>
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
                            <Grid item xs={6}>
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
                        </Grid>
                        <Grid item xs={6}>
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
                        <Box marginBottom={2}>
                            <Controls.Checkbox
                                name="is_invested"
                                value={values.is_invested}
                                onChange={handleInputChange}
                                label="Is Invested"
                            />
                        </Box>

                        <Stack spacing={1} direction="row">
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                onClick={(e) => { handleSubmit(e); onClose() }}
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

export default React.memo(EditDoctor);