import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    Autocomplete,
    TextField,
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
    useGetAllCompanyAreasQuery,
} from '@/api/CompanySlices/companyAreaSlice';
import { useGetCompanyHolidaysQuery, useCreateHolidayAreasMutation } from '@/api/HolidaySlices/holidaySlices';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';

const AddHolidayArea = () => {
    const { company_id, user_role, company_user_id, access, refresh } = useSelector((state) => state.cookie);

    //! Create Chemist
    const [createHolidayArea] = useCreateHolidayAreasMutation()

    //! Company Area
    const Areas = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });

    const areas = useMemo(() => {
        if (Areas.data) {
            return Areas.data.map((key) => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [Areas])

    const [areaOptions, setAreaOptions] = useState([])
    //! Options
    const handleHolidayAreas = (event, value) => {
        const selectedIds = value.map(option => option.id);
        setAreaOptions(selectedIds);
    };

    //! Company holidays
    const Holidays = useGetCompanyHolidaysQuery(company_id);
    const holidays = useMemo(() => {
        if (Holidays.data) {
            return Holidays.data.map((key) => ({ id: key.id, title: key.holiday_name }))
        }
        return [];
    }, [Holidays])

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

    }, [values.company_area, values.holiday_type])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [company_area, setCompany_Area] = useState();
    //!Modal wala ko click event
    const onAddHolidayArea = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await createHolidayArea({ "holiday_type": values.holiday_type, "company_area": areaOptions }).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Added Holiday Areas' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
                setIsDrawerOpen(false)
            }
            else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
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

    }, [createHolidayArea, values]);

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
                            Add Holiday Areas
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
                    <Box marginBottom={2}>
                        <Controls.Select
                            id="focus"
                            name="holiday_type"
                            label="Holiday Type*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.holiday_type}
                            autoFocus
                            options={holidays}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            onClick={(e) => onAddHolidayArea(e)}
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

export default React.memo(AddHolidayArea)