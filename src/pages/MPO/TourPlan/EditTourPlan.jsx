import React, { useEffect, useState, useMemo, useCallback } from 'react'
import {
    Box, Grid, Typography, Button, Autocomplete, TextField, CircularProgress
} from '@mui/material'
import { useLocation, useNavigate } from "react-router-dom";
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
import { useGetAllVisitedWithAreaQuery } from '@/api/MPOSlices/tourPlan&Dcr';

import {
    useGetShiftsQuery
} from '@/api/MPOSlices/TourPlanSlice'
import { useSelector } from 'react-redux';
import DateToString from '@/reusable/forms/utils/dateToString';
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { toast } from 'react-toastify';
import { useGetAllDayStatusQuery } from "../../../api/MPOSlices/UserSlice";

import moment from 'moment';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';

const EditTourPlan = ({ idharu, onClose }) => {

    const location = useLocation();
    const higherCondition = location.pathname;

    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const now = new Date();
    const [dateData, setDateData] = useState();
    const userList = useSelector(state => state?.tourPlan?.dataList);

    const TourPlan = useGetTourPlansByIdQuery(idharu, {
        skip: !idharu
    });

    console.log(TourPlan?.data)

    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: TourPlan?.data?.mpo_name?.id }, {
        skip: !company_id || !TourPlan?.data?.mpo_name?.id
    });

    const dayStatus = useGetAllDayStatusQuery();

    const DayStatus = useMemo(() => {
        if (dayStatus?.data) {
            return dayStatus?.data.map(key => ({ id: key.id, title: key.day_status }))
        }
        return [];
    }, [dayStatus])

    const areas = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map((key) => ({ id: key.id, title: key.area_name + " " + `( ${key.station_type})` }));
        }
        return [];
    }, [MpoArea]);

    //! Get visited Area
    const VisitedArea = useGetAllVisitedWithAreaQuery(company_user_role_id)

    const visitedAreas = useMemo(() => {
        if (VisitedArea?.data) {
            return VisitedArea?.data.map((key => ({
                id: key.id, title: key.area_name + " " + `( ${key.station_type})`
            })))
        }
    })

    const [multipleVisitedArea, setMultipleVisitedArea] = useState([])
    const handleMultipleVisitedArea = (e, value) => {
        setMultipleVisitedArea(value);
    }

    const [initialFValues, setInitialFValues] = useState({
        mpo_name: "",
        area_name: [],
        shift: "",
        select_the_date_id: "",
        purpose_of_visit: "",
        is_dcr_added: "",
        select_the_month: "",
        is_approved: "",
        hulting_station: "",
        day_status: ""
    });

    const [MpoTpArea, setMpoTpArea] = useState([]);

    const handleMpoTpArea = (event, value) => {
        setMpoTpArea(value);
    };

    useEffect(() => {
        if (TourPlan?.data) {
            const selectedAreas = TourPlan?.data?.mpo_area_read?.map(area => ({
                id: area?.id,
                title: area?.area_name,
            }));

            setInitialFValues(prevValues => ({
                ...prevValues,
                mpo_name: TourPlan?.data?.mpo_name?.id,
                shift: TourPlan?.data?.tour_plan?.shift?.id,
                select_the_date_id: TourPlan?.data?.tour_plan?.tour_plan?.select_the_date_id,
                purpose_of_visit: TourPlan?.data?.tour_plan?.tour_plan?.purpose_of_visit,
                select_the_month: TourPlan?.data?.tour_plan?.tour_plan?.select_the_month,
                is_dcr_added: TourPlan?.data?.tour_plan?.tour_plan?.is_dcr_added,
                is_approved: TourPlan?.data?.is_approved,
                hulting_station: TourPlan?.data?.tour_plan?.tour_plan?.hulting_station,
                day_status: TourPlan?.data?.tour_plan?.tour_plan?.day_status,
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

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [updateTourPlans] = useUpdateTourPlansMutation();
    const history = useNavigate();

    const monthData = getNepaliMonthName(moment(dateData).month() + 1);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = {
            mpo_area: MpoTpArea.map(area => ({ company_mpo_area_id: area.id })),
            shift: values.shift,
            purpose_of_visit: values.purpose_of_visit,
            is_dcr_added: values.is_dcr_added,
            is_approved: values.is_approved ? values.is_approved : false,
            hulting_station: values.hulting_station,
            day_status: values.day_status,
            select_the_month: getNepaliMonthName(moment(values.select_the_date_id).month() + 1),
            select_the_date: typeof values.select_the_date_id === "string" ? values.select_the_date_id : DateToString(values.select_the_date_id),
            id: idharu,
            company_name: company_id,
            mpo_name: values.mpo_name,
            approved_by: TourPlan?.data?.approved_by?.id ? TourPlan?.data?.approved_by?.id : company_user_role_id
        };
        try {
            const response = await updateTourPlans({ id: idharu, value: data }).unwrap();

            if (response) {
                // setSuccessMessage({ show: true, message: 'Successfully Edited TourPlan' });
                // setTimeout(() => {
                //     // history("/dashboard/admin/tourplan");
                //     setSuccessMessage({ show: false, message: '' });
                //     onClose();
                // }, 2000);
                toast.success('Successfully Edited TourPlan')
                onClose();
            } else if (response?.error) {
                // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                // setLoading(false);
                // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                toast.error(`${response?.error?.message}`)
                setLoading(false);
            } else {
                // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                // setTimeout(() => {
                //     setErrorMessage({ show: false, message: '' });
                // }, 2000);
                toast.error(`Some Error Occurred. Try again later`)
            }
        } catch (error) {
            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 2000);
            toast.error(`Some Error Occurred. Try again later`)

        } finally {
            setLoading(false)
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
                            <Typography variant="h6">Edit MPO TourPlan</Typography>
                        </Typography>
                    </Box>
                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box>
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
                                <Box>
                                    <label htmlFor="date" style={{ fontSize: '14px', color: "black", fontWeight: '600', marginBottom: "5px" }}>Select the Date*</label><br />
                                    <NepaliDatePicker
                                        value={dateData}
                                        format="YYYY-MM-DD"
                                        onChange={(value) => setDateData(value)} />
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
                            {/* <Grid item xs={12}>
                                <Box marginBottom={2}>
                                    <Autocomplete
                                        value={multipleVisitedArea}
                                        multiple
                                        options={visitedAreas}
                                        getOptionLabel={(option) => option.title}
                                        onChange={handleMultipleVisitedArea}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select the Visited Area*" />
                                        )}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                {option.title}
                                            </li>
                                        )}
                                    />
                                </Box>
                            </Grid> */}
                        </Grid>
                        <Box marginBottom={2}>
                            {/* <Controls.Input
                                name="purpose_of_visit"
                                label="Day Status"
                                value={values.purpose_of_visit}
                                onChange={handleInputChange}
                                placeholdertext="Day Status"
                            /> */}
                            <Controls.Select
                                name={`purpose_of_visit`}
                                label="Day Status"
                                value={values?.purpose_of_visit}
                                // onChange={(event) => {
                                //     handleFormChange('purpose_of_visit', event.target.value, false);
                                // }}
                                onChange={handleInputChange}
                                options={DayStatus}
                            // error={errors.purpose_of_visit}

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
                                        placeholdertext="Hulting Station"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Box marginBottom={2}>
                            {
                                (user_role === "admin" || higherCondition === "/dashboard/admin/executives/tp") &&
                                <Controls.Checkbox
                                    name="is_approved"
                                    value={values.is_approved}
                                    onChange={handleInputChange}
                                    label="Is Approved"
                                    type="checkbox"
                                />
                            }
                        </Box>
                        <Stack spacing={1} direction="row">
                            <Button
                                variant="contained"
                                className="summit-button"
                                onClick={(e) => handleSubmit(e)}
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
            {loading && (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1000 }}>
                    <CircularProgress />
                </Grid>
            )}
        </>
    );
}

export default EditTourPlan;
