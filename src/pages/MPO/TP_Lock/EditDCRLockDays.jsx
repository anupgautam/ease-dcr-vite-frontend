import React, { useEffect, useState, useCallback, useMemo } from 'react'
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
    useGetTPLockDaysByIdQuery,
    useUpdateTPDaysMutation
} from '@/api/MPOSlices/TourPlanSlice';
import {
    useGetUsersRoleQuery,
} from '@/api/MPOSlices/UserSlice';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '../../../reusable/extractErrorMessage';
import { toast } from 'react-toastify';

const EditTPLock = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Getting TPDays by ID
    const TPDays = useGetTPLockDaysByIdQuery(idharu);
    const [companyRoles, setCompanyRoles] = useState()

    useEffect(() => {
        if (TPDays) {
            setCompanyRoles(TPDays?.data?.company_roles?.id)
        }
    }, [TPDays])

    //! Get user roles
    const { data, isSuccess, } = useGetUsersRoleQuery(company_id, {
        skip: !company_id
    });

    const rolesharu = useMemo(() => {
        if (isSuccess) {
            return data.map(key => ({ id: key.id, title: key.role_name_value }));
        }
        return [];
    }, [isSuccess, data]);


    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('company_roles' in fieldValues)
            temp.company_roles = fieldValues.company_roles ? returnValidation(['null'], fieldValues.company_roles) : "";
        if ('tp_lock_days' in fieldValues)
            temp.tp_lock_days = fieldValues.tp_lock_days ? returnValidation(['null', 'hasValidTwoDigitNumber'], fieldValues.tp_lock_days) : "";

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const [initialFValues, setInitialFValues] = useState({
        company_roles: "",
        tp_lock_days: "",
    })

    useEffect(() => {
        if (TPDays?.data) {
            setInitialFValues({
                company_roles: TPDays.data.company_roles.role_name_value,
                tp_lock_days: TPDays.data.tp_lock_days,
            });
        }
    }, [TPDays])


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
        values.company_roles,
        values.tp_lock_days])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);

        setIsButtonDisabled(!valid);
    }, [values.company_roles, values.tp_lock_days]);

    //! Edit user
    const [updateTPDays] = useUpdateTPDaysMutation();
    const history = useNavigate()
    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = { id: idharu, company_name: company_id, tp_lock_days: values.tp_lock_days, company_roles: companyRoles };
        try {
            const response = await updateTPDays(data)
            if (response?.data) {
                // setSuccessMessage({ show: true, message: 'Successfully Edited TPDays' });
                // setTimeout(() => {
                //     onClose()
                //     setSuccessMessage({ show: false, message: '' });
                // }, 2000);
                toast.success(`${response?.data?.message}`)
                setIsButtonDisabled(true)
                setLoading(false);
                onClose();
            } else if (response?.error) {
                // setErrorMessage({ show: true, message: extractErrorMessage(response?.error) });
                // setTimeout(() => {
                //     setErrorMessage({ show: false, message: '' });
                // }, 2000);
                console.log(response?.error)
                toast.error(`${response?.error?.data?.message}`)
                setLoading(false);
            }
            else {
                toast.error(`Some Error Occured`)
            }
        }
        catch (error) {
            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 2000);
            console.log(error)
            toast.error('Backend Error')
        } finally {
            setLoading(false)
        }
    }, [updateTPDays, values])

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
                            Edit DCR Lock Days
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="company_roles"
                                label="Role Name*"
                                className={"drawer-role-name-select"}
                                value={values.company_roles}
                                onChange={handleInputChange}
                                options={rolesharu}
                                error={errors.company_roles}
                                disabled={true}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="tp_lock_days"
                                label="Days*"
                                value={values.tp_lock_days}
                                onChange={handleInputChange}
                                error={errors.tp_lock_days}
                            />
                        </Box>
                        <Stack spacing={1} direction="row">
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                onClick={(e) => handleSubmit(e)}
                                disabled={isButtonDisabled}
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

export default React.memo(EditTPLock);