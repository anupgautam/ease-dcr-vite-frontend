import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';
import Cookies from 'js-cookie'
import { useForm } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';

import {
    useCreateCompanyDivisionsMutation
} from '@/api/DivisionSilces/companyDivisionSlice';

const AddDivision = () => {

    //! Create Chemist
    const [createDivisions] = useCreateCompanyDivisionsMutation()

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('division_name' in fieldValues)
            temp.division_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.division_name)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        company_name: Cookies.get('company_id'),
    })

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true)

    useEffect(() => {
        validate();

    }, [values.division_name])


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddCompanyDivision = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("division_name", values.division_name);
        formData.append("company_name", Cookies.get('company_id'));
        try {
            const response = await createDivisions(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Added Company Division' });
            setTimeout(() => {
                setSuccessMessage({ show: false, message: '' });
            }, 3000);
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }

        setIsDrawerOpen(false)
    }, [values, createDivisions]);

    // useEffect(() => {
    //     const handleKeyDown = (e) => {
    //         if (e.key === 'Enter' && values.reward && values.price) {
    //             onAddCompanyDivision(e);
    //         }
    //     };
    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, [values.division_name,onAddCompanyDivision]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
                        // width="400px"
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: '40px' }}
                    >
                        <IconButton
                            className="close-button"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Add Division
                        </Typography>
                    </Box>

                    <Box marginBottom={2}>
                        <Controls.Input
                            id="focus"
                            name="division_name"
                            label="Division Name*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.division_name}
                            autoFocus
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        {/* <Button
                            variant="contained"
                            className="summit-button"
                            onClick={(e) => onAddCompanyDivision(e)}
                        >
                            Submit{" "}
                        </Button> */}
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            onClick={(e) => onAddCompanyDivision(e)}
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
    )
}

export default React.memo(AddDivision)