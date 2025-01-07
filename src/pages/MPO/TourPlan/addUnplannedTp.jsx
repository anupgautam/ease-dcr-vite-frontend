import { Close } from "@mui/icons-material";
import { Box, Button, Drawer, Grid, IconButton, Stack, Typography, CircularProgress } from "@mui/material";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Iconify from "@/components/iconify/Iconify";
import {
    NepaliDateConverter,
} from "react-nepali-date-picker-lite";
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { useGetMpoAreaQuery, usePostUserIdToGetMpoAreaMutation } from "@/api/MPOSlices/TourPlanSlice";
import Controls from "@/reusable/forms/controls/Controls";
import { useForm } from '../../../reusable/forms/useForm'
import { useAddHigherTourPlanMutation, useAddTourplanMutation } from "@/api/MPOSlices/tourPlan&Dcr";
import { getNepaliMonthName } from "@/reusable/utils/reuseableMonth";
import moment from "moment";
import { useGetUsersByCompanyRoleIdExecutativeLevelQuery, usePostUserIdToGetLowerLevelExecutiveMutation } from "@/api/MPOSlices/UserSlice";
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { toast } from 'react-toastify';
import { returnValidation } from "../../../validation";
import { useGetAllDayStatusQuery } from "../../../api/MPOSlices/UserSlice";

const AddUnplannedTp = () => {
    const { company_id, user_role, company_user_role_id, role } = useSelector((state) => state.cookie);
    const today = NepaliDateConverter.getNepaliDate();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    }

    // const today = NepaliDateConverter.getNepaliDate();

    const [selectedDates, setSelectedDates] = useState(today);

    const dayStatus = useGetAllDayStatusQuery();
    // console.log(dayStatus?.data)

    const DayStatus = useMemo(() => {
        if (dayStatus?.data) {
            return dayStatus?.data.map(key => ({ id: key.id, title: key.day_status }))
        }
        return [];
    }, [dayStatus])

    const mpoAccordingToExecutiveLevel = usePostUserIdToGetLowerLevelExecutiveMutation(company_user_role_id,
        {
            skip: !company_user_role_id
        }
    )
    const [LowerExecutive] = usePostUserIdToGetLowerLevelExecutiveMutation()

    const [executiveLevelOptions, setExecutiveLevelOptions] = useState([]);

    useEffect(() => {
        if (company_user_role_id) {
            LowerExecutive({ id: company_user_role_id })
                .then((res) => {
                    if (res.data) {
                        const data = res.data.map(key => ({ id: key.id, title: key?.user_name?.first_name + " " + key?.user_name?.middle_name + " " + key?.user_name?.last_name }));
                        setExecutiveLevelOptions(data);
                    }
                })
        }
    }, [company_user_role_id])

    console.log(executiveLevelOptions)


    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: company_user_role_id }, {
        skip: !company_id || !company_user_role_id
    });


    const mpoAreaData = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])

    const validate = (fieldValues = values) => {
        let temp = { ...errors };

        if (user_role.toString() === "MPO") {
            if ("purpose_of_visit" in fieldValues) {
                temp.purpose_of_visit = returnValidation(["null"], values.purpose_of_visit);
            }
            if ("select_the_area" in fieldValues) {
                temp.select_the_area = returnValidation(["null"], values.select_the_area);
            }
        } else {
            if ("visited_with" in fieldValues) {
                temp.visited_with = returnValidation(["null"], values.visited_with);
            }
        }

        setErrors({
            ...temp,
        });

        if (fieldValues === values) {
            return Object.values(temp).every((x) => x === "");
        }
    };

    // const initialFValues = {
    //     purpose_of_visit: user_role.toString() === "MPO" ? "" : undefined,
    //     select_the_area: user_role.toString() === "MPO" ? "" : undefined,
    //     visited_with: user_role.toString() === "MPO" ? undefined : "",
    // };

    const initialFValues = {
        purpose_of_visit: "",
        select_the_area: "",
        visited_with: ""
    };

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
    }, [
        values.purpose_of_visit,
        values.select_the_area,
        values.visited_with
    ])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);
        setIsButtonDisabled(!valid);
    }, [values]);

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });
    const [MpoAreaData, setMpoAreaData] = useState([]);

    const [AddTourPlan] = useAddTourplanMutation();
    const [AddHigherOrder] = useAddHigherTourPlanMutation();

    const initialStates = () => {
        setSelectedDates(today);
    }
    const addTourPlan = () => {
        setLoading(true)
        if (selectedDates === today) {
            if (user_role === 'MPO') {
                const data = [{
                    company_name: company_id,
                    mpo_name: company_user_role_id,
                    mpo_area: [{ company_mpo_area_id: values.select_the_area }],
                    tour_plan: {
                        shift: { shift: 1 },
                        tour_plan: {
                            select_the_month: getNepaliMonthName(moment(selectedDates).month() + 1),
                            select_the_date_id: selectedDates,
                            year: moment(selectedDates).year(),
                            purpose_of_visit: values.purpose_of_visit,
                            hulting_station: values.hulting_station,
                            is_dcr_added: false,
                            is_unplanned: true,
                            is_admin_opened: false,
                            is_doctor_dcr_added: false,
                            is_chemist_dcr_added: false,
                            is_stockist_dcr_added: false
                        },
                        approved_by: null,
                        is_approved: true,
                    }
                }
                ]
                AddTourPlan(data)
                    .then(res => {
                        if (res?.data) {
                            // setSuccessMessage({ show: true, message: 'Successfully Added Unplanned Tourplan.' });
                            // setTimeout(() => {
                            //     setSuccessMessage({ show: false, message: '' });
                            //     setIsDrawerOpen(false)
                            // }, 5000);
                            toast.success('Successfully Added Unplanned Tourplan')
                            setIsDrawerOpen(false)
                        }
                        else if (response?.error) {
                            // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                            // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                            toast.error(`${response?.error?.data?.message}`)
                            setLoading(false);
                        } else {
                            // setErrorMessage({ show: true, message: response.error.data[0] });
                            // setTimeout(() => {
                            //     setErrorMessage({ show: false, message: '' });
                            // }, 5000);
                            toast.error(`${response?.error.data[0]}`)

                        }
                    })
                    .catch(err => {
                        // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                        // setTimeout(() => {
                        //     setErrorMessage({ show: false, message: '' });
                        // }, 5000);
                        toast.error(`Some Error Occurred. Try again later.`)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            } else {
                const data = {
                    company_id: company_id,
                    user_id: company_user_role_id,
                    dates: selectedDates,
                    shift: 1,
                    visit_data: [{ visited_with: values.visited_with }],
                    hulting_station: values.hulting_station,
                    is_admin_opened: false,
                    is_unplanned: true,
                    is_approved: true,
                    is_dcr_added: false,
                    month: getNepaliMonthName(moment(selectedDates).month() + 1),
                    year: moment(selectedDates).year(),
                }
                AddHigherOrder(data)
                    .then((res) => {
                        if (res.data) {
                            // setSuccessMessage({ show: true, message: 'Successfully Added Unplanned Tourplan.' });
                            // setTimeout(() => {
                            //     setSuccessMessage({ show: false, message: '' });
                            //     setIsDrawerOpen(false)
                            // }, 4000);
                            toast.success('Successfully Added Unplanned TourPlan')
                            setIsDrawerOpen(false)
                            initialStates()
                            resetForm()
                        } else if (res.error.status === '400') {
                            setLoading(false)
                            // setErrorMessage({ show: true, message: res.error.data[0] });
                            // initialStates()
                            // setTimeout(() => {
                            //     setErrorMessage({ show: false, message: '' });
                            // }, 5000);
                            toast.error(`${res?.error?.data[0]}`)
                            initialStates()
                        }
                    })
                    .catch(err => {
                        setLoading(false)
                        initialStates()
                        // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                        // setTimeout(() => {
                        //     setErrorMessage({ show: false, message: '' });
                        // }, 5000);
                        toast.error('Some Error Occured. Try again later.')
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
        } else {
            setLoading(false);
            initialStates()
            // setErrorMessage({ show: true, message: 'Unplanned tourplan can be create in today dates only.' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            //     setIsDrawerOpen(false)
            // }, 5000);
            toast.error('Unplanned tourplan can be create in today dates only.')
            setIsDrawerOpen(false)
        }
    }


    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={toggleDrawer} className=" text-[13px]" >
                Add Unplanned TP {user_role}
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
                            Add Unplanned Tourplan {user_role}
                        </Typography>
                        <Box style={{ marginTop: '20px', textAlign: "left" }}>
                            <Box marginBottom={2}>
                                <label htmlFor="date" style={{ fontSize: '17px', color: "black", fontWeight: '600', marginBottom: "15px" }}>Select Date*</label><br />
                                {/* <NepaliDatePicker
                                    value={selectedDates}
                                    onSelect={setSelectedDates}
                                    renderInput={(props) => <input className='input-datepicker-fields1' value={selectedDates} type="text" {...props} />}
                                /> */}
                                <NepaliDatePicker
                                    value={selectedDates}
                                    format="YYYY-MM-DD"
                                    onChange={(value) => setSelectedDates(value)} />
                            </Box>
                            {
                                user_role === "MPO" ?
                                    <>
                                        <Box marginBottom={2}>
                                            <Controls.Select
                                                name={`select_the_area`}
                                                label="Select the Area*"
                                                value={values.select_the_area}
                                                onChange={handleInputChange}
                                                options={mpoAreaData}
                                                error={errors.select_the_area}
                                            />
                                        </Box>

                                        <Box marginBottom={2}>
                                            <Controls.Select
                                                name={`purpose_of_visit`}
                                                label="Day Status"
                                                value={values.purpose_of_visit}
                                                onChange={handleInputChange}
                                                options={DayStatus}
                                                error={errors.purpose_of_visit}
                                            />
                                        </Box>
                                        <Box marginBottom={2}>
                                            <Controls.Input
                                                name={`hulting_station`}
                                                label="Hulting Station"
                                                value={values.name}
                                                onChange={handleInputChange}
                                                error={errors.hulting_station}

                                            />
                                        </Box>
                                    </> : <>
                                        <Box marginBottom={2}>
                                            <Controls.Select
                                                name={`visited_with`}
                                                label="Select the Visited With*"
                                                value={values.visited_with}
                                                onChange={handleInputChange}
                                                options={executiveLevelOptions}
                                                error={errors.visited_with}

                                            />
                                        </Box>
                                        {/* {
                                            values.visited_with &&
                                            <Box marginBottom={2}>
                                                <MpoUserWiseArea id={values.visited_with} setMpoAreaData={setMpoAreaData} MpoAreaData={MpoAreaData} />
                                            </Box>
                                        } */}
                                        <Box marginBottom={2}>
                                            <Controls.Input
                                                name={`hulting_station`}
                                                label="Hulting Station"
                                                value={values.name}
                                                onChange={handleInputChange}
                                                error={errors.hulting_station}
                                            />
                                        </Box>
                                    </>
                            }

                            <Stack spacing={1} direction="row">
                                {/* <Button
                                    variant="contained"
                                    className="summit-button"
                                    onClick={addTourPlan}
                                >
                                    Add TP{" "}
                                </Button> */}

                                <Controls.SubmitButton
                                    variant="contained"
                                    className="submit-button"
                                    // disabled={isButtonDisabled}
                                    onClick={addTourPlan}
                                    text="Add TP"
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
                    </Box>
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
    )
}

// const MpoUserWiseArea = ({ id, setMpoAreaData }) => {
//     const { company_id } = useSelector((state) => state.cookie);
//     const [visitData, setVisitData] = useState([]);

//     const [mpoAreaData, setmpoAreaData] = useState([]);
//     const [AllMpoAreaData] = usePostUserIdToGetMpoAreaMutation();

//     useEffect(() => {
//         AllMpoAreaData({ id: id })
//             .then((res) => {
//                 if (res.data) {
//                     const data = res.data.map((key) => ({
//                         id: key.id,
//                         title: key.area_name
//                     }));
//                     setmpoAreaData(data)
//                 }
//             })
//     }, [id])


//     const handleInputChange = (event) => {
//         const selectedAreaId = event.target.value;
//         const newVisitData = [{ visited_with: id, area: selectedAreaId }];
//         setMpoAreaData(newVisitData);
//         setVisitData(selectedAreaId);
//     }

//     return (
//         <Box marginBottom={2}>
//             <Controls.Select
//                 name={`select_the_area`}
//                 label="Select the Area*"
//                 value={visitData}
//                 onChange={handleInputChange}
//                 options={mpoAreaData}
//             />
//         </Box>
//     )
// }


export default React.memo(AddUnplannedTp);