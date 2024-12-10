import React, { useEffect, useState, useCallback } from 'react'
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
    useGetCompanyByIdQuery,
    useUpdateCompanyMutation
} from '../../../api/MPOSlices/SuperAdminSlice'
import { extractErrorMessage } from '../../../reusable/extractErrorMessage';

const EditCompany = ({ idharu, onClose }) => {

    //! Getting Company by ID
    const Company = useGetCompanyByIdQuery(idharu);

    const [initialFValues, setInitialFValues] = useState({
        company_name: "",
        company_phone_number: "",
        company_email_address: "",
        company_address: "",
    })

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

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('company_name' in fieldValues)
            temp.company_name = returnValidation(['null', 'lessThan50', 'specialcharacter'], values.company_name)
        if ('company_contact_number' in fieldValues)
            temp.company_contact_number = returnValidation(['null', 'phonenumber', 'specialchracter'], values.company_contact_number);
        if ('company_email_address' in fieldValues)
            temp.company_email_address = returnValidation(['null'], values.company_email_address);
        if ('company_address' in fieldValues)
            temp.company_address = returnValidation(['null'], values.company_address);

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    useEffect(() => {
        validate();
    }, [
        values.company_address, values.company_email_address, values.company_name, values.company_phone_number])

    useEffect(() => {
        if (Company.data) {
            setInitialFValues({
                company_name: Company.data.company_name,
                company_phone_number: Company.data.company_phone_number,
                company_email_address: Company.data.company_email_address,
                company_address: Company.data.company_address,
            });
        }
    }, [Company.data])


    //! Edit user
    const [updateCompany] = useUpdateCompanyMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const jsonData = {
            id: idharu,
            company_name: values.company_name,
            company_phone_number: values.company_phone_number,
            company_email_address: values.company_email_address,
            company_address: values.company_address,
        };
        try {
            const response = await updateCompany(jsonData)
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Company' });
                onClose();
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            } else {
                setErrorMessage({ show: true, message: extractErrorMessage(response?.error) });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 2000);
            }
        }
        catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
    }, [updateCompany, values])

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
                            Edit Company
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>
                        <Box marginBottom={2}>
                            <Controls.Input
                                id="autoFocus"
                                autoFocus
                                name="company_name"
                                label="Company Name*"
                                value={values.company_name}
                                onChange={handleInputChange}
                                error={errors.company_name}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="company_phone_number"
                                label="Phone Number*"
                                value={values.company_phone_number}
                                onChange={handleInputChange}
                                error={errors.company_phone_number}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="company_email_address"
                                label="Email*"
                                value={values.company_email_address}
                                onChange={handleInputChange}
                                error={errors.company_email_address}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="company_address"
                                label="Address*"
                                value={values.company_address}
                                onChange={handleInputChange}
                                error={errors.company_address}
                            />
                        </Box>
                        <Stack spacing={1} direction="row">
                            {/* <Button
                                variant="contained"
                                className="summit-button"
                                onClick={(e) => { handleSubmit(e); onClose() }}
                            >
                                Submit{" "}
                            </Button> */}
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

export default React.memo(EditCompany);