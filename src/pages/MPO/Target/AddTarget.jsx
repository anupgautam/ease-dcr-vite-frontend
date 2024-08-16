import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem
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
    useCreateTargetMutation
} from '../../../api/ExpensesSlices/targetSlices';
import Cookies from 'js-cookie'
import { useGetExecutiveLevelUsersQuery } from '../../../api/CompanySlices/companyUserRoleSlice';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';

const AddTarget = () => {
    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;


    const year = [
        { value: '2080', label: '2080' },
        { value: '2081', label: '2081' },
        { value: '2082', label: '2082' },
        { value: '2083', label: '2083' },
        { value: '2084', label: '2084' },
        { value: '2085', label: '2085' },
        { value: '2086', label: '2086' },
        { value: '2087', label: '2087' },
        { value: '2089', label: '2089' },
        { value: '2090', label: '2090' },
    ]

    const [selectedYear, setSelectedYear] = useState(yearData);

    const handleNepaliYearChange = useCallback((event) => {
        setSelectedYear(event.target.value);
    }, [])

    const { data: rolesData } = useGetExecutiveLevelUsersQuery(Cookies.get('company_user_id'));

    const users = useMemo(() => {
        if (rolesData !== undefined) {
            return rolesData?.map((key) => ({
                id: key.id,
                title: key.executive_level.user_name.first_name + " " + key.executive_level.user_name.last_name
            }))
        }
        return [];
    }, [rolesData])


    //! Drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = useCallback(() => {
        setIsDrawerOpen(!isDrawerOpen);
    }, [])

    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, [])

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

    const [createTarget] = useCreateTargetMutation();

    //! Validation wala  
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        temp.year = returnValidation(['null'], values.year)
        temp.target_from = returnValidation(['null'], values.target_from)
        temp.target_to = returnValidation(['null'], values.target_to)
        if ('target_amount' in fieldValues)
            temp.target_amount = fieldValues.target_amount ? returnValidation(['null', 'isNumberOnly'], fieldValues.target_amount) : "";
        if ('sales' in fieldValues)
            temp.sales = fieldValues.sales ? returnValidation(['null', 'isNumberOnly'], fieldValues.sales) : "";

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    useEffect(() => {
        validate();

    }, [values.target_from, values.year, values.sales, values.target_to, values.target_amount])

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddStockists = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("target_from", Cookies.get('company_user_role_id'));
        formData.append("target_to", values.target_to);
        // formData.append("sales", values.sales);
        formData.append("year", selectedYear);
        formData.append("target_amount", values.target_amount);
        formData.append("company_name", Cookies.get("company_id"));
        try {
            const response = await createTarget(formData)
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Added Target' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            } else {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
        setIsDrawerOpen(false)
    }, [createTarget, values])

    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={toggleDrawer} >
                Add
            </Button>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={handleCloseDrawer}
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
                            onClick={handleCloseDrawer}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Add Target
                        </Typography>
                    </Box>
                    <Box marginBottom={2}>
                        {/* <Controls.Select
                            name="year"
                            label="Target Year*"
                            value={selectedYear}
                            onChange={handleInputChange}
                            error={errors.year}
                            options={year}
                        /> */}
                        <FormControl fullWidth>
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={selectedYear}
                                onChange={handleNepaliYearChange}
                                label="Year"
                            >
                                {year.map((year) => (
                                    <MenuItem key={year.value} value={year.value}>
                                        {year.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            id="autoFocus"
                            autoFocus
                            name="target_amount"
                            label="Target Amount*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.target_amount}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="target_to"
                            label="Target To*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.target_to}
                            options={users}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            onClick={(e) => onAddStockists(e)}
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

export default React.memo(AddTarget)