import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box, Grid, Typography, Button, Autocomplete, TextField
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import 'react-datepicker/dist/react-datepicker.css';

import { useForm, Form } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';

import {
    useGetTourPlansByIdQuery,
    useUpdateTourPlansMutation,
    useGetMpoAreaQuery,
} from '@/api/MPOSlices/TourPlanSlice'
import {
    useGetShiftsQuery
} from '@/api/MPOSlices/TourPlanSlice'
import { useSelector } from 'react-redux';
import DateToString from '@/reusable/forms/utils/dateToString';
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";

import Cookies from 'js-cookie'
import moment from 'moment';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';

const EditTourPlan = ({ idharu, onClose }) => {
    const now = new Date();
    const [dateData, setDateData] = useState();
    const userList = useSelector(state => state?.tourPlan?.dataList);

    const TourPlan = useGetTourPlansByIdQuery(idharu);
    const MpoArea = useGetMpoAreaQuery({ company_name: Cookies.get('company_id'), mpo_name: TourPlan?.data?.mpo_name?.id });

    const areas = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map((key) => ({ id: key.id, title: key.area_name }));
        }
        return [];
    }, [MpoArea]);

    const [initialFValues, setInitialFValues] = useState({
        mpo_name: "",
        area_name: [],
        shift: "",
        select_the_date_id: "",
        purpose_of_visit: "",
        is_dcr_added: "",
        select_the_month: "",
        is_approved: "",
        hulting_station: ""
    });

    const [MpoTpArea, setMpoTpArea] = useState([]);

    const handleMpoTpArea = (event, value) => {
        setMpoTpArea(value);
    };

    useEffect(() => {
        if (TourPlan?.data) {
            const selectedAreas = TourPlan?.data?.mpo_area_read?.map(area => ({
                id: area.company_mpo_area_id.id,
                title: area.company_mpo_area_id.area_name,
            }));

            setInitialFValues(prevValues => ({
                ...prevValues,
                mpo_name: `${TourPlan?.data?.mpo_name?.user_name?.first_name} ${TourPlan?.data?.mpo_name?.user_name?.last_name}`,
                shift: TourPlan?.data?.tour_plan?.shift?.id,
                select_the_date_id: TourPlan?.data?.tour_plan?.tour_plan?.select_the_date_id,
                purpose_of_visit: TourPlan?.data?.tour_plan?.tour_plan?.purpose_of_visit,
                select_the_month: TourPlan?.data?.tour_plan?.tour_plan?.select_the_month,
                is_dcr_added: TourPlan?.data?.tour_plan?.tour_plan?.is_dcr_added,
                is_approved: TourPlan?.data?.is_approved,
                hulting_station: TourPlan?.data?.tour_plan?.tour_plan?.hulting_station,
                area_name: selectedAreas,
            }));
            setDateData(TourPlan?.data?.tour_plan?.tour_plan?.select_the_date_id ? TourPlan?.data?.tour_plan?.tour_plan?.select_the_date_id : now)

            setMpoTpArea(selectedAreas || []);
        }
    }, [TourPlan?.data]);

    const { values, errors, setErrors, handleInputChange } = useForm(
        initialFValues,
        true,
        false,
        true
    );

    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ('mpo_name' in fieldValues) temp.mpo_name = returnValidation(['null'], values.mpo_name);
        if ('area_name' in fieldValues) temp.area_name = values.area_name.length === 0 ? "This field is required." : "";
        temp.shift = returnValidation(['null'], values.shift);
        temp.select_the_date_id = returnValidation(['null'], values.select_the_date_id);

        setErrors({ ...temp });

        if (fieldValues === values) return Object.values(temp).every(x => x === "");
    };

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [updateTourPlans] = useUpdateTourPlansMutation();
    const history = useNavigate();

    const monthData = getNepaliMonthName(moment(dateData).month() + 1);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const data = {
            mpo_area: MpoTpArea.map(area => ({ company_mpo_area_id: area.id })),
            shift: values.shift,
            purpose_of_visit: values.purpose_of_visit,
            is_dcr_added: values.is_dcr_added,
            is_approved: values.is_approved,
            hulting_station: values.hulting_station,
            select_the_month: getNepaliMonthName(moment(values.select_the_date_id).month() + 1),
            select_the_date: typeof values.select_the_date_id === "string" ? values.select_the_date_id : DateToString(values.select_the_date_id),
            id: idharu,
            company_name: Cookies.get('company_id')
        };
        try {
            const response = await updateTourPlans({ id: idharu, value: data }).unwrap();

            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Edited TourPlan' });
                setTimeout(() => {
                    history("/dashboard/admin/tourplan");
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
    }, [updateTourPlans, values, MpoTpArea, idharu]);

    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
                sx={{
                    width: 400,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': { width: 400 }
                }}
            >
                <Box style={{ padding: "20px" }}>
                    <Box p={1} width="340px" textAlign="center" role="presentation" className="drawer-box" style={{ marginBottom: "40px" }}>
                        <Typography variant="h6" className="drawer-box-text">
                            <IconButton className="close-button" onClick={onClose}>
                                <Close />
                            </IconButton>
                            <Typography variant="h6">Edit TourPlan</Typography>
                        </Typography>
                    </Box>
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        disabled={true}
                                        name="mpo_name"
                                        label="MPO name*"
                                        value={values.mpo_name}
                                        onChange={handleInputChange}
                                        error={errors.mpo_name}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box marginBottom={2}>
                                    <Autocomplete
                                        multiple
                                        options={areas}
                                        getOptionLabel={(option) => option.title}
                                        value={MpoTpArea}
                                        onChange={handleMpoTpArea}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select the Areas" error={Boolean(errors.area_name)} helperText={errors.area_name} />
                                        )}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box marginBottom={2}>
                            <label htmlFor="date" style={{ fontSize: '14px', color: "black", fontWeight: '600', marginBottom: "15px" }}>Select the Date*</label><br />
                            <NepaliDatePicker
                                value={dateData}
                                format="YYYY-MM-DD"
                                onChange={(value) => setDateData(value)} />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="purpose_of_visit"
                                label="Remarks"
                                value={values.purpose_of_visit}
                                onChange={handleInputChange}
                                placeholderText="Remarks"
                            />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="hulting_station"
                                        label="Hulting Station"
                                        value={values.hulting_station}
                                        onChange={handleInputChange}
                                        placeholderText="Hulting Station"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box marginBottom={2}>
                            {
                                Cookies.get('user_role') !== 'MPO' &&
                                <Controls.Checkbox
                                    name="is_approved"
                                    value={values.is_approved}
                                    onChange={handleInputChange}
                                    label="Is Approved"
                                />
                            }
                        </Box>
                        <Stack spacing={1} direction="row">
                            <Button
                                variant="contained"
                                className="summit-button"
                                onClick={(e) => { handleSubmit(e); onClose() }}
                            >
                                Submit{" "}
                            </Button>
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
}

export default EditTourPlan;
