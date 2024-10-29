import React, { useEffect, useState, useCallback } from 'react'
import {
    Box, Grid,
    Typography, Button, InputLabel, CircularProgress
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
    useGetApplicationsByIdQuery,
    useGetUpperLevelCompanyUserRoleByIdMutation,
    useUpdateApplicationsMutation,
} from '@/api/ApplicationSlices/ApplicationSlices'
import { NepaliDatePicker } from "nepali-datepicker-react";
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';

const EditApplication = ({ mpoId, idharu, onClose }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Getting Application by ID
    const Application = useGetApplicationsByIdQuery(idharu);

    //! Get Higher level user roles
    const company_user_role = 3;
    const [HigherUser, setHigherUser] = useState();
    const [HigherLevelUser] = useGetUpperLevelCompanyUserRoleByIdMutation();

    const [dateData, setDateData] = useState();
    const [dateDataAnother, setDateDataAnother] = useState();

    const [submittedto, setSubmittedTo] = useState([]);
    useEffect(() => {
        HigherLevelUser({ "id": company_user_role })
            .then((Submitted) => {
                setHigherUser(Submitted);
            })
            .catch((err) => {
            });
    }, [HigherLevelUser]);

    useEffect(() => {
        if (HigherUser) {
            const updatedSubmittedTo = HigherUser?.data?.map((key) => ({
                id: key?.id,
                title: key?.user_name?.first_name + " " + key?.user_name?.last_name,
            }));
            setSubmittedTo(updatedSubmittedTo);
        }
    }, [HigherUser]);


    const [initialFValues, setInitialFValues] = useState({
        leave_type: "",
        leave_cause: "",
        leave_from: "",
        leave_to: "",
        leave_status: "",
        is_submitted: "",
        submission_date: "",
        is_approved: false,
        company_name: "",
        approved_by: "",
        submit_to: "",
    })

    const { values,
        errors,
        setErrors,
        handleInputChange,
    } = useForm(
        initialFValues,
        true,
        false,
        true
    )

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('leave_type' in fieldValues)
            temp.leave_type = returnValidation(['null'], values.leave_type)
        temp.leave_cause = returnValidation(['null'], values.leave_cause)
        temp.leave_from = returnValidation(['null'], values.leave_from)
        temp.leave_to = returnValidation(['null'], values.leave_to)
        temp.leave_status = returnValidation(['null'], values.leave_status)
        temp.is_submitted = returnValidation(['null'], values.is_submitted)
        temp.submission_date = returnValidation(['null'], values.submission_date)
        temp.is_approved = returnValidation(['null'], values.is_approved)
        temp.company_name = returnValidation(['null'], values.company_name)
        temp.approved_by = returnValidation(['null'], values.approved_by)
        temp.submit_to = returnValidation(['null'], values.submit_to)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    useEffect(() => {
        if (Application.data) {
            setInitialFValues({
                leave_type: Application?.data?.application_id?.leave_type,
                leave_cause: Application?.data?.application_id?.leave_cause,
                leave_from: Application?.data?.application_id?.leave_from,
                leave_to: Application?.data?.application_id?.leave_to,
                leave_status: Application?.data?.application_id?.leave_status,
                is_submitted: Application?.data?.application_id?.is_submitted,
                submission_date: Application?.data?.application_id?.submission_date,
                is_approved: Application?.data?.application_id?.is_approved,
                company_name: Application?.data?.application_id?.company_name,
                approved_by: Application?.data?.application_id?.approved_by,
                submit_to: Application?.data?.application_id?.submit_to,
            });
            setDateDataAnother(Application?.data?.application_id?.leave_to);
            setDateData(Application?.data?.application_id?.leave_from);
        }
    }, [Application.data])

    useEffect(() => {
        validate();
    }, [values.leave_type,
    values.leave_cause,
    values.leave_from,
    values.leave_to,
    values.leave_status,
    values.is_submitted,
    values.submission_date,
    values.is_approved,
    values.company_name,
    values.approved_by,
    values.submit_to
    ])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Edit tourplan
    const [updateApplications] = useUpdateApplicationsMutation();
    const history = useNavigate()

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = {
            leave_type: values.leave_type,
            leave_cause: values.leave_cause,
            leave_from: dateData,
            leave_to: dateDataAnother,
            leave_status: 'approved',
            is_approved: values.is_approved,
            id: idharu,
            company_name: company_id,
            user_id: mpoId,
            is_submitted: values.is_submitted
        };
        try {
            const response = await updateApplications(formData).unwrap();

            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Application' });
                setTimeout(() => {
                    history("/dashboard/admin/application")
                    setSuccessMessage({ show: false, message: '' });
                }, 2000);
            }
            else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                setLoading(false);
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            }
            else {
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
        }
    }, [updateApplications, values])

    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
                padding="16px"
            >
                <Box style={{ padding: '20px' }}>
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
                            Edit Application
                        </Typography>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            id="autoFocus"
                            autoFocus
                            name="leave_type"
                            label="Leave Type"
                            value={values.leave_type}
                            onChange={handleInputChange}
                            error={errors.leave_type}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="leave_cause"
                            label="Leave Cause"
                            value={values.leave_cause}
                            onChange={handleInputChange}
                            errors={errors.leave_cause}
                        />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box marginBottom={0}>
                                <InputLabel>{"Leave From"}</InputLabel>
                                <Box marginTop={2}>
                                    <NepaliDatePicker value={dateData} format="YYYY-MM-DD" onChange={(value) => setDateData(value)} />
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box marginBottom={1}>
                                <InputLabel>{"Leave To"}</InputLabel>
                                <Box marginTop={2}>
                                    <NepaliDatePicker value={dateDataAnother} format="YYYY-MM-DD" onChange={(value) => setDateDataAnother(value)} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box marginBottom={2}>
                                <Controls.Checkbox
                                    name="is_approved"
                                    label="Is Approved"
                                    value={values.is_approved}
                                    onChange={handleInputChange}
                                    rrors={errors.is_approved}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Stack spacing={1} direction="row">
                        <Button
                            variant="contained"
                            onClick={(e) => handleSubmit(e)}
                        >
                            Submit{" "}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </Stack>
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

export default React.memo(EditApplication);