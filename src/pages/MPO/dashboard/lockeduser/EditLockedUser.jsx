import React, { useEffect, useState, useCallback } from 'react'
import {
    Box, Grid,
    Typography, Button, InputLabel
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import 'react-datepicker/dist/react-datepicker.css';
import { NepaliDatePicker } from "nepali-datepicker-reactjs"
import "nepali-datepicker-reactjs/dist/index.css"

//! Reusable Component
import { useForm, Form } from '../../../../reusable/forms/useForm'
import Controls from '../../../../reusable/components/forms/controls/Controls';
import { returnValidation } from '../../../../validation';
//! Api Slices 
import {
    useGetApplicationsByIdQuery,
    useGetUpperLevelCompanyUserRoleByIdMutation,
    useUpdateApplicationsMutation,
} from '@/api/ApplicationSlices/ApplicationSlices'
import { useSelector } from 'react-redux';

import Cookies from 'js-cookie'

const EditApplication = ({ mpoId, idharu, onClose }) => {

    const userList = useSelector(state => state?.tourPlan?.dataList);

    //! Nepali Date format wala
    const [leaveFrom, setLeaveFrom] = useState()
    const [leaveTo, setLeaveTo] = useState()
    const [submissionDate, setSubmissionDate] = useState()

    //! Getting Application by ID
    const Application = useGetApplicationsByIdQuery(idharu);

    //! Get Higher level user roles
    // const company_user_role = Cookies.get("company_user_role_id");
    const company_user_role = 3;
    const [HigherUser, setHigherUser] = useState();
    const [HigherLevelUser] = useGetUpperLevelCompanyUserRoleByIdMutation();

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
    const [initialFValues, setInitialFValues] = useState({
        leave_type: "",
        leave_cause: "",
        leave_from: "",
        leave_to: "",
        leave_status: "",
        is_submitted: "",
        submission_date: "",
        is_approved: "",
        company_name: "",
        approved_by: "",
        submit_to: "",
    })

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
            });
        }
    }, [Application.data])


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


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Edit tourplan
    const [updateApplications] = useUpdateApplicationsMutation();
    const history = useNavigate()


    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("leave_type", values.leave_type);
        formData.append("leave_cause", values.leave_cause);
        formData.append("leave_from", leaveFrom);
        formData.append("leave_to", leaveTo);
        formData.append("submission_date", Application?.data?.submission_date);
        formData.append("leave_status", values.leave_status);
        formData.append("is_submitted", values.is_submitted);
        formData.append("is_approved", values.is_approved);
        formData.append("company_name", values.company_name);
        formData.append("approved_by", Cookies.get("User_id"));
        formData.append("submit_to", values.submit_to);
        formData.append('id', idharu)
        formData.append('company_name', Cookies.get('company_id'))
        formData.append('mpo_name', mpoId);
        try {
            const response = await updateApplications(formData).unwrap();

            setSuccessMessage({ show: true, message: 'Successfully Edited Application' });
            setTimeout(() => {
                history("/dashboard/admin/application")
                setSuccessMessage({ show: false, message: '' });
            }, 3000);
        }
        catch (error) {

            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
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
                        width="340px"
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
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
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
                            </Grid>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="leave_cause"
                                        label="Leave Cause"
                                        value={values.leave_cause}
                                        onChange={handleInputChange}
                                        errors={errors.leave_cause}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="leave_status"
                                label="Leave Status"
                                value={values.leave_status}
                                onChange={handleInputChange}
                                errors={errors.leave_status}
                            />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <InputLabel>{"Leave From"}</InputLabel>
                                    {/* <Controls.DatePicker
                                        name="leave_from"
                                        label="Leave From"
                                        showIcon
                                        selectedDate={values.leave_from}
                                        onChange={handleInputChange}
                                        dateFormat="yyyy-MM-dd"
                                        error={errors.leave_from}
                                    /> */}
                                    <NepaliDatePicker
                                        inputClassName="form-control"
                                        value={values.leave_from}
                                        onChange={(value) => setLeaveFrom(value)}
                                        options={{ calenderLocale: "en", valueLocale: "en" }}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <InputLabel>{"Leave To"}</InputLabel>
                                    {/* <Controls.DatePicker
                                        name="leave_to"
                                        label="Leave To"
                                        showIcon
                                        selectedDate={values.leave_to}
                                        onChange={handleInputChange}
                                        dateFormat="yyyy-MM-dd"
                                        errors={errors.leave_to}
                                    /> */}
                                    <NepaliDatePicker
                                        inputClassName="form-control"
                                        value={values.leave_to}
                                        onChange={(value) => setLeaveTo(value)}
                                        options={{ calenderLocale: "en", valueLocale: "en" }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="approved_by"
                                        label="Approved By*"
                                        value={values.approved_by}
                                        onChange={handleInputChange}
                                        error={errors.approved_by}
                                        options={submittedto}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <InputLabel>{"Submission Date"}</InputLabel>
                                    <NepaliDatePicker
                                        inputClassName="form-control"
                                        value={values.submission_date}
                                        onChange={(value) => setSubmissionDate(value)}
                                        options={{ calenderLocale: "en", valueLocale: "en" }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="submit_to"
                                label="Submit To*"
                                value={values.submit_to}
                                onChange={handleInputChange}
                                options={submittedto}
                                error={errors.submit_to}
                            />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Box marginBottom={2}>
                                    <Controls.Checkbox
                                        name="is_submitted"
                                        label="Is Submitted"
                                        value={values.is_submitted}
                                        onChange={handleInputChange}
                                        errors={errors.is_submitted}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={3}>
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
                                onClick={(e) => { handleSubmit(e); onClose() }}
                                text="Submit"
                            />
                            <Button
                                variant="outlined"
                                // className="cancel-button"
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

export default React.memo(EditApplication);