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
    useCreateStockistsMutation
} from '@/api/MPOSlices/StockistSlice';
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AddStockist = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

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

    const [createStockists] = useCreateStockistsMutation();

    const { data: CompanyArea } = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });

    const companyAreaData = useMemo(() => {
        if (CompanyArea) {
            return CompanyArea.map(key => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [CompanyArea])

    //! Validation wala  
    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('stockist_name' in fieldValues)
            temp.stockist_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.stockist_name)
        temp.stockist_address = returnValidation(['null'], values.stockist_address)
        temp.stockist_contact_number = returnValidation(['null', 'phonenumber', 'specialcharacter'], values.stockist_contact_number)
        temp.pan_vat_number = returnValidation(['null'], values.pan_vat_number)
        temp.stockist_territory = returnValidation(['null'], values.stockist_territory)
        temp.stockist_territory = returnValidation(['null'], values.stockist_category)

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    useEffect(() => {
        validate();

    }, [values.stockist_name, values.stockist_address, values.stockist_contact_number, values.stockist_territory, values.pan_vat_number])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddStockists = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append("stockist_name", values.stockist_name);
        formData.append("stockist_contact_number", values.stockist_contact_number);
        formData.append("stockist_address", values.stockist_address);
        formData.append("pan_vat_number", values.pan_vat_number);
        formData.append("stockist_territory", values.stockist_territory);
        formData.append("stockist_category", values.stockist_category);
        formData.append("company_name", company_id);
        try {
            const response = await createStockists(formData)
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Added Stockist' });
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
        } finally {
            setLoading(false)
        }
        setIsDrawerOpen(false)
    }, [createStockists, values])

    const [MutipleStockist, setAddMutipleStockist] = useState(false);

    const addMutipleStockist = () => {
        setAddMutipleStockist(!MutipleStockist);
    }

    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={toggleDrawer} >
                Add
            </Button>
            {/* <Button
                variant="contained"
                className="user-drawer-button"
                onClick={() => setIsDrawerOpen(true)}
            >
                Add Chemist
            </Button> */}
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={handleCloseDrawer}
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
                            onClick={handleCloseDrawer}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Add Stockist
                        </Typography>

                    </Box>
                    {
                        MutipleStockist === true ?
                            <>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        id="autoFocus"
                                        name="no_of_stockist"
                                        label="Number of Stockist"
                                        value={values.no_of_stockist}
                                        onChange={handleInputChange}
                                        autoFocus
                                    // error={errors.doctor_name}
                                    // className={"drawer-first-name-input"}
                                    />
                                </Box>
                                <Stack spacing={1} direction="row">
                                    <Link to={`/dashboard/admin/add/mutiple/stockist?number=${values.no_of_stockist}`}>
                                        <Button
                                            variant="contained"
                                            className="summit-button"
                                        // onClick={(e) => onAddDoctors(e)}
                                        >
                                            Submit{" "}
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outlined"
                                        className="cancel-button"
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </> :
                            <>
                                <Box marginBottom={4}>
                                    <Button
                                        variant="contained"
                                        className="summit-button"
                                        style={{ width: "100%", padding: "10px" }}
                                        onClick={addMutipleStockist}
                                    >
                                        Add Multiple Stockist
                                    </Button>
                                </Box>

                                <Box marginBottom={2}>
                                    <Controls.Input
                                        id="autoFocus"
                                        autoFocus
                                        name="stockist_name"
                                        label="Stockist Name*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.stockist_name}
                                    />
                                </Box>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="stockist_address"
                                        label="Stockist Address*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.stockist_address}
                                    />
                                </Box>

                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="stockist_contact_number"
                                        label="Phone Number*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.stockist_contact_number}
                                    />
                                </Box>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="pan_vat_number"
                                        label="Pan Vat Number"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.pan_vat_number}
                                    />
                                </Box>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="stockist_category"
                                        label="Stockist Category"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.stockist_category}
                                        options={[{ id: 'A', title: 'A' }, { id: 'B', title: 'B' }, { id: 'C', title: 'C' }]}
                                    />
                                </Box>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="stockist_territory"
                                        label="Stockist Territory*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.stockist_territory}
                                        options={companyAreaData}
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
                            </>
                    }

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

export default React.memo(AddStockist)