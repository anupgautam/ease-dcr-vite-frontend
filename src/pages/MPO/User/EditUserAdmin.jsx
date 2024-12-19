import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box,
    Typography, Button, Grid, CircularProgress, Autocomplete, TextField
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
//! Reusable Component
import { useForm } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
//! Api Slices 
import {
    useGetcompanyUserRolesByIdQuery,
} from '@/api/CompanySlices/companyUserRoleSlice';
import { useGetAllExecutiveLevelsMutation } from '@/api/CompanySlices/companyUserSlice';
import { useGetAllCompanyRolesQuery } from '@/api/CompanySlices/companyRolesSlice';
import {
    useGetCompanyDivisionsByCompanyIdQuery
} from '@/api/CompanySlices/companyDivisionSlice';
import {
    useGetAllCompanyAreasQuery
} from '@/api/CompanySlices/companyAreaSlice'
import { useUpdateUsersMutation } from '@/api/MPOSlices/UserSlice'
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';


const EditUserAdmin = ({ idharu, onClose }) => {

    const { company_id, refresh, access } = useSelector((state) => state.cookie);

    const now = new BSDate().now();

    const User = useGetcompanyUserRolesByIdQuery(idharu, {
        skip: !idharu
    });

    const data = useGetAllCompanyRolesQuery(company_id, { skip: !company_id });

    const Divisions = useGetCompanyDivisionsByCompanyIdQuery(company_id, { skip: !company_id });

    const CompanyAreas = useGetAllCompanyAreasQuery(company_id, { skip: !company_id });

    const rolesharu = data?.data?.map(key => ({ id: key.id, title: key.role_name_value })) || [];
    const divisions = Divisions?.data?.map(key => ({ id: key.id, title: key.division_name })) || [];
    const companyAreas = CompanyAreas?.data?.map(key => ({ id: key.id, title: key.company_area })) || [];


    //! Executive level
    const [executiveLevels, setExecutiveLevels] = useState([]);
    const [getExecLevel] = useGetAllExecutiveLevelsMutation();
    const [execLoading, setExecLoading] = useState(false);

    const fetchExecutiveLevels = useCallback(async (companyId) => {
        if (!companyId) return;

        try {
            setExecLoading(true);
            const response = await getExecLevel(companyId).unwrap();
            const levels = response.map(key => ({
                id: key.id,
                title: `${key.user_name.first_name} ${key.user_name.middle_name} ${key.user_name.last_name}`
            }));
            setExecutiveLevels(levels);
        } catch (error) {
            console.error('Failed to fetch executive levels:', error);
        } finally {
            setExecLoading(false);
        }
    }, [company_id]);

    useEffect(() => {
        if (!executiveLevels.length && company_id) {
            fetchExecutiveLevels(company_id);
        }
    }, [company_id]);

    const [dateData, setDateData] = useState(now)
    const [dateFormat, setDateFormat] = useState(dateData?._date)
    const [nepaliDate, setNepaliDate] = useState(dateFormat)

    const [initialFValues, setInitialFValues] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        role_name: "",
        email: "",
        phone_number: "",
        executive_level: "",
        division_name: "",
        company_area: "",
        station_type: "",

    })

    const [multipleDivisions, setMultipleDivisions] = useState([])
    const handleMultipleDivsions = (e, value) => {
        setMultipleDivisions(value);
    }

    const [multipleCompanyAreas, setMultipleCompanyAreas] = useState([])
    const handleMultpleCompanyAreas = (e, value) => {
        setMultipleCompanyAreas(value);
    }


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
        let temp = { ...errors }
        if ('first_name' in fieldValues)
            temp.first_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.first_name);
        temp.middle_name = returnValidation(['number', 'lessThan50', 'specialcharacter'], values.middle_name);
        if ('last_name' in fieldValues)
            temp.last_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.last_name);
        if ('address' in fieldValues)
            temp.address = returnValidation(['null'], values.address);
        if ('role_name' in fieldValues)
            temp.role_name = returnValidation(['null'], values.role_name);
        if ('division_name' in fieldValues)
            temp.division_name = returnValidation(['null'], values.division_name);
        if ('executive_level' in fieldValues)
            temp.executive_level = returnValidation(['null'], values.executive_level);
        if ('phone_number' in fieldValues)
            temp.phone_number = returnValidation(['null', 'phonenumber', 'specialchracter'], values.phone_number);
        if ('email' in fieldValues)
            temp.email = returnValidation(['null', 'email'], values.email);
        if ('company_area' in fieldValues)
            temp.company_area = returnValidation(['null'], values.company_area);

        setErrors(temp);
        return Object.values(temp).every(x => x === "");
    };

    useEffect(() => {
        validate();
    }, [values.first_name, values.middle_name, values.last_name, values.division, values.company_area, values.executive_level, values.role_name, values.phone_number, values.station_type]);

    useEffect(() => {
        if (User?.data) {
            const selectedDivisions = User.data.division_name?.map(division => ({ id: division.id, title: division.division_name })) || [];
            const selectedCompanyAreas = User.data.company_area?.map(area => ({ id: area.id, title: area.company_area })) || [];
            setInitialFValues({
                first_name: User.data.user_name?.first_name || '',
                middle_name: User.data.user_name?.middle_name || '',
                last_name: User.data.user_name?.last_name || '',
                email: User.data.user_name?.email || '',
                phone_number: User.data.user_name?.phone_number || '',
                role_name: User.data.role_name?.id || '',
                executive_level: User.data.executive_level?.user_name?.id || '',
                station_type: User.data.station_type || '',
                division_name: selectedDivisions[0] || null,
                company_area: selectedCompanyAreas[0] || null
            });
            setDateData(User.data.user_name?.date_of_joining || now);
            setMultipleDivisions(selectedDivisions);
            setMultipleCompanyAreas(selectedCompanyAreas);
        }
    }, [User])

    //! Edit user
    const [updateUsers] = useUpdateUsersMutation();
    const history = useNavigate();


    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });
    const formatDate = (date) => {
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDate(nepaliDate);


    const handleSubmit = async (e) => {
        setLoading(true)
        const jsonData = {
            first_name: values.first_name,
            middle_name: values.middle_name,
            last_name: values.last_name,
            phone_number: values.phone_number,
            email: values.email,
            role_name: values.role_name,
            division_name: multipleDivisions.map(key => key.id),
            executive_level: values.executive_level,
            station_type: values.station_type,
            company_area: multipleCompanyAreas.map(key => key.id),
            id: idharu,
            company_name: company_id,
            refresh: refresh,
            access: access,
            date_of_joining: formattedDate,
            is_active: true
        };


        try {
            const response = await updateUsers({ id: idharu, data: jsonData })
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Edited User' });
                setTimeout(() => {
                    onClose();
                    setSuccessMessage({ show: false, message: '' });
                }, 2000);
            } else if (response?.error) {
                setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                setLoading(false);
                setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
            } else {
                setErrorMessage({ show: true, message: 'Data failed to add.' });
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
        } finally {
            setLoading(false)
        }

    };

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
                            Edit User
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    id="autoFocus"
                                    autoFocus
                                    name="first_name"
                                    label="First name*"
                                    value={values.first_name}
                                    onChange={handleInputChange}
                                    error={errors.first_name}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="middle_name"
                                    label="Middle name*"
                                    value={values.middle_name}
                                    onChange={handleInputChange}
                                    error={errors.middle_name}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="last_name"
                            label="Last name*"
                            value={values.last_name}
                            onChange={handleInputChange}
                            error={errors.last_name}
                        />
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="email"
                                    label="Email*"
                                    value={values.email}
                                    onChange={handleInputChange}
                                    error={errors.email}
                                />
                            </Box>
                        </Grid>

                        <Grid item xs={6}>
                            <Box marginBottom={4}>
                                <Controls.Input
                                    name="phone_number"
                                    label="Contact Number*"
                                    value={values.phone_number}
                                    onChange={handleInputChange}
                                    error={errors.phone_number}
                                />
                            </Box>
                        </Grid>

                    </Grid>
                    <Box marginBottom={2}>
                        <Box marginBottom={2}>
                            <label htmlFor="date" style={{ fontSize: '14px', color: "black", fontWeight: '600', marginBottom: "15px" }}>Date of Joining*</label><br />
                            <NepaliDatePicker value={dateData} format="YYYY-MM-DD" onChange={(value) => setDateData(value)} />
                        </Box>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="role_name"
                            label="Role Name*"
                            className={"drawer-role-name-select"}
                            value={values.role_name}
                            onChange={handleInputChange}
                            error={errors.role_name}
                            options={rolesharu}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Autocomplete
                            value={multipleDivisions || []}
                            onChange={handleMultipleDivsions}
                            options={divisions}
                            multiple
                            getOptionLabel={(option) => option.title}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField {...params} label="Division Name*" error={Boolean(errors.division_name)} helperText={errors.division_name} />
                            )}
                        // renderOption={(props, option) => (
                        //     <li {...props} key={option.id}>
                        //         {option.title}
                        //     </li>
                        // )}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="executive_level"
                            label="Executive Level*"
                            className={"drawer-role-name-select"}
                            value={values.executive_level}
                            onChange={handleInputChange}
                            error={errors.executive_level}
                            options={executiveLevels}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Autocomplete
                            multiple
                            options={companyAreas}
                            getOptionLabel={(option) => option.title}
                            value={multipleCompanyAreas || []}
                            // value={initialFValues.company_area}
                            onChange={handleMultpleCompanyAreas}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField {...params} label="Select the Areas" error={Boolean(errors.company_area)} helperText={errors.company_area} />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.title}
                                </li>
                            )}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="station_type"
                            label="Station Type*"
                            className={"drawer-role-name-select"}
                            value={values.station_type}
                            onChange={handleInputChange}
                            error={errors.station_type}
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

export default React.memo(EditUserAdmin);