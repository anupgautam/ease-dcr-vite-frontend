import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
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
    useCreateTargetMutation
} from '../../../api/ExpensesSlices/targetSlices';
// import { useGetExecutiveLevelUsersQuery } from '../../../api/CompanySlices/companyUserRoleSlice';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { useGetAllCompanyUsersWithoutPaginationQuery } from '../../../api/CompanySlices/companyUserRoleSlice';
import { Key } from '@mui/icons-material';

const AddTarget = () => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

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

    // const { data: rolesData } = useGetExecutiveLevelUsersQuery(company_user_id);
    const Data = useGetAllCompanyUsersWithoutPaginationQuery({ company_name: company_user_role_id });

    const users = useMemo(() => {
        if (Data?.data !== undefined) {
            return Data?.data?.results?.map((key) => ({
                id: key.user_name.id,
                title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name
            }))
        }
    })

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

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddStockists = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const jsonObject = {
            target_from: company_user_role_id,
            target_to: values.target_to.toString(),
            // sales: values.sales,  // Uncomment if needed
            year: selectedYear,
            target_amount: values.target_amount,
            company_name: company_id
        };

        try {
            const response = await createTarget(jsonObject)
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Added Target' });
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
        } finally {
            setLoading(false)
        }
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

export default React.memo(AddTarget)