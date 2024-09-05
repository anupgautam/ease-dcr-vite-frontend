import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Drawer,
    Stack,
    IconButton,
    CircularProgress
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import Iconify from '../../../components/iconify';
import { useSelector } from 'react-redux';
import { useForm } from '../../../reusable/forms/useForm';
import Controls from '@/reusable/forms/controls/Controls';
import { returnValidation } from '../../../validation';

import {
    useGetDoctorsSpecializationQuery,
    useCreateDoctorsMutation,
    usePostAllMPONamesNoPageMutation,
} from '../../../api/MPOSlices/DoctorSlice';
import { useGetMpoAreaQuery } from '@/api/MPOSlices/TourPlanSlice';
import { Link } from 'react-router-dom';

const AddDoctor = () => {
    const { company_id, company_user_role_id, user_role, company_user_id } = useSelector((state) => state.cookie);
    const [MutipleDoctor, setAddMutipleDoctor] = useState(false);
    const doctorRef = useRef(null);

    const doctorcategories = [
        { id: 'A', title: 'A' },
        { id: 'B', title: 'B' },
        { id: 'C', title: 'C' },
    ];

    const doctorGender = [
        { id: 'Male', title: 'Male' },
        { id: 'Female', title: 'Female' },
        { id: 'Others', title: 'Others' },
    ];

    //! Get Doctor Specialization
    const DoctorSpecialization = useGetDoctorsSpecializationQuery(company_id, {
        skip: !company_id
    });

    const doctorspecializations = useMemo(() => {
        if (DoctorSpecialization?.data) {
            return DoctorSpecialization.data.map(key => ({ id: key.id, title: key.category_name }))
        }
        return [];
    }, [DoctorSpecialization])

    const [MpoData] = usePostAllMPONamesNoPageMutation();
    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList.map(key => ({ id: key.id, title: key.user_name.first_name + ' ' + key.user_name.last_name }))
        }
        return [];
    }, [MpoList])

    useEffect(() => {
        if (company_id) {
            MpoData({ company_name: company_id }, {
                skip: !company_id
            })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => { });
        }
    }, [company_id]);

    const [createDoctors] = useCreateDoctorsMutation();

    const initialFValues = {
        is_invested: false,
    };

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true);


    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ('doctor_name' in fieldValues)
            temp.doctor_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.doctor_name);
        temp.doctor_territory = returnValidation(['null'], values.doctor_territory);
        temp.category_name = returnValidation(['null'], values.category_name);
        temp.mpo_name = returnValidation(['null'], values.mpo_name);
        temp.doctor_specialization = returnValidation(['null'], values.doctor_specialization);
        temp.doctor_birthday = returnValidation(['null'], values.doctor_birthday);
        temp.doctor_anniversary = returnValidation(['null'], values.doctor_anniversary);

        setErrors({
            ...temp,
        });

        if (fieldValues === values) return Object.values(temp).every((x) => x === '');
    };

    useEffect(() => {
        validate();
    }, [
        values.doctor_name,
        values.doctor_gender,
        values.doctor_specialization,
        values.doctor_qualification,
        values.doctor_territory,
        values.mpo_name,
        values.doctor_nmc_number,
        values.category_name,
        values.doctor_address,
        values.doctor_phone_number,
        values.is_invested,
    ]);

    //! Get MPO Area
    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: user_role === 'admin' ? values.mpo_name : company_user_role_id },
        {
            skip: !company_id || !user_role || !company_user_role_id
        }
    );

    const mpoAreaData = useMemo(() => {
        if (MpoArea) {
            return MpoArea?.data?.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])
    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const onAddDoctors = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append('is_investment', false);
        formData.append('doctor_name', values.doctor_name);
        formData.append('doctor_phone_number', values.doctor_phone_number);
        formData.append('doctor_address', values.doctor_address);
        formData.append('doctor_gender', values.doctor_gender);
        formData.append('doctor_territory', values.doctor_territory);
        formData.append('doctor_category', values.category_name);
        formData.append('mpo_name', user_role === 'admin' ? values.mpo_name : company_user_role_id);
        formData.append('doctor_qualification', values.doctor_qualification);
        formData.append('doctor_specialization', values.doctor_specialization);
        formData.append('company_id', company_id);
        try {
            const response = await createDoctors(formData);
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
        } finally {
            setLoading(false)
        }
        setIsDrawerOpen(false);
    }, [createDoctors, values])

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const addMutipleDoctor = () => {
        setAddMutipleDoctor(!MutipleDoctor);
    };

    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsDrawerOpen(true)}>
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
                    boxSizing: 'border-box',
                    '& .MuiDrawer-paper': {
                        width: 400,
                    },
                }}
            >
                <Box style={{ padding: '20px' }}>
                    <Box
                        p={1}
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: '40px' }}
                    >
                        <IconButton className="close-button" onClick={() => setIsDrawerOpen(false)}>
                            <Close />
                        </IconButton>
                        <Typography variant="h6">Add Doctor</Typography>
                    </Box>
                    {MutipleDoctor === true ? (
                        <>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    id="autoFocus"
                                    name="no_of_doctor"
                                    label="Number of Doctor*"
                                    value={values.no_of_doctor}
                                    onChange={handleInputChange}
                                    autoFocus
                                />
                            </Box>
                            <Stack spacing={1} direction="row">
                                <Link to={`/dashboard/admin/add/mutiple/doctor?number=${values.no_of_doctor}`}>
                                    <Button variant="contained" className="summit-button">
                                        Submit{' '}
                                    </Button>
                                </Link>
                                <Button variant="outlined" className="cancel-button" onClick={() => setIsDrawerOpen(false)}>
                                    Cancel
                                </Button>
                            </Stack>
                        </>
                    ) : (
                        <>
                            <Box marginBottom={4}>
                                <Button
                                    variant="contained"
                                    className="summit-button"
                                    style={{ width: '100%', padding: '10px' }}
                                    onClick={addMutipleDoctor}
                                >
                                    Add Multiple Doctor
                                </Button>
                            </Box>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            id="autoFocus"
                                            name="doctor_name"
                                            label="Doctor Name*"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            error={errors.doctor_name}
                                            autoFocus
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box marginBottom={2}>
                                        <Controls.Select
                                            name="doctor_territory"
                                            label="Doctor Territory*"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            options={mpoAreaData}
                                            error={errors.doctor_territory}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box marginBottom={2}>
                                        <Controls.Select
                                            name="category_name"
                                            label="Doctor Category*"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            options={doctorcategories}
                                            error={errors.category_name}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name="doctor_phone_number"
                                            label="Doctor Phone Number"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            error={errors.doctor_phone_number}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name="doctor_qualification"
                                            label="Doctor Qualification*"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            error={errors.doctor_qualification}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name="doctor_nmc_number"
                                            label="Doctor NMC Number"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            error={errors.doctor_nmc_number}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box marginBottom={2}>
                                        <Controls.RadioGroup
                                            name="doctor_gender"
                                            label="Doctor Gender"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            items={doctorGender}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box marginBottom={2}>
                                        <Controls.Select
                                            name="doctor_specialization"
                                            label="Doctor Specialization*"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            options={doctorspecializations}
                                            error={errors.doctor_specialization}
                                        />
                                    </Box>
                                </Grid>
                                {user_role === "admin" &&
                                    <Grid item xs={12}>
                                        <Box marginBottom={2}>
                                            <Controls.Select
                                                name="mpo_name"
                                                label="MPO Name*"
                                                value={values.name}
                                                onChange={handleInputChange}
                                                options={mpoNames}
                                                error={errors.mpo_name}
                                            />
                                        </Box>
                                    </Grid>
                                }
                                <Grid item xs={12}>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name="doctor_address"
                                            label="Doctor Address"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            error={errors.doctor_address}
                                        />
                                    </Box>
                                </Grid>
                                {/* <Grid item xs={12}>
                                    <Box marginBottom={2}>
                                        <Controls.Checkbox
                                            name="is_invested"
                                            label="Is Invested?"
                                            value={values.is_invested}
                                            onChange={handleInputChange}
                                        />
                                    </Box>
                                </Grid> */}
                            </Grid>
                            <Stack spacing={1} direction="row">
                                <Controls.SubmitButton
                                    variant="contained"
                                    className="submit-button"
                                    onClick={(e) => onAddDoctors(e)}
                                    text="Submit"
                                />
                                <Button
                                    variant="outlined"
                                    className="cancel-button"
                                    style={{ padding: '10px' }}
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </>
                    )}
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
    );
};

export default React.memo(AddDoctor);
