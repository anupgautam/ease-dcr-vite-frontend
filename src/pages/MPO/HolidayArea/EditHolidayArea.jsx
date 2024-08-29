import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import {
    Box,
    Typography, Button, Grid,
    Autocomplete, TextField, FormControl, InputLabel, Select, MenuItem, OutlinedInput, CircularProgress
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
import { useGetCompanyHolidaysQuery, useGetHolidayNamesByIdQuery, useUpdateHolidaysMutation } from '@/api/HolidaySlices/holidaySlices';
import {
    useGetAllCompanyAreasQuery,
} from '@/api/CompanySlices/companyAreaSlice';
import { useSelector } from 'react-redux';


const EditHolidayArea = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Getting  by ID
    const HolidayArea = useGetHolidayNamesByIdQuery(idharu);
    //! Company Area
    const Areas = useGetAllCompanyAreasQuery(company_id);

    const areas = useMemo(() => {
        if (Areas.data) {
            return Areas.data.map((key) => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [Areas])

    const [areaOptions, setAreaOptions] = useState([])
    const areaOptionsRef = useRef([]);
    //! Options
    const handleHolidayAreas = (event, value) => {
        const selectedIds = value.map(option => option.id);
        setAreaOptions(selectedIds);
        areaOptionsRef.current = selectedIds;
    };

    //! TR Approach
    const [MultipleHolidays, setMultipleHolidays] = useState([]);

    const handleMultipleHolidays = useCallback((event) => {
        const {
            target: { value },
        } = event;
        setMultipleHolidays(
            typeof value === 'string' ? value.split(',') : value,
        );
    }, []);

    //! Company holidays
    const Holidays = useGetCompanyHolidaysQuery(company_id);
    const holidays = useMemo(() => {
        if (Holidays.data) {
            return Holidays.data.map((key) => ({ id: key.id, title: key.holiday_name }))
        }
        return [];
    }, [Holidays])

    const [initialFValues, setInitialFValues] = useState({
        holiday_type: "",
        company_area: "",
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
        if ('company_area' in fieldValues)
            temp.company_area = returnValidation(['null'], values.company_area)
        temp.holiday_type = returnValidation(['null'], values.holiday_type)
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
        values.company_name, values.holiday_type])

    useEffect(() => {
        if (HolidayArea?.data) {
            setInitialFValues({
                holiday_type: HolidayArea?.data?.id,
                company_area: HolidayArea?.data,
            });
        }
    }, [HolidayArea])

    //! Edit Holiday Area
    const [updateHolidayArea] = useUpdateHolidaysMutation();
    const history = useNavigate()
    const [loading, setLoading] = useState(false)
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await updateHolidayArea({ "holiday_type": values.holiday_type, "company_area": areaOptionsRef.current }).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Holiday Areas' });
                setTimeout(() => {
                    onClose();
                    setSuccessMessage({ show: false, message: '' });
                }, 2000);
            } else {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 2000);
            }
        }
        catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 2000);
        }
        finally {
            setLoading(false)
        }
    }, [updateHolidayArea, values])

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
                            Edit Holiday Areas
                        </Typography>
                    </Box>

                    <Box marginBottom={2}>
                        <Autocomplete
                            multiple
                            options={areas}
                            getOptionLabel={(option) => option.title}
                            onChange={handleHolidayAreas}
                            renderInput={(params) => (
                                <TextField {...params} label="Company Areas" />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.title}
                                </li>
                            )}
                        />
                    </Box>
                    {/* <Box marginBottom={2}>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel>{"Company Areas*"}</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                value={MultipleHolidays}
                                onChange={handleMultipleHolidays}
                                input={<OutlinedInput label="Select the Area*" />}
                                // MenuProps={MenuProps}
                                sx={{ width: '100%' }}
                                style={{
                                    borderBlockColor: "white",
                                    width: "100%",
                                    textAlign: 'start'
                                }}
                            >
                                {areas.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box> */}
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="holiday_type"
                            label="Holiday Type*"
                            value={values.holiday_type}
                            onChange={handleInputChange}
                            error={errors.holiday_type}
                            options={holidays}
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

export default React.memo(EditHolidayArea);