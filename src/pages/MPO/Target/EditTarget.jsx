import React, { useEffect, useState } from 'react'
import {
    Box,
    Typography, Button
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

const EditTarget = ({ idharu, onClose }) => {

    //! Getting Stockist by ID
    const Target = useGetTargetsByIdQuery(idharu);

    const [upperUser, setUpperUser] = useState([]);

    const [upperCompany] = useGetUpperCompanyRolesMutation();

    useEffect(() => {
        const upper = [];
        upperCompany(Target?.data?.target_to?.id).then((res) => {
            res.data.forEach((key) => {
                upper.push({ id: key.id, title: key.user_name.first_name + " " + key.user_name.last_name })
            });
            setUpperUser(upper);
        })
    }, [Target])


    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('year' in fieldValues)
            temp.year = returnValidation(['null'], values.year)
        if ('target_amount' in fieldValues)
            temp.target_amount = returnValidation(['null', 'alpha'], values.target_amount)
        if ('sales' in fieldValues)
            temp.sales = returnValidation(['null', 'alpha'], values.sales)

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
        sales: ""
    })

    useEffect(() => {
        if (Target.data) {
            setInitialFValues({
                target_from: Target.data.target_from,
                target_to: Target.data.target_to,
                year: Target.data.year,
                target_amount: Target.data.target_amount,
                sales: Target.data.sales

            });
        }
    }, [Target.data])

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
        values.sales
    ])

    //! Edit user
    const [updateTarget] = useUpdateTargetsMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("target_from", values.target_from.id);
        formData.append("target_to", values.target_to.id);
        formData.append("year", values.year);
        formData.append('id', idharu)
        formData.append('target_amount', values.target_amount)
        formData.append('sales', values.sales);
        updateTarget(formData)
            .then((res) => {
                setSuccessMessage("Successfully edited Stockists")
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, [3000])
            })
            .catch((err) => {
                setErrorMessage("Some Error Occur. Please Try Again Later.");
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, [3000]);
            })
    }

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
                            <Controls.Select
                                name="target_from"
                                label="Target From*"
                                value={values.target_from.id}
                                onChange={handleInputChange}
                                error={errors.target_from}
                                options={upperUser}
                            />
                        </Box>
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
                            <Controls.Input
                                name="sales"
                                label="Sales*"
                                value={values.sales}
                                onChange={handleInputChange}
                                error={errors.sales}
                            />
                        </Box>
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

export default React.memo(EditTarget);