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
import { useForm, Form } from '../../../../reusable/forms/useForm'
import Controls from '../../../../reusable/components/forms/controls/Controls';
import { returnValidation } from '../../../../validation';
//! Api Slices 
import {
    useGetDoctorsSpecialiationByIdQuery,
    useUpdateDoctorsSpecializationMutation,
} from '@/api/MPOSlices/DoctorSlice'

import Cookies from 'js-cookie'

const EditDoctorCategories = ({ idharu, onClose }) => {

    //! Getting Category by ID
    const Category = useGetDoctorsSpecialiationByIdQuery(idharu);

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('category_name' in fieldValues)
            temp.category_name = returnValidation(['null'], values.category_name)
        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const [initialFValues, setInitialFValues] = useState({
        category_name: "",
    })

    useEffect(() => {
        if (Category?.data) {
            setInitialFValues({
                category_name: Category?.data?.category_name,
            });
        }
    }, [Category.data])


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
    }, [values.category_name
    ])

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });


    //! Edit tourplan
    const [updateCategorys] = useUpdateDoctorsSpecializationMutation();
    const history = useNavigate()

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("category_name", values.category_name);
        formData.append('id', idharu)
        formData.append('company_id', Cookies.get('company_id'))
        try {
            const response = await updateCategorys(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Edited Doctor Specialization' });
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
    }, [updateCategorys, values])

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
                            Edit Doctor Specialization
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>
                        <Box marginBottom={2}>
                            <Controls.Input
                                id="focus"
                                autoFocus
                                name="category_name"
                                label="Doctor Specialization"
                                value={values.category_name}
                                onChange={handleInputChange}
                                error={errors.category_name}
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

export default React.memo(EditDoctorCategories);