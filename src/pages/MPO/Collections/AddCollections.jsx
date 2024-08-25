import React, { useState, useEffect, useContext } from 'react'
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
import { useForm } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';

import {
    useCreateCollectionsMutation
} from '@/api/MPOSlices/CollectionsApiSlice';
import { CookieContext } from '@/App'


const AddCollections = () => {

    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    //! Create Chemist
    const [createChemists] = useCreateCollectionsMutation()


    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('chemist_name' in fieldValues)
            temp.chemist_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.chemist_name)
        temp.chemist_address = returnValidation(['null'], values.chemist_address)
        temp.chemist_gender = returnValidation(['null', 'number'], values.chemist_gender)
        temp.chemist_area = returnValidation(['null'], values.chemist_area)
        temp.category_name = returnValidation(['null'], values.chemist_area)
        temp.chemist_phone_number = returnValidation(['null', 'phonenumber', 'specialcharacter'], values.chemist_phone_number)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const initialFValues = {

    }

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

    }, [values.chemist_name, values.chemist_gender, values.chemist_area, values.category_name, values.chemist_address, values.chemist_phone_number])


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddCollectionss = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("chemist_name", values.chemist_name);
        formData.append("chemist_phone_number", values.chemist_phone_number);
        formData.append("chemist_address", values.chemist_address);
        formData.append("chemist_gender", values.chemist_gender);
        formData.append("chemist_area", values.chemist_area);
        formData.append("category_name", values.category_name);
        formData.append('company_id', company_id)
        try {
            const response = await createChemists(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Added Chemists' });
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
    };
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
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Add Collection
                        </Typography>

                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="chemist_name"
                                    label="Chemist Name*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.chemist_name}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="chemist_address"
                                    label="Chemist Address*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.chemist_address}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="chemist_phone_number"
                            label="Phone Number*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.chemist_phone_number}
                        />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="chemist_area"
                                    label="Chemist Area*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.chemist_area}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="chemist_gender"
                            label="Chemist Gender*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.chemist_gender}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Button
                            variant="contained"
                            className="summit-button"
                            onClick={(e) => onAddCollectionss(e)}
                        >
                            Submit{" "}
                        </Button>
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

export default AddCollections