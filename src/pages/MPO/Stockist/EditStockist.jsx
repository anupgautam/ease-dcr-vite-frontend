import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box,
    Typography, Button
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
import {
    useGetStockistsByIdQuery,
    useUpdateStockistsMutation
} from "@/api/MPOSlices/StockistSlice";
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice';
import { CookieContext } from '@/App'

const EditStockist = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const { data: CompanyArea } = useGetAllCompanyAreasQuery(company_id);

    const companyAreaData = useMemo(() => {
        if (CompanyArea) {
            return CompanyArea.map(key => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [CompanyArea])

    //! Getting Stockist by ID
    const Stockist = useGetStockistsByIdQuery(idharu);

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('stockist_name' in fieldValues)
            temp.stockist_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.stockist_name)
        temp.stockist_address = returnValidation(['null'], values.stockist_address)
        temp.stockist_contact_number = returnValidation(['null', 'phonenumber', 'specialcharacter'], values.stockist_contact_number)
        temp.pan_vat_number = returnValidation(['null'], values.pan_vat_number)
        temp.stockist_territory = returnValidation(['null'], values.stockist_territory)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        stockist_name: "",
        stockist_address: "",
        stockist_contact_number: "",
        pan_vat_number: "",
        stockist_territory: "",
        stockist_category: "",
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

    useEffect(() => {
        if (Stockist.data) {
            setInitialFValues({
                stockist_name: Stockist.data.stockist_name.stockist_name,
                stockist_address: Stockist.data.stockist_name.stockist_address,
                stockist_contact_number: Stockist.data.stockist_name.stockist_contact_number,
                pan_vat_number: Stockist.data.stockist_name.pan_vat_number,
                stockist_territory: Stockist.data.stockist_name.stockist_territory,
                stockist_category: Stockist.data.stockist_name.stockist_category

            });
        }
    }, [Stockist.data])



    useEffect(() => {
        validate();

    }, [
        values.stockist_name, values.stockist_address, values.stockist_contact_number, values.stockist_territory, values.pan_vat_number
    ])

    //! Edit user
    const [updateStockists] = useUpdateStockistsMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("stockist_name", values.stockist_name);
        formData.append("stockist_address", values.stockist_address);
        formData.append("stockist_contact_number", values.stockist_contact_number);
        formData.append("pan_vat_number", values.pan_vat_number);
        formData.append("stockist_territory", values.stockist_territory);
        formData.append('id', idharu)
        formData.append("company_name", company_id);
        formData.append("stockist_category", values.stockist_category);
        updateStockists(formData)
        try {
            const response = await updateStockists(formData).unwrap();

            setSuccessMessage({ show: true, message: 'Successfully Edited Stockists' });
            setTimeout(() => {
                setSuccessMessage({ show: false, message: '' });
            }, 3000);
        }
        catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
    }, [updateStockists, idharu, values])

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
                        <Typography variant="h6">
                            Edit Stockist
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>
                        <Box marginBottom={2}>
                            <Controls.Input
                                id="autoFocus"
                                autoFocus
                                name="stockist_name"
                                label="Stockist Name*"
                                value={values.stockist_name}
                                onChange={handleInputChange}
                                error={errors.stockist_name}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="stockist_address"
                                label="Stockist Address*"
                                value={values.stockist_address}
                                onChange={handleInputChange}
                                error={errors.stockist_address}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="stockist_contact_number"
                                label="Phone Number*"
                                value={values.stockist_contact_number}
                                onChange={handleInputChange}
                                error={errors.stockist_contact_number}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="pan_vat_number"
                                label="Pan Vat Number*"
                                value={values.pan_vat_number}
                                onChange={handleInputChange}
                                error={errors.pan_vat_number}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="stockist_category"
                                label="Stockist Category*"
                                value={values.stockist_category}
                                onChange={handleInputChange}
                                error={errors.stockist_category}
                                options={[{ id: 'A', title: 'A' }, { id: 'B', title: 'B' }, { id: 'C', title: 'C' }]}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="stockist_territory"
                                label="Stockist Territory*"
                                value={values.stockist_territory}
                                onChange={handleInputChange}
                                error={errors.stockist_territory}
                                options={companyAreaData}
                            />
                        </Box>
                        <Stack spacing={1} direction="row">
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                onClick={(e) => { handleSubmit(e); onClose() }}
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
                    </Form>
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
    );
};

export default React.memo(EditStockist);