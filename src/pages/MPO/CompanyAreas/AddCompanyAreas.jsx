import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress
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
    useCreateCompanyAreasMutation
} from '@/api/CompanySlices/companyAreaSlice';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '../../../reusable/extractErrorMessage';

const AddCompanyAreas = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! react-google-map-picker 
    const DefaultLocation = { lat: 10, lng: 106 };
    const DefaultZoom = 10;

    const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);

    const [location, setLocation] = useState(defaultLocation);
    const [zoom, setZoom] = useState(DefaultZoom);

    function handleChangeLocation(lat, lng) {
        setLocation({ lat: lat, lng: lng });
    }

    function handleChangeZoom(newZoom) {
        setZoom(newZoom);
    }

    function handleResetLocation() {
        setDefaultLocation({ ...DefaultLocation });
        setZoom(DefaultZoom);
    }

    //! Create Chemist
    const [createCompanyAreas] = useCreateCompanyAreasMutation()


    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('company_name' in fieldValues)
            temp.company_area = returnValidation(['null'], values.company_area)
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
        longitude: "27.693970",
        latitude: "85.314030",
    })

    // useEffect(()=>{
    //     setInitialValues({
    //         'longitude':"27.693970",
    //         'latitude':'85.314030'
    //     })
    // })

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

    }, [
        values.company_area,
        values.station_type,
        values.company_name,
        // values.country,
        // values.division,
        // values.state,
        // values.longitude,
        // values.latitude,
    ])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddCompanyAreas = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)

        const data = { company_area: values.company_area, station_type: values.station_type, company_name: company_id }
        try {
            const response = await createCompanyAreas(data).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Added Company Areas' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
                setIsDrawerOpen(false)
            }
            else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: res?.error }) });
                setLoading(false);
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            }
            else {
                setErrorMessage({ show: true, message: "Error" });
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            }
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        } finally {
            setLoading(false)
        }
    }, [createCompanyAreas, values]);

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
                    width: 400, // Set the desired width of the Drawer
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400 // Set the same width for the paper inside the Drawer
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
                        style={{ marginBottom: "40px" }}
                    >
                        <IconButton
                            className="close-button"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Add Company Areas
                        </Typography>

                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            id="autoFocus"
                            autoFocus
                            name="company_area"
                            label="Company Area Name*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.company_area}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="station_type"
                            label="Station Type*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.station_type}
                        />
                    </Box>
                    {/* <Box marginBottom={2}>
                        <Controls.Input
                            name="division"
                            label="District*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.division}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="state"
                            label="State*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.state}
                        />
                    </Box> */}
                    {/* <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="longitude"
                                    label="Longitude*"
                                    value={values.name}
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
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.latitude}
                                />
                            </Box>
                        </Grid> */}

                    {/* //! react-google-map-picker */}
                    {/* <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Button onClick={handleResetLocation}>Reset Location</Button>
                                <label>Latitute:</label><input type='text' value={location.lat} disabled />
                                <label>Longitute:</label><input type='text' value={location.lng} disabled />
                                <label>Zoom:</label><input type='text' value={zoom} disabled />

                                <MapPicker defaultLocation={defaultLocation}
                                    zoom={zoom}
                                    mapTypeId="roadmap"
                                    style={{ height: '700px' }}
                                    onChangeLocation={handleChangeLocation}
                                    onChangeZoom={handleChangeZoom}
                                    apiKey='AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8' />
                            </Box>
                        </Grid> */}

                    {/*//! google-map-react  */}
                    {/* <GoogleMapReact
                            bootstrapURLKeys={{ key: "" }}
                            defaultCenter={defaultProps.center}
                            defaultZoom={defaultProps.zoom}
                        >
                            <AnyReactComponent
                                lat={59.955413}
                                lng={30.337844}
                                text="My Marker"
                            />
                        </GoogleMapReact> */}


                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            onClick={(e) => onAddCompanyAreas(e)}
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
    )
}

export default React.memo(AddCompanyAreas)