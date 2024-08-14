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
import { useForm } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
//! Api Slices 
import {
    useGetcompanyUserRolesByIdQuery,
} from '@/api/CompanySlices/companyUserRoleSlice';
import { useGetAllExecutiveLevelsMutation } from '@/api/CompanySlices/companyUserSlice';
import { useGetAllCompanyRolesQuery } from '@/api/CompanySlices/companyRolesSlice';

import Cookies from 'js-cookie'
import {
    useGetCompanyDivisionsByCompanyIdQuery
} from '@/api/CompanySlices/companyDivisionSlice';
import {
    useGetAllCompanyAreasQuery
} from '@/api/CompanySlices/companyAreaSlice'
import { useUpdateUsersMutation } from '@/api/MPOSlices/UserSlice'
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";

const EditUser = ({ idharu, onClose }) => {

    const now = new BSDate().now();

    //! Getting User by ID
    const User = useGetcompanyUserRolesByIdQuery(idharu);

    //! Get user roles
    const data = useGetAllCompanyRolesQuery(Cookies.get('company_id'));

    const rolesharu = useMemo(() => {
        if (data?.data) {
            return data?.data.map(key => ({ id: key.id, title: key.role_name_value }))
        }
        return [];
    }, [data])

    //! Get Divisions
    const Divisions = useGetCompanyDivisionsByCompanyIdQuery(Cookies.get('company_id'));

    const divisions = useMemo(() => {
        if (Divisions?.data) {
            return Divisions.data.map(key => ({ id: key.id, title: key.division_name }))
        }
        return [];
    }, [Divisions])

    const [higherUserOptions, setHigherUserOptions] = useState([]);
    const [higherUserList] = useGetAllExecutiveLevelsMutation();

    useEffect(() => {
        if (User?.data) {
            higherUserList(User?.data?.company_name?.company_id)
                .then((res) => {
                    const higherList = []
                    res?.data?.forEach((key) => {
                        higherList.push({
                            id: key.id,
                            title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name
                        })
                    })
                    setHigherUserOptions(higherList);
                })
        }

    }, [User])

    //! Get company wise area
    const CompanyAreas = useGetAllCompanyAreasQuery(Cookies.get('company_id'))

    const companyAreas = useMemo(() => {
        if (CompanyAreas?.data) {
            return CompanyAreas.data.map(key => ({ id: key.id, title: key.company_area }))
        }
    }, [CompanyAreas])

    const [initialFValues, setInitialFValues] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        // address: "",
        role_name: "",
        email: "",
        phone_number: "",
        executive_level: "",
        division_name: "",
        company_area: "",
        station_type: "",

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
        if ('first_name' in fieldValues)
            temp.first_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.first_name)
        temp.middle_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.middle_name)
        temp.last_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.last_name)
        temp.address = returnValidation(['null'], values.address)
        temp.role_name = returnValidation(['null'], values.role_name)
        temp.priority_value = returnValidation(['null', 'alphaNumeric'], values.role_name)
        temp.phone_number = returnValidation(['null', 'phonenumber', 'specialcharacter'], values.phone_number)
        temp.email = returnValidation(['email'], values.email)
        temp.executive_level = returnValidation(['null', values.executive_level])
        temp.division_name = returnValidation(['null'], values.division_name)
        temp.company_area = returnValidation(['null'], values.company_area)
        temp.station_type = returnValidation(['null'], values.station_type)
        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")

    }, [values, errors])

    const [selectedDates, setSelectedDates] = useState('');
    const [dateData, setDateData] = useState();

    useEffect(() => {
        validate();
    }, [
        values.first_name,
        values.last_name,
        values.middle_name,
        // values.address,
        values.phone_number,
        values.email,
        values.role_name,
        values.division_name,
        values.executive_level,
        values.company_area,
        values.station_type,
        values.middle_name
    ])

    useEffect(() => {
        if (User?.data) {
            setInitialFValues({
                first_name: User?.data?.user_name?.first_name,
                middle_name: User?.data?.user_name?.middle_name,
                last_name: User?.data?.user_name?.last_name,
                email: User?.data?.user_name?.email,
                phone_number: User?.data?.user_name?.phone_number,
                role_name: User?.data?.role_name?.id,
                executive_level: User?.data?.executive_level?.id,
                division_name: User?.data?.division_name?.id,
                station_type: User?.data?.station_type,
                company_area: User?.data?.company_area?.id
            });
            setDateData(User?.data?.user_name.date_of_joining ? User?.data?.user_name.date_of_joining : now)
        }
    }, [User])

    //! Edit user
    const [updateUsers] = useUpdateUsersMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("first_name", values.first_name);
        formData.append("middle_name", values.middle_name);
        formData.append("last_name", values.last_name);
        formData.append("phone_number", values.phone_number);
        formData.append("email", values.email);
        formData.append("role_name", values.role_name);
        formData.append("division_name", values.division_name);
        formData.append("executive_level", values.executive_level);
        formData.append("station_type", values.station_type);
        formData.append("company_area", values.company_area);
        formData.append('id', idharu);
        formData.append("company_id", Cookies.get('company_id'));
        formData.append('refresh', Cookies.get('refresh'))
        formData.append('access', Cookies.get('access'));
        formData.append("date_of_joining", dateData);
        formData.append("is_active", true);
        try {
            const response = await updateUsers(formData).unwrap();
            if (response.data) {
                // 
                setSuccessMessage({ show: true, message: 'Successfully Edited User' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            } else {
                setErrorMessage({ show: true, message: 'Data failed to add.' });
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
    }, [updateUsers, values, dateData, idharu]);

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
                            Edit User
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    id="autoFocus"
                                    autoFocus
                                    name="first_name"
                                    label="First name*"
                                    value={values.first_name}
                                    onChange={handleInputChange}
                                    error={errors.first_name}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="middle_name"
                                    label="Middle name*"
                                    value={values.middle_name}
                                    onChange={handleInputChange}
                                    error={errors.middle_name}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="last_name"
                            label="Last name*"
                            value={values.last_name}
                            onChange={handleInputChange}
                            error={errors.last_name}
                        />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="email"
                                    label="Email*"
                                    value={values.email}
                                    onChange={handleInputChange}
                                    error={errors.email}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Box marginBottom={4}>
                                <Controls.Input
                                    name="phone_number"
                                    label="Contact Number*"
                                    value={values.phone_number}
                                    onChange={handleInputChange}
                                    error={errors.phone_number}
                                />
                            </Box>
                        </Grid>

                    </Grid>
                    <Box marginBottom={2}>
                        <Box marginBottom={2}>
                            <label htmlFor="date" style={{ fontSize: '14px', color: "black", fontWeight: '600', marginBottom: "15px" }}>Date of Joining*</label><br />
                            <NepaliDatePicker value={dateData} format="YYYY-MM-DD" onChange={(value) => setDateData(value)} />
                        </Box>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="role_name"
                            label="Role Name*"
                            className={"drawer-role-name-select"}
                            value={values.role_name}
                            onChange={handleInputChange}
                            error={errors.role_name}
                            options={rolesharu}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="division_name"
                            label="Division Name*"
                            className={"drawer-role-name-select"}
                            value={values.division_name}
                            onChange={handleInputChange}
                            error={errors.division_name}
                            options={divisions}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="executive_level"
                            label="Executive Level*"
                            className={"drawer-role-name-select"}
                            value={values.executive_level}
                            onChange={handleInputChange}
                            error={errors.executive_level}
                            options={higherUserOptions}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="company_area"
                            label="Company Wise Area*"
                            className={"drawer-role-name-select"}
                            value={values.company_area}
                            onChange={handleInputChange}
                            error={errors.company_area}
                            options={companyAreas}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="station_type"
                            label="Station Type*"
                            className={"drawer-role-name-select"}
                            value={values.station_type}
                            onChange={handleInputChange}
                            error={errors.station_type}
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

export default React.memo(EditUser);