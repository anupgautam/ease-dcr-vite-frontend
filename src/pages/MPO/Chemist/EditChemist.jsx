import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box,
    Grid,
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
    useGetChemistsByIdQuery,
    useGetChemistsAreaQuery,
    useGetChemistsAreaByIdQuery,
    useUpdateChemistsMutation,
} from "@/api/MPOSlices/ChemistSlice";

import Cookies from 'js-cookie'
import { useGetMpoAreaQuery } from '@/api/MPOSlices/TourPlanSlice';

const EditChemist = ({ idharu, onClose }) => {

    //! Getting chemist by ID
    const Chemist = useGetChemistsByIdQuery(idharu);

    const chemistcategories = [
        { id: "A", title: "A" },
        { id: "B", title: "B" },
        { id: "C", title: "C" },
    ]

    //! Get chemist area
    const ChemistArea = useGetChemistsAreaQuery(Cookies.get('company_id'))

    const chemistareas = useMemo(() => {
        if (ChemistArea?.data) {
            return ChemistArea?.data.map(key => ({ id: key.area_name.id, title: key.area_name.working_area_name }))
        }
        return [];
    }, [ChemistArea])

    //! Getting Chemist area by id

    const AreaById = useGetChemistsAreaByIdQuery(idharu);

    const MpoArea = useGetMpoAreaQuery({ company_name: Cookies.get('company_id'), mpo_name: Chemist?.data?.mpo_name });

    const mpoAreaData = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])

    const [initialFValues, setInitialFValues] = useState({
        chemist_name: "",
        chemist_address: "",
        chemist_pan_number: "",
        chemist_phone_number: "",
        chemist_territory: "",
        chemist_contact_person: "",
        chemist_category: "",
        mpo_name: "",
        is_invested: "",
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
    const validate = useCallback((fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('chemist_name' in fieldValues)
            temp.chemist_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.chemist_name)
        temp.chemist_territory = returnValidation(['null'], values.chemist_territory)
        temp.chemist_address = returnValidation(['null'], values.chemist_address)
        temp.chemist_category = returnValidation(['null'], values.chemist_category)
        temp.chemist_phone_number = returnValidation(['null', 'phonenumber'], values.chemist_phone_number)
        temp.chemist_contact_person = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.chemist_contact_person)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }, [values, errors])




    useEffect(() => {
        if (Chemist?.data || AreaById?.data) {
            setInitialFValues({
                'id': Chemist?.data?.chemist_name?.id,
                'chemist_name': Chemist?.data?.chemist_name?.chemist_name,
                'chemist_address': Chemist?.data?.chemist_name?.chemist_address,
                'chemist_pan_number': Chemist?.data?.chemist_name?.chemist_pan_number,
                'chemist_phone_number': Chemist?.data?.chemist_name?.chemist_phone_number,
                'chemist_territory': Chemist?.data?.chemist_name?.chemist_territory,
                'chemist_contact_person': Chemist?.data?.chemist_name?.chemist_contact_person,
                'chemist_category': Chemist?.data?.chemist_name?.chemist_category,
                'mpo_name': Chemist?.data?.mpo_name,
                'is_invested': Chemist?.data?.is_investment
            });
        }
    }, [Chemist.data, AreaById.data])




    useEffect(() => {
        validate();

    }, [
        values
    ])


    //! Edit user
    const [updateChemists] = useUpdateChemistsMutation();
    const history = useNavigate();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("chemist_name", values.chemist_name);
        formData.append("chemist_address", values.chemist_address);
        formData.append("chemist_category", values.chemist_category);
        formData.append("chemist_pan_number", values.chemist_pan_number);
        formData.append("chemist_phone_number", values.chemist_phone_number);
        formData.append("chemist_territory", values.chemist_territory);
        formData.append("chemist_contact_person", values.chemist_contact_person);
        formData.append("mpo_name", values.mpo_name);
        formData.append("company_id", Cookies.get('company_id'));
        formData.append('id', Chemist?.data?.id);
        formData.append('refresh', Cookies.get('refresh'));
        formData.append('access', Cookies.get('access'));
        formData.append('is_investment', false)
        try {

            const response = await updateChemists(formData).unwrap();

            setSuccessMessage({ show: true, message: 'Successfully Added Chemists' });
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
    }, [updateChemists, idharu, values])

    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
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
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6">
                            Edit Chemist
                        </Typography>
                    </Box>


                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        id="autoFocus"
                                        autoFocus
                                        name="chemist_name"
                                        label="Chemist Name*"
                                        value={values.chemist_name}
                                        onChange={handleInputChange}
                                        error={errors.chemist_name}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="chemist_address"
                                        label="Chemist Address*"
                                        value={values.chemist_address}
                                        onChange={handleInputChange}
                                        error={errors.chemist_address}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="chemist_phone_number"
                                label="Phone Number*"
                                value={values.chemist_phone_number}
                                onChange={handleInputChange}
                                error={errors.chemist_phone_number}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="chemist_contact_person"
                                label="Chemist Contact Person*"
                                value={values.chemist_contact_person}
                                onChange={handleInputChange}
                                error={errors.chemist_contact_person}
                            />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="chemist_pan_number"
                                        label="Chemist Pan Number*"
                                        value={values.chemist_pan_number}
                                        onChange={handleInputChange}
                                        error={errors.chemist_pan_number}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="chemist_category"
                                        label="Chemist Category*"
                                        value={values.chemist_category}
                                        onChange={handleInputChange}
                                        error={errors.chemist_category}
                                        options={chemistcategories}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="chemist_territory"
                                label="Chemist Territory*"
                                value={values.chemist_territory}
                                onChange={handleInputChange}
                                error={errors.chemist_territory}
                                options={mpoAreaData}
                            />
                        </Box>
                        {/* <Box marginBottom={2}>
                            <Controls.Checkbox
                                name="is_invested"
                                value={values.is_invested}
                                onChange={handleInputChange}
                                label="Is Invested"
                            />
                        </Box> */}
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

export default React.memo(EditChemist);