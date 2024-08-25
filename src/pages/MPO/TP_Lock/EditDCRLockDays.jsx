import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react'
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
    useGetTPLockDaysByIdQuery,
    useUpdateTPDaysMutation
} from '@/api/MPOSlices/TourPlanSlice';
import {
    useGetUsersRoleQuery,
} from '@/api/MPOSlices/UserSlice';
import { CookieContext } from '@/App'

const EditTPLock = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    //! Getting TPDays by ID
    const TPDays = useGetTPLockDaysByIdQuery(idharu);
    const [companyRoles, setCompanyRoles] = useState()

    useEffect(() => {
        if (TPDays) {
            setCompanyRoles(TPDays?.data?.company_roles?.id)
        }
    }, [TPDays])

    //! Get user roles
    const { data, isSuccess, } = useGetUsersRoleQuery(company_id);

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
            temp.tp_lock_days = fieldValues.tp_lock_days ? returnValidation(['null', 'isNumberOnly'], fieldValues.tp_lock_days) : "";

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
        if (TPDays.data) {
            setInitialFValues({
                company_roles: TPDays.data.company_roles.role_name_value,
                tp_lock_days: TPDays.data.tp_lock_days,
            });
        }
    }, [TPDays.data])


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

    //! Edit user
    const [updateTPDays] = useUpdateTPDaysMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("company_roles", companyRoles);
        formData.append("tp_lock_days", values.tp_lock_days);
        formData.append("company_name", company_id);
        formData.append("id", idharu);
        try {
            const response = await updateTPDays(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Edited TPDays' });
            setTimeout(() => {
                setSuccessMessage({ show: false, message: '' });
            }, 3000);
        }
        catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
        onClose();
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

export default React.memo(EditTPLock);