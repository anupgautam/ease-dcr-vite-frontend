import React, { useState, useEffect, useMemo, useCallback } from 'react'
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
    useCreateCompanyAreaWiseExpensesMutation
} from '@/api/CompanySlices/companyAreaWiseExpenses';
import {
    useGetAllExpensesTypeQuery
} from '@/api/ExpensesSlices/expensesTypeSlices';
import { useGetAllCompanyRolesQuery } from '@/api/CompanySlices/companyRolesSlice';
import { useSelector } from 'react-redux';

const AddCompanyAreaWiseExpense = () => {

    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Create Travel Allowances
    const [createCompanyAreaWiseExpenses] = useCreateCompanyAreaWiseExpensesMutation()

    //! Get expenses type
    const ExpensesType = useGetAllExpensesTypeQuery();

    const expensestypes = useMemo(() => {
        if (ExpensesType?.data) {
            return ExpensesType?.data.map((key) => ({
                id: key.id,
                title: key.expenses_type
            }))
        } return [];
    }, [ExpensesType])

    //! Get all company area 
    const CompanyRole = useGetAllCompanyRolesQuery(company_id, {
        skip: !company_id
    });

    const companyroles = useMemo(() => {
        if (CompanyRole?.data) {
            return CompanyRole?.data.map((key) => ({
                id: key.id,
                title: key.role_name.role_name,
            }))
        }
        return []
    }, [CompanyRole])

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('expenses_type' in fieldValues)
            temp.expenses_rate = returnValidation(['null', 'specialcharacter'], values.expenses_rate)
        temp.area_name = returnValidation(['null'], values.area_name)

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

    }, [values.expenses_type,
    values.expenses_rate,
    values.company_area,])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddCompanyAreas = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        // formData.append("expenses_type", values.expenses_type);
        formData.append("role_type", values.role_type);
        formData.append("company_role", values.company_role);
        formData.append('company_name', company_id)
        formData.append("allowace", values.allowance);
        try {
            const response = await createCompanyAreaWiseExpenses(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Added Travel Allowances' });
            setTimeout(() => {
                setSuccessMessage({ show: false, message: '' });
            }, 3000);
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        } finally {
            setLoading(false)
        }

        setIsDrawerOpen(false)
    }, []);

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
                            Add Travel Allowances
                        </Typography>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="company_role"
                            label="Company Roles*"
                            value={values.name}
                            onChange={handleInputChange}
                            options={companyroles}
                            error={errors.company_role}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="role_type"
                            label="Role Type"
                            value={values.name}
                            onChange={handleInputChange}
                            errors={errors.role_type}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            name="allowance"
                            label="Allowance"
                            value={values.name}
                            onChange={handleInputChange}
                            errors={errors.allowance}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Button
                            variant="contained"
                            className="summit-button"
                            onClick={(e) => onAddCompanyAreas(e)}
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
        </>
    )
}

export default React.memo(AddCompanyAreaWiseExpense)