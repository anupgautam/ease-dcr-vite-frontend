import React, { useEffect, useState, useCallback } from 'react'
import {
    Box,
    Grid,
    Typography, Button, CircularProgress
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
    useGetCompanyAreasByIdQuery, useUpdateCompanyAreasMutation
} from '../../../api/CompanySlices/companyAreaSlice';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { toast } from 'react-toastify';

const EditCompanyAreas = ({ idharu, onClose }) => {
    const { company_id, refresh, access } = useSelector((state) => state.cookie);

    //! Getting chemist by ID
    const CompanyAreas = useGetCompanyAreasByIdQuery(idharu);

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('company_area' in fieldValues)
            temp.company_area = returnValidation(['null', 'number'], values.company_area)
        temp.station_type = returnValidation(['null'], values.station_type)
        // temp.country = returnValidation(['null', 'number'], values.country)
        // temp.division = returnValidation(['null', 'specialcharacter'], values.division)
        // temp.state = returnValidation(['null', 'specialcharacter'], values.state)
        // temp.longitude = returnValidation(['null', 'alphanumeric'], values.longitude)
        // temp.latitude = returnValidation(['null', 'alphanumeric'], values.latitude)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        company_area: "",
        station_type: "",
        company_name: '',
        // country: "",
        // division: "",
        // state: "",
        // longitude: "",
        // latitude: "",
    })

    useEffect(() => {
        if (CompanyAreas.data) {
            setInitialFValues({
                'company_area': CompanyAreas?.data?.company_area,
                'station_type': CompanyAreas?.data?.station_type,
                'company_name': CompanyAreas?.data?.company_name,
                // 'division': CompanyAreas?.data?.company_area?.division,
                // 'state': CompanyAreas?.data?.company_area?.state,
                // 'longitude': CompanyAreas?.data?.company_area?.longitude,
                // 'latitude': CompanyAreas?.data?.company_area?.latitude,
            });
        }
    }, [CompanyAreas.data])

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
        values.company_area,
        values.station_type,
        // values.country,
        // values.division,
        // values.state,
        // values.longitude,
        // values.latitude,
    ])


    //! Edit user
    const [updateCompanyAreas] = useUpdateCompanyAreasMutation();
    const history = useNavigate();

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)


        const data = { id: idharu, company_area: values.company_area, station_type: values.station_type, company_name: company_id }
        try {
            const response = await updateCompanyAreas(data)
            console.log(response)
            if (response.data) {
                toast.success(`${'Some error Messages'}`)
                onClose();

                // setSuccessMessage({ show: true, message: 'Successfully Edited Company Areas' });
                // setTimeout(() => {
                //     setSuccessMessage({ show: false, message: '' });
                // }, 2000);
            }
            else if (response?.error) {
                toast.error(`${'Some error Messages'}`)
                setLoading(false);

                // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            }
            else {
                toast.error(`${'Some error Messages'}`)

                // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                // setTimeout(() => {
                //     setErrorMessage({ show: false, message: '' });
                // }, 2000);
            }
        }
        catch (error) {
            console.log(error)
            toast.error(`${'Some error Messages'}`)

            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 2000);
        } finally {
            setLoading(false)
        }
    }, [updateCompanyAreas, values])

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
                            Edit Company Areas
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>

                        <Box marginBottom={2}>
                            <Controls.Input
                                id="autoFocus"
                                autoFocus
                                name="company_area"
                                label="Company Area*"
                                value={values.company_area}
                                onChange={handleInputChange}
                                error={errors.company_area}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="station_type"
                                label="Station Type*"
                                value={values.station_type}
                                onChange={handleInputChange}
                                error={errors.station_type}
                            />
                        </Box>
                        {/* <Box marginBottom={2}>
                            <Controls.Input
                                name="division"
                                label="District*"
                                value={values.division}
                                onChange={handleInputChange}
                                error={errors.division}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="state"
                                label="State*"
                                value={values.state}
                                onChange={handleInputChange}
                                error={errors.state}
                            />
                        </Box> */}
                        {/* <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="longitude"
                                        label="Longitude*"
                                        value={values.longitude}
                                        onChange={handleInputChange}
                                        error={errors.longitude}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="latitude"
                                        label="Latitude*"
                                        value={values.latitude}
                                        onChange={handleInputChange}
                                        error={errors.latitude}
                                    />
                                </Box>
                            </Grid>
                        </Grid> */}
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

export default React.memo(EditCompanyAreas);