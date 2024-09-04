import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress, Autocomplete, TextField, InputLabel
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
    useGetFilteredDivisionsQuery,
} from "../../../api/DivisionSilces/companyDivisionSlice";
import { useGetAllExecutiveLevelsMutation } from '../../../api/MPOSlices/UserSlice';
import {
    useGetUsersRoleQuery,
    useCreateUsersMutation
} from '@/api/MPOSlices/UserSlice';
import {
    useGetAllCompanyAreasQuery
} from '@/api/CompanySlices/companyAreaSlice'
import {
    NepaliDateConverter
} from "react-nepali-date-picker-lite";
import { useSelector } from 'react-redux';

import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";

const AddUser = () => {

    const { company_id } = useSelector((state) => state.cookie);

    const [MultipleUser, setAddMultipleUser] = useState(false);

    //! Get user roles
    const { data, isSuccess, } = useGetUsersRoleQuery(company_id, {
        skip: !company_id
    });

    const rolesharu = useMemo(() => {
        if (isSuccess) {
            return data?.map(key => ({ id: key.id, title: key.role_name_value }));
        }
        return [];
    }, [isSuccess, data]);

    //! Get company wise area
    const CompanyAreas = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    })

    const companyAreas = useMemo(() => {
        if (CompanyAreas?.data) {
            return CompanyAreas?.data?.map(key => ({ id: key?.id, title: key?.company_area }));
        }
        return [];
    }, [CompanyAreas]);

    //! Multiple Company wise Area
    const [areaOptions, setAreaOptions] = useState([])

    const handleMultipleCompanyAreas = (event, value) => {
        const selectedIds = value.map(option => option.id);
        setAreaOptions(selectedIds);
    };

    //! Get division
    const Divisions = useGetFilteredDivisionsQuery(company_id, {
        skip: !company_id
    });

    const divisionList = useMemo(() => {
        if (Divisions?.data) {
            return Divisions.data.map(key => ({ id: key?.id, title: key?.division_name }));
        }
        return [];
    }, [Divisions]);

    //! Multiple Company Divsion
    const [divisionOptions, setDivisionOptions] = useState([])

    const handleMultipleDivision = (event, value) => {
        const selectedIds = value.map(option => option.id);
        setDivisionOptions(selectedIds);
    };

    //! Executive level
    const [executiveLevels, setExecutiveLevels] = useState([]);
    const [getExecLevel] = useGetAllExecutiveLevelsMutation();
    // const companyId = company_id;

    // useEffect(() => {
    //     const exce = [];
    //     getExecLevel(company_id, {
    //         skip: !company_id
    //     }).then((res) => {
    //         // 
    //         res?.data?.map((key) => {
    //             exce.push({ id: key?.id, title: key?.user_name?.first_name + " " + key?.user_name?.middle_name + " " + key?.user_name?.last_name })
    //         })
    //     })
    //     setExecutiveLevels(exce);
    // }, [company_id])

    useEffect(() => {
        const fetchExecutiveLevels = async () => {
            try {
                const response = await getExecLevel(company_id).unwrap();
                const levels = response.map(key => ({
                    id: key.id,
                    title: `${key.user_name.first_name} ${key.user_name.middle_name} ${key.user_name.last_name}`
                }));
                setExecutiveLevels(levels);
            } catch (error) {
                console.error('Failed to fetch executive levels:', error);
            }
        };

        if (company_id) fetchExecutiveLevels();
    }, [company_id, getExecLevel]);


    //! Format Date
    const now = new BSDate().now();
    const [dateData, setDateData] = useState(now);
    const [dateFormat, setDateFormat] = useState(dateData?._date)
    const [nepaliDate, setNepaliDate] = useState(dateFormat)


    const formatDate = (date) => {
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDate(nepaliDate);

    useEffect(() => {
        const formatDate = (date) => {
            const year = date.year;
            const month = String(date.month).padStart(2, '0');
            const day = String(date.day).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const formattedDate = formatDate(nepaliDate);
    }, [dateData])


    const stations = [
        { id: 1, title: "Home Station" },
        { id: 2, title: "Ex Station" },
        { id: 3, title: "Out Station" },
        { id: 4, title: "Non Working" },
    ]


    //! Create User
    const [createUsers] = useCreateUsersMutation()

    const initialFValues = {
        middle_name: "",
    };

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
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
        if ('station_type' in fieldValues)
            temp.station_type = returnValidation(['null'], values.station_type);


        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
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

    }, [values])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddUsers = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append("first_name", values.first_name);
        formData.append("middle_name", values.middle_name);
        formData.append("last_name", values.last_name);
        formData.append("address", values.address);
        formData.append("phone_number", values.phone_number);
        formData.append("email", values.email);
        formData.append("role_name", values.role_name);
        formData.append("executive_level", values.executive_level);
        formData.append("company_id", company_id);
        formData.append("company_area", values.company_area);
        formData.append("division_name", values.division_name);
        // formData.append("company_area", JSON.stringify(areaOptions))
        // formData.append("division_name", JSON.stringify(divisionOptions))
        formData.append("station_type", values.station_type);
        formData.append("is_active", true);
        formData.append("date_of_joining", formattedDate);

        try {
            const response = await createUsers(formData)
            if (response?.data) {
                setSuccessMessage({ show: true, message: 'Successfully Added User' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            } else {
                setErrorMessage({ show: true, message: response?.error?.data[0] || response?.error?.data?.user_name?.email[0] });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        } catch (err) {
            setErrorMessage({ show: true, message: 'Email Already exists or some error occur while creating user.' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
        finally {
            setLoading(false)
        }
        setIsDrawerOpen(false);
    }, [createUsers, values]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const addMultipleUser = () => {
        setAddMultipleUser(!MultipleUser);
    };

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
                            Add User
                        </Typography>

                    </Box>

                    {MultipleUser === true ? (<>
                        <Box marginBottom={2}>
                            <Controls.Input
                                id="autoFocus"
                                name="no_of_users"
                                label="Number of Users*"
                                value={values.no_of_users}
                                onChange={handleInputChange}
                                autoFocus
                            />
                        </Box>
                        <Stack spacing={1} direction="row">
                            <Link to={`/dashboard/admin/add/multiple/user?number=${values.no_of_users}`}>
                                <Button variant="contained" className="summit-button">
                                    Submit{' '}
                                </Button>
                            </Link>
                            <Button variant="outlined" className="cancel-button" onClick={() => setIsDrawerOpen(false)}>
                                Cancel
                            </Button>
                        </Stack>
                    </>
                    ) : (
                        <>
                            <Box marginBottom={4}>
                                <Button
                                    variant="contained"
                                    className="summit-button"
                                    style={{ width: '100%', padding: '10px' }}
                                    onClick={addMultipleUser}
                                >
                                    Add Multiple User
                                </Button>
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            id="autoFocus"
                                            autoFocus
                                            name="first_name"
                                            label="First name*"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            error={errors.first_name}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name="middle_name"
                                            label="Middle name"
                                            value={values.name}
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
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.last_name}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="email"
                                    label="Email*"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.email}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <label htmlFor="date" style={{ fontSize: '14px', color: "black", fontWeight: '600', marginBottom: "15px" }}>Date of Joining*</label><br />

                                <NepaliDatePicker
                                    value={dateData}
                                    format="YYYY-MM-DD"
                                    onChange={(value) => setDateData(value)} />
                            </Box>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name="address"
                                            label="Address*"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            error={errors.address}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name="phone_number"
                                            label="Contact Number*"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            error={errors.phone_number}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>


                            <Box marginBottom={2}>
                                <Controls.Select
                                    name="role_name"
                                    label="Role Name*"
                                    className={"drawer-role-name-select"}
                                    value={values.name}
                                    onChange={handleInputChange}
                                    options={rolesharu}
                                    error={errors.role_name}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <Controls.Select
                                    name="executive_level"
                                    label="Executive Level*"
                                    className={"drawer-role-name-select"}
                                    value={values.name}
                                    onChange={handleInputChange}
                                    options={executiveLevels}
                                    error={errors.executive_level}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <Controls.Select
                                    name="division_name"
                                    label="Division*"
                                    className={"drawer-role-name-select"}
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.division_name}
                                    options={divisionList}
                                />
                                {/* <Autocomplete
                                    multiple
                                    options={divisionList}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleMultipleDivision}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Division*" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                /> */}
                            </Box>
                            <Box marginBottom={2}>
                                <Controls.Select
                                    name="company_area"
                                    label="Company Wise Area*"
                                    className={"drawer-role-name-select"}
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.company_area}
                                    options={companyAreas}
                                />
                                {/* <Autocomplete
                                    multiple
                                    options={companyAreas}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleMultipleCompanyAreas}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Company Areas" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                /> */}
                            </Box>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    name="station_type"
                                    label="Station Type*"
                                    className={"drawer-role-name-select"}
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.station_type}
                                />
                            </Box>
                            <Stack spacing={1} direction="row">
                                <Controls.SubmitButton
                                    variant="contained"
                                    className="submit-button"
                                    onClick={(e) => onAddUsers(e)}
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
                        </>
                    )}
                </Box>
            </Drawer>
            {loading && (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1000 }}>
                    <CircularProgress />
                </Grid>
            )}
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

export default React.memo(AddUser);