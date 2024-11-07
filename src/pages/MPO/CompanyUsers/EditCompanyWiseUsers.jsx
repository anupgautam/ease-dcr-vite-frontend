import React, { useEffect, useState, useCallback, useMemo } from 'react'
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
import { useUpdateUsersMutation } from '@/api/MPOSlices/UserSlice'
import {
    useGetcompanyUserRolesByIdQuery,
} from '@/api/CompanySlices/companyUserRoleSlice';
import { useGetAllCompanyRolesQuery } from '@/api/CompanySlices/companyRolesSlice';
import { useSelector } from 'react-redux';


const EditCompanyWiseUsers = ({ idharu, onClose }) => {

    const { company_id, refresh, access } = useSelector((state) => state.cookie);

    // const now = new BSDate().now();

    //! Company Wise Users By Id 
    const User = useGetcompanyUserRolesByIdQuery(idharu);
    // console.log(User?.data)

    //! User Roles wala  
    const data = useGetAllCompanyRolesQuery(company_id, { skip: !company_id });
    console.log(data?.data)

    const rolesharu = useMemo(() => data?.data?.map(key => ({ id: key.id, title: key.role_name_value })) || [], [data]);

    console.log(rolesharu)
    //! Get other roles 
    // const Roles = useGetAllRoleQuery();

    // const roles = useMemo(() => {
    //     if (Roles.data) {
    //         return Roles.data.map((key) => ({ id: key.id, title: key.role_name }))
    //     }
    //     return [];
    // }, [Roles])


    // const { data } = useGetAllCompanyQuery()

    // const companies = useMemo(() => {
    //     if (data) {
    //         return data.map((key) => ({ id: key.id, title: key.company_name }))
    //     }
    //     return [];
    // }, [data])


    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        temp.first_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.first_name);
        temp.middle_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.middle_name);
        temp.last_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.last_name);
        temp.role_name = returnValidation(['null'], values.role_name);
        temp.phone_number = returnValidation(['null', 'phonenumber', 'specialcharacter'], values.phone_number);
        temp.email = returnValidation(['email', 'null'], values.email);

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        role_name: "",
        email: "",
        phone_number: "",
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


    useEffect(() => {
        validate();
    }, [
        values])


    useEffect(() => {
        if (User?.data) {
            setInitialFValues({
                first_name: User?.data?.user_name?.first_name,
                middle_name: User?.data?.user_name?.middle_name,
                last_name: User?.data?.user_name?.last_name,
                email: User?.data?.user_name?.email,
                phone_number: User?.data?.user_name?.phone_number,
                role_name: User?.data?.role_name?.role_name?.id,
            });
        }
    }, [User])

    //! Edit user
    const [updateUsers] = useUpdateUsersMutation();

    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const jsonData = {
            id: idharu,
            role_name: values.role_name,
            company_name: values.company_name,
            first_name: values.first_name,
            last_name: values.last_name,
            middle_name: values.middlename,
            phone_number: values.phone_number,
            email: values.email,
            station_type: values.station_type
        };
        try {
            const response = await updateUsers(jsonData).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Edited User' });
                setTimeout(() => {
                    onClose(); setSuccessMessage({ show: false, message: '' });
                }, 2000);
            } else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                setLoading(false);
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            } else {
                setErrorMessage({ show: true, message: 'Data failed to add.' });
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
    }, [updateUsers, values])

    console.log(values.role_name)
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
                            Edit Company Users
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>
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

export default React.memo(EditCompanyWiseUsers);