import React, { useEffect, useState, useCallback } from 'react'
import {
    Box, Grid,
    Typography, Button
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import 'react-datepicker/dist/react-datepicker.css';

//! Reusable Component
import { useForm, Form } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
//! Api Slices 
import {
    useGetExpenseByTheIdQuery,
    useUpdateTravelAllowancesMutation,
} from '@/api/CompanySlices/companyAreaWiseExpenses'
import { useSelector } from 'react-redux';

const EditTravelAllowances = ({ mpoId, idharu, onClose }) => {

    const userList = useSelector(state => state?.tourPlan?.dataList);

    //! Getting TravelAllowance by ID
    const TravelAllowance = useGetExpenseByTheIdQuery(idharu);

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('area_from' in fieldValues)
            temp.area_from = returnValidation(['null'], values.area_from)
        temp.area_to = returnValidation(['null'], values.area_to)
        temp.daily_allowance = returnValidation(['null'], values.daily_allowance)
        temp.travel_allowance = returnValidation(['null'], values.travel_allowance)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        area_from: "",
        area_to: "",
        daily_allowance: "",
        travel_allowance: "",
        company_name: "",
        user_id: "",
        date: "",
        year: "",
        month: "",
    })

    useEffect(() => {
        if (TravelAllowance.data) {
            setInitialFValues({
                area_from: TravelAllowance?.data?.area_from,
                area_to: TravelAllowance?.data?.area_to,
                daily_allowance: TravelAllowance?.data?.daily_allowance,
                travel_allowance: TravelAllowance?.data?.travel_allowance,
                company_name: TravelAllowance?.data?.company_name,
                user_id: TravelAllowance?.data?.user_id,
                date: TravelAllowance?.data?.date,
                year: TravelAllowance?.data?.year,
                month: TravelAllowance?.data?.month
            });
        }
    }, [TravelAllowance.data])


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
    }, [values.area_from,
    values.area_to,
    values.daily_allowance,
    values.travel_allowance
    ])


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Edit tourplan
    const [updateTravelAllowances] = useUpdateTravelAllowancesMutation();
    const history = useNavigate()

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        try {
            await updateTravelAllowances({ data: values, id: idharu })
                .then((res) => {
                    if (res.data) {
                        setSuccessMessage({ show: true, message: 'Successfully Edited TravelAllowance' });
                        setTimeout(() => {
                            history("/dashboard/admin/application")
                            setSuccessMessage({ show: false, message: '' });
                        }, 3000);
                    } else {
                        setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                        setTimeout(() => {
                            setErrorMessage({ show: false, message: '' });
                        }, 3000);
                    }
                })
                .catch((err) => {
                    setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 3000);
                })

        }
        catch (error) {

            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
    }, [updateTravelAllowances, values])

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
                            Edit TravelAllowance
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        id="auto-focus"
                                        autoFocus
                                        name="area_from"
                                        label="From"
                                        value={values.area_from}
                                        onChange={handleInputChange}
                                        error={errors.area_from}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="area_to"
                                        label="To"
                                        value={values.area_to}
                                        onChange={handleInputChange}
                                        errors={errors.area_to}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="daily_allowance"
                                    label="Daily Allowance"
                                    value={values.daily_allowance}
                                    onChange={handleInputChange}
                                    errors={errors.daily_allowance}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="travel_allowance"
                                    label="Travel Allowance"
                                    value={values.travel_allowance}
                                    onChange={handleInputChange}
                                    errors={errors.travel_allowance}
                                />
                            </Box>
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

export default React.memo(EditTravelAllowances);