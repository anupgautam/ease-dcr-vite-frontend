import React, { useEffect, useState } from 'react'
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
    useGetLeavesByIdQuery

} from "../../../api/Leaves/LeavesApiSlice";

import { useGetMpoAreaQuery } from '@/api/MPOSlices/TourPlanSlice';
import { useSelector } from 'react-redux';


const EditLeaves = ({ id, onClose, divisionId }) => {
    const { company_id, user_role, company_user_id, access, refresh } = useSelector((state) => state.cookie);

    //! Getting doctor by ID
    const Leaves = useGetLeavesByIdQuery(id);

    //! Validation wala  
    // const validate = (fieldValues = values) => {
    //     // 
    //     let temp = { ...errors }
    //     if ('doctor_name' in fieldValues)
    //         temp.doctor_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.doctor_name)
    //     temp.doctor_address = returnValidation(['null'], values.doctor_address)
    //     temp.doctor_gender = returnValidation(['null'], values.doctor_gender)
    //     temp.doctor_phone_number = returnValidation(['null', 'phonenumber', 'specialcharacter'], values.doctor_phone_number)
    //     temp.doctor_territory = returnValidation(['null'], values.doctor_territory)
    //     temp.doctor_specialization = returnValidation(['null'], values.doctor_specialization)
    //     temp.doctor_category = returnValidation(['null'], values.doctor_category)
    //     temp.doctor_nmc_number = returnValidation(['null'], values.doctor_nmc_number)
    //     temp.doctor_qualification = returnValidation(['null'], values.doctor_qualification)

    //     setErrors({
    //         ...temp
    //     })
    //     // 

    //     if (fieldValues === values)
    //         return Object.values(temp).every(x => x == "")
    // }


    // const [initialFValues, setInitialFValues] = useState({
    //     doctor_name: "",
    //     doctor_address: "",
    //     doctor_gender: "",
    //     doctor_phone_number: "",
    //     doctor_territory: "",
    //     doctor_specialization: "",
    //     doctor_category: "",
    //     doctor_nmc_number: "",
    //     doctor_qualification: "",
    // })

    // useEffect(() => {
    //     if (Doctor.data) {
    //         setInitialFValues({
    //             'doctor_id': Doctor?.data?.id,
    //             'doctor_name': Doctor?.data?.doctor_name?.doctor_name,
    //             'doctor_address': Doctor?.data?.doctor_name?.doctor_address,
    //             'doctor_gender': Doctor?.data?.doctor_name?.doctor_gender,
    //             'doctor_phone_number': Doctor?.data?.doctor_name?.doctor_phone_number,
    //             'doctor_territory': Doctor?.data?.doctor_name?.doctor_territory,
    //             'doctor_category': Doctor?.data?.doctor_name?.doctor_category,
    //             'doctor_nmc_number': Doctor?.data?.doctor_name?.doctor_nmc_number,
    //             'doctor_qualification': Doctor?.data?.doctor_name?.doctor_qualification,
    //             'doctor_specialization': Doctor?.data?.doctor_name?.doctor_specialization,
    //             'mpo_name': Doctor?.data?.mpo_name,
    //         });
    //     }
    // }, [Doctor.data])

    // const { values,
    //     errors,
    //     setErrors,
    //     handleInputChange
    // } = useForm(
    //     initialFValues,
    //     true,
    //     false,
    //     true
    // )

    // useEffect(() => {
    //     validate();

    // }, [
    //     values.doctor_name,
    //     values.doctor_address,
    //     values.doctor_gender,
    //     values.doctor_phone_number,
    //     values.doctor_territory,
    //     values.doctor_specialization,
    //     values.doctor_category,
    //     values.doctor_nmc_number,
    //     values.doctor_qualification,
    //     values.mpo_name,
    // ])

    //! Edit user
    // const [updateDoctors] = useUpdateDoctorsMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.append("doctor_name", values.doctor_name);
    //     formData.append("doctor_address", values.doctor_address);
    //     formData.append("doctor_gender", values.doctor_gender);
    //     formData.append("doctor_phone_number", values.doctor_phone_number);
    //     formData.append("doctor_territory", values.doctor_territory);
    //     formData.append("doctor_specialization", values.doctor_specialization);
    //     formData.append("doctor_category", values.doctor_category);
    //     formData.append("doctor_nmc_number", values.doctor_nmc_number);
    //     formData.append("doctor_qualification", values.doctor_qualification);
    //     formData.append("mpo_name", values.mpo_name);
    //     formData.append("company_id", company_id);
    //     formData.append('id', Doctor.data.doctor_name.id);
    //     formData.append('refresh', refresh)
    //     formData.append('access', access);
    //     try {
    //         const response = await updateDoctors(formData).unwrap();
    //         setSuccessMessage({ show: true, message: 'Successfully Edited Doctor' });
    //         setTimeout(() => {
    //             setSuccessMessage({ show: false, message: '' });
    //         }, 3000);
    //     }
    //     catch (error) {
    //         setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
    //         setTimeout(() => {
    //             setErrorMessage({ show: false, message: '' });
    //         }, 3000);
    //     }
    // }

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
                            Edit Leave
                        </Typography>
                    </Box>
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
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
                                    <Controls.Input
                                        name="doctor_gender"
                                        label="Doctor Gender*"
                                        value={values.doctor_gender}
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

                        <Stack spacing={1} direction="row">
                            <Button
                                variant="contained"
                                className="summit-button"
                                onClick={(e) => { handleSubmit(e); onClose() }}
                            >
                                Submit{" "}
                            </Button>
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

export default EditLeaves;