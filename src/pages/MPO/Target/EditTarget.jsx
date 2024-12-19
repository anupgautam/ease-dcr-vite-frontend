import React, { useEffect, useMemo, useState, useCallback } from 'react'
import {
    Box,
    Typography, Button, CircularProgress
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
    useGetTargetsByIdQuery,
    useUpdateTargetsMutation
} from '@/api/ExpensesSlices/targetSlices';
import { useGetUpperCompanyRolesMutation } from '@/api/CompanySlices/companyUserRoleSlice';
import { useGetExecutiveLevelUsersQuery } from '../../../api/CompanySlices/companyUserRoleSlice';
import { useSelector } from 'react-redux';
import { Grid } from 'react-loader-spinner';
import { useGetAllCompanyUsersWithoutPaginationQuery } from '../../../api/CompanySlices/companyUserRoleSlice';


const EditTarget = ({ idharu, onClose }) => {
    const { company_user_id, company_id } = useSelector((state) => state.cookie);

    //! Getting Stockist by ID
    const Target = useGetTargetsByIdQuery(idharu);

    // const [upperUser, setUpperUser] = useState([]);

    // const { data: rolesData } = useGetExecutiveLevelUsersQuery(company_user_id);

    // const upperUser = useMemo(() => {
    //     if (rolesData !== undefined) {
    //         return rolesData?.map((key) => ({
    //             id: key.id,
    //             title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name
    //         }))
    //     }
    //     return [];
    // }, [rolesData])


    const Data = useGetAllCompanyUsersWithoutPaginationQuery({ company_name: company_id });

    const users = useMemo(() => {
        if (Data?.data !== undefined) {
            return Data?.data?.results?.map((key) => ({
                id: key.id,
                title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name
            }))
        }
    })

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('year' in fieldValues)
            temp.year = returnValidation(['null'], values.year)
        if ('target_amount' in fieldValues)
            temp.target_amount = returnValidation(['null', 'alpha'], values.target_amount)
        // if ('sales' in fieldValues)
        //     temp.sales = returnValidation(['null', 'alpha'], values.sales)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        target_from: "",
        target_to: "",
        year: "",
        target_amount: "",
    })


    useEffect(() => {
        if (Target) {
            setInitialFValues({
                target_from: Target?.data?.target_from?.id,
                target_to: Target?.data?.target_to?.id,
                year: Target?.data?.year,
                target_amount: Target?.data?.target_amount,

            });
        }
    }, [Target?.data])

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
        values.target_from,
        values.target_to,
        values.year,
        values.target_amount,
    ])

    //! Edit user
    const [updateTarget] = useUpdateTargetsMutation();
    const history = useNavigate()
    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);

        const jsonData = {
            target_from: values.target_from.id,
            target_to: values.target_to.id,
            year: values.year,
            id: idharu,
            target_amount:values.target_amount,
            company_name: company_id,
        }
        try {
            const response = updateTarget(jsonData)
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Target' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
                onClose();
            }
            else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                setLoading(false);
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 3000);
            }
            else {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        } finally {
            setLoading(false)
        }
    }, [updateTarget, values])

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
                        <Typography variant="h6" className="drawer-box-text">
                            Edit Target
                            <IconButton
                                className="close-button"
                                onClick={onClose}
                            >
                                <Close />
                            </IconButton>
                        </Typography>
                    </Box>
                    <Form onSubmit={handleSubmit}>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="year"
                                label="Year*"
                                value={values.year}
                                onChange={handleInputChange}
                                error={errors.year}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="target_to"
                                label="Target To*"
                                value={values.target_to}
                                onChange={handleInputChange}
                                error={errors.target_to}
                                options={users}
                            />
                        </Box>

                        {/* <Box marginBottom={2}>
                            <Controls.Input
                                name="sales"
                                label="Sales*"
                                value={values.sales}
                                onChange={handleInputChange}
                                error={errors.sales}
                            />
                        </Box> */}
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="target_amount"
                                label="Target Amount*"
                                value={values.target_amount}
                                onChange={handleInputChange}
                                error={errors.target_amount}
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

export default React.memo(EditTarget);