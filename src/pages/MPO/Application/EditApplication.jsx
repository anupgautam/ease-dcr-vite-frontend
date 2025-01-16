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
import { toast } from 'react-toastify';

const EditApplication = ({ mpoId, idharu, onClose }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Getting Application by ID
    const Application = useGetApplicationsByIdQuery(idharu);

    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('leave_type' in fieldValues)
            temp.leave_type = returnValidation(['null'], values.leave_type)
            temp.leave_cause = returnValidation(['null'], values.leave_cause)
        // temp.leave_cause = returnValidation(['null', 'lessThan50', 'specialcharacter', 'minLength3'], values.leave_cause)

        temp.leave_status = returnValidation(['null'], values.leave_status)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

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

    const leaves = [
        { id: "CL", title: "Casual Leave" },
        { id: "SL", title: "Sick Leave" },
        { id: "PL", title: "Paid Leave" },
        { id: "LWP", title: "Leave Without Pay" }
    ]



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

    useEffect(() => {
        if (Application.data) {
            setInitialFValues({
                leave_type: Application?.data?.leave_type,
                leave_cause: Application?.data?.leave_cause,
                leave_from: Application?.data?.leave_from,
                leave_to: Application?.data?.leave_to,
                leave_status: Application?.data?.leave_status,
                is_submitted: Application?.data?.is_submitted,
                submission_date: Application?.data?.submission_date,
                is_approved: Application?.data?.is_approved,
                company_name: Application?.data?.company_name,
                approved_by: Application?.data?.approved_by,
                submit_to: Application?.data?.submit_to,
                user_id: Application?.data?.user_id,
            });
            setDateDataAnother(Application?.data?.leave_to);
            setDateData(Application?.data?.leave_from);
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

    //! Get Higher level user roles
    const company_user_role = 3;
    const [HigherLevelUser] = useGetUpperLevelCompanyUserRoleByIdMutation();

    const [HigherUser, setHigherUser] = useState();

    useEffect(() => {
        if (HigherUser) {
            const updatedSubmittedTo = HigherUser?.data?.map((key) => ({
                id: key?.id,
                title: key?.user_name?.first_name + " " + key?.user_name?.last_name,
            }));
            setSubmittedTo(updatedSubmittedTo);
        }
    }, [HigherUser]);

    const [submittedto, setSubmittedTo] = useState([]);
    useEffect(() => {
        HigherLevelUser({ "id": company_user_role })
            .then((Submitted) => {
                setHigherUser(Submitted);
            })
            .catch((err) => {
            });
    }, [HigherLevelUser]);

    const [dateData, setDateData] = useState();
    const [dateDataAnother, setDateDataAnother] = useState();


    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);

        setIsButtonDisabled(!valid);
    }, [values.leave_type,
    values.leave_cause]);

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
            is_approved: values.is_approved ? values.is_approved : false,
            id: idharu,
            company_name: company_id,
            user_id: values.user_id,
            is_submitted: values.is_submitted,
        };
        try {
            const response = await updateApplications(formData).unwrap();
            if (response?.data) {
                // setSuccessMessage({ show: true, message: 'Successfully Edited Application' });
                // setTimeout(() => {
                //     // history("/dashboard/admin/application")
                //     onClose();
                //     setSuccessMessage({ show: false, message: '' });
                // }, 2000);

                toast.success(`${response?.message}`)
                setIsButtonDisabled(true)
                setLoading(false);
                onClose();
            }
            else if (response?.error) {
                // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                // setLoading(false);
                // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);

                toast.error(`${response?.error?.data?.msg}`)
                setLoading(false);
            }
            else {
                // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                // setTimeout(() => {
                //     setErrorMessage({ show: false, message: '' });
                // }, 2000);

                toast.error(`Some Error Occured`)

            }
        }
        catch (error) {
            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 2000);

            toast.error('Backend Error')
        }
        finally {
            setLoading(false);
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
                        {/* <Controls.Input
                            id="autoFocus"
                            autoFocus
                            name="leave_type"
                            label="Leave Type"
                            value={values.leave_type}
                            onChange={handleInputChange}
                            error={errors.leave_type}
                        /> */}
                        <Controls.Select
                            name="leave_type"
                            label="Leave Type*"
                            value={values.leave_type}
                            options={leaves}
                            onChange={handleInputChange}
                            error={errors.leave_type}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            id="auto-focus"
                            autoFocus
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
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            disabled={isButtonDisabled}
                            onClick={(e) => handleSubmit(e)}
                            text="Submit"
                        />
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