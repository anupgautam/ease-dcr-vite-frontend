import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';

import { useForm } from '../../../reusable/forms/useForm';
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';

import {
    useCreateTPDaysMutation
} from '@/api/MPOSlices/TourPlanSlice';
import {
    useGetUsersRoleQuery,
} from '@/api/MPOSlices/UserSlice';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '../../../reusable/extractErrorMessage';

const AddTPLock = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

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

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [createTPDays] = useCreateTPDaysMutation();

    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ('company_roles' in fieldValues)
            temp.company_roles = returnValidation(['null'], values.company_roles);
        if ('tp_lock_days' in fieldValues)
            temp.tp_lock_days = returnValidation(['null'], values.tp_lock_days);

        setErrors({
            ...temp
        });

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "");
    };

    const initialFValues = {
    };

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true, validate);

    useEffect(() => {
        validate();
    }, [values.company_roles, values.tp_lock_days]);

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const onAddTPDays = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        if (validate()) {
            const data = { company_name: company_id, tp_lock_days: values.tp_lock_days, company_roles: values.company_roles };
            try {
                const response = await createTPDays(data)
                if (response) {
                    setSuccessMessage({ show: true, message: 'Successfully Added TP Lock Days' });
                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                    }, 3000);
                    resetForm();
                    setIsDrawerOpen(false);
                }
                else if (response?.error) {
                    setErrorMessage({ show: true, message: extractErrorMessage({ data: res.error }) });
                    setLoading(false);
                    setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                }
            } catch (error) {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            } finally {
                setLoading(false)
            }
        }
    }, [createTPDays, values]);

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
                    width: 400,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400
                    }
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
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Add DCR Lock Days
                        </Typography>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="company_roles"
                            label="Role Name*"
                            className={"drawer-role-name-select"}
                            value={values.name}
                            onChange={handleInputChange}
                            options={rolesharu}
                            error={errors.company_roles}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="tp_lock_days"
                            label="Days*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.tp_lock_days}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            onClick={(e) => onAddTPDays(e)}
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
            {loading && (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1000 }}>
                    <CircularProgress />
                </Grid>
            )}

        </>
    );
};

export default React.memo(AddTPLock);
