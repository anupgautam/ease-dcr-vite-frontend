import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box, Grid,
    Typography, Button, CircularProgress
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import 'react-datepicker/dist/react-datepicker.css';

//! Reusable Component
import { useForm, Form } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
//! Api Slices 
import {
    useGetCompanyAreaWiseExpensesByIdQuery,
    useUpdateCompanyAreaWiseExpensesMutation,
} from '@/api/CompanySlices/companyAreaWiseExpenses';
import {
    useGetAllExpensesTypeQuery
} from '@/api/ExpensesSlices/expensesTypeSlices';
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice'
import { useSelector } from 'react-redux';


const EditCompanyAreaWiseExpenses = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const userList = useSelector(state => state?.tourPlan?.dataList);

    //! Getting CompanyAreaExpenses by ID
    const CompanyAreaExpenses = useGetCompanyAreaWiseExpensesByIdQuery(idharu);

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
    const CompanyArea = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });

    const companyareas = useMemo(() => {
        if (CompanyArea?.data) {
            return CompanyArea?.data.map((key) => ({
                id: key.company_area.id,
                title: key.company_area.area_name,
            }))
        }
        return [];
    }, [CompanyArea])


    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('expenses_type' in fieldValues)
            temp.expenses_rate = returnValidation(['null'], values.expenses_rate)
        temp.area_name = returnValidation(['null'], values.area_name)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        expenses_rate: "",
        area_name: "",
    })

    useEffect(() => {
        if (CompanyAreaExpenses.data) {
            setInitialFValues({
                expenses_rate: CompanyAreaExpenses?.data?.expenses_rate,
                area_name: CompanyAreaExpenses?.data?.area_name?.company_area?.id,
            });
        }
    }, [CompanyAreaExpenses.data])

    const { values,
        errors,
        setErrors,
        handleInputChange,
    } = useForm(
        initialFValues,
        true,
        false,
        true
    )

    useEffect(() => {
        validate();
    }, [
        values.expenses_rate,
        values.area_name,
    ])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Edit tourplan
    const [updateCompanyAreaWiseExpenses] = useUpdateCompanyAreaWiseExpensesMutation();
    const history = useNavigate()

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("expenses_rate", values.expenses_rate);
        formData.append("area_name", values.area_name);
        formData.append('id', idharu)
        formData.append('company_name', company_id)
        try {
            const response = await updateCompanyAreaWiseExpenses(formData).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Travel Allowances ' });
                setTimeout(() => {
                    history("/dashboard/admin/companyareawiseexpense")
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
        } finally {
            setLoading(false)
        }
    }, [])

    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
                padding="16px"
            >
                <Box style={{ padding: '20px' }}>
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
                            Edit Travel Allowances
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>
                        {/* <Box marginBottom={2}>
                            <Controls.Select
                                name="expenses_type"
                                label="Expenses Type*"
                                value={values.expenses_type}
                                onChange={handleInputChange}
                                options={expensestypes}
                                error={errors.expenses_type}
                            />
                        </Box> */}
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="expenses_rate"
                                label="Expenses Rate"
                                value={values.expenses_rate}
                                onChange={handleInputChange}
                                errors={errors.expenses_rate}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="area_name"
                                label="Area Name*"
                                value={values.area_name}
                                onChange={handleInputChange}
                                options={companyareas}
                                error={errors.area_name}
                            />
                        </Box>
                        <Stack spacing={1} direction="row">
                            <Button
                                variant="contained"
                                // className="summit-button"
                                onClick={(e) => handleSubmit(e)}
                            >
                                Submit{" "}
                            </Button>
                            <Button
                                variant="outlined"
                                // className="cancel-button"
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

export default React.memo(EditCompanyAreaWiseExpenses);