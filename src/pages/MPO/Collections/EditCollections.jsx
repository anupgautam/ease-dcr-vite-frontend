import React, { useEffect, useState } from 'react'
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
    useGetCollectionsByIdQuery,
    useUpdateCollectionsMutation,
} from "@/api/MPOSlices/CollectionsApiSlice";

import Cookies from 'js-cookie'

const EditCollections = ({ idharu, onClose }) => {

    //! Getting chemist by ID
    const Chemist = useGetCollectionsByIdQuery(idharu);

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('chemist_name' in fieldValues)
            temp.chemist_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.chemist_name)
        temp.chemist_address = returnValidation(['null'], values.chemist_address)
        temp.chemist_gender = returnValidation(['null'], values.chemist_gender)
        temp.chemist_phone_number = returnValidation(['null', 'phonenumber','specialcharacter'], values.chemist_phone_number)
        temp.chemist_area = returnValidation(['null'], values.chemist_area)
        temp.category_name = returnValidation(['null'], values.category_name)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        chemist_name: "",
        chemist_address: "",
        chemist_gender: "",
        chemist_phone_number: "",
        chemist_area: "",
        category_name: "",
    })

    useEffect(() => {
        if (Chemist.data) {
            setInitialFValues({
                'chemist_id': Chemist?.data?.results[0]?.chemist_name?.id,
                'chemist_name': Chemist?.data?.results[0]?.chemist_name?.chemist_name,
                'chemist_address': Chemist?.data?.results[0]?.chemist_name?.chemist_address,
                'chemist_gender': Chemist?.data?.results[0]?.chemist_name?.chemist_gender,
                'chemist_phone_number': Chemist?.data?.results[0]?.chemist_name?.chemist_phone_number,
                'chemist_area': Chemist?.data?.results[0]?.chemist_name?.chemist_area,
                // 'category_name': CategoryById?.data[0]?.chemist_category?.category_name?.id,
            });
        }
    }, [Chemist.data])

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
        values.chemist_name,
        values.chemist_address,
        values.chemist_phone_number,
        values.chemist_area,
        values.chemist_gender,
        values.category_name
    ])

    //! Edit user
    const [updateChemists] = useUpdateCollectionsMutation();
    const history = useNavigate();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("chemist_name", values.chemist_name);
        formData.append("chemist_address", values.chemist_address);
        formData.append("chemist_gender", values.chemist_gender);
        formData.append("chemist_phone_number", values.chemist_phone_number);
        formData.append("chemist_area", values.chemist_area);
        formData.append("category_name", values.category_name);
        formData.append("company_id", Cookies.get('company_id'));
        formData.append('id', Chemist?.data?.results[0]?.chemist_name?.id);
        formData.append('refresh', Cookies.get('refresh'));
        formData.append('access', Cookies.get('access'));
        try {

            const response = await updateChemists(formData).unwrap();

            setSuccessMessage({ show: true, message: 'Successfully Added Chemists' });
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
    }


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
                        <Typography variant="h6">
                            Edit Collection
                        </Typography>
                    </Box>


                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="chemist_name"
                                        label="Chemist Name*"
                                        value={values.chemist_name}
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
                                        value={values.chemist_address}
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
                                value={values.chemist_phone_number}
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
                                        value={values.chemist_area}
                                        onChange={handleInputChange}
                                        error={errors.chemist_area}
                                    // options={chemistareas}
                                    />
                                </Box>
                            </Grid>
                            {/* <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="category_name"
                                        label="Chemist Category*"
                                        value={values.category_name}
                                        onChange={handleInputChange}
                                        // className={"drawer-first-name-input"}
                                        error={errors.category_name}
                                        options={chemistcategories}
                                    />
                                </Box>
                            </Grid> */}
                        </Grid>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="chemist_gender"
                                label="Chemist Gender*"
                                value={values.chemist_gender}
                                onChange={handleInputChange}
                                error={errors.chemist_gender}
                                className={"drawer-first-name-input"}
                            />
                        </Box>
                        <Stack spacing={1} direction="row">
                            <Button
                                variant="contained"
                                className="summit-button"
                                onClick={(e) => { handleSubmit(e); onClose() }}
                            >
                                Submit{" "}
                            </Button>
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

export default EditCollections;