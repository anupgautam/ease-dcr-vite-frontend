import React, { useEffect, useState, useCallback } from 'react'
import {
    Box,
    Grid,
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
    useGetCompanyDivisionsByIdQuery,
    useUpdateCompanyDivisionsMutation
} from '@/api/DivisionSilces/companyDivisionSlice';

import Cookies from 'js-cookie'

const EditDivision = ({ idharu, onClose }) => {

    //! Getting company division by ID
    const CompanyDivisions = useGetCompanyDivisionsByIdQuery(idharu);

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('division_name' in fieldValues)
            temp.division_name = returnValidation(['null', 'number'], values.division_name)
        temp.company_name = returnValidation(['null', 'number'], values.company_name)
        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        division_name: "",
        company_name: "",
    })

    useEffect(() => {
        if (CompanyDivisions.data) {
            setInitialFValues({
                'division_name': CompanyDivisions?.data?.division_name,
                'company_name': CompanyDivisions?.data?.company_name,
            });
        }
    }, [CompanyDivisions.data])

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
        values.division_name, values.company_name
    ])

    //! Edit user
    const [updateCompanyDivisions] = useUpdateCompanyDivisionsMutation();
    const history = useNavigate();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("division_name", values.division_name);
        formData.append("company_name", values.company_name);
        formData.append("company_id", Cookies.get('company_id'));
        formData.append('id', CompanyDivisions?.data?.id);
        formData.append('refresh', Cookies.get('refresh'));
        formData.append('access', Cookies.get('access'));
        try {
            const response = await updateCompanyDivisions(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Edited CompanyDivisions' });
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
    }, [updateCompanyDivisions, values])


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
                        style={{ marginBottom: '40px' }}
                    >

                        <IconButton
                            className="close-button"
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6">
                            Edit Division
                        </Typography>
                    </Box>
                    <Form onSubmit={handleSubmit}>
                        <Box marginBottom={2}>
                            <Controls.Input
                                id="autoFocus"
                                autoFocus
                                name="division_name"
                                label="Division Name*"
                                value={values.division_name}
                                onChange={handleInputChange}
                                error={errors.division_name}
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

export default React.memo(EditDivision);