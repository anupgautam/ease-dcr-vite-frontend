import { Close } from "@mui/icons-material";
import { Box, Button, Drawer, Grid, IconButton, Stack, Typography } from "@mui/material";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Iconify from "@/components/iconify/Iconify";
import {
    NepaliDateConverter,
} from "react-nepali-date-picker-lite";
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { useGetMpoAreaQuery } from "@/api/MPOSlices/TourPlanSlice";
import Cookies from "js-cookie";
import Controls from "@/reusable/forms/controls/Controls";
import { useForm } from '../../../reusable/forms/useForm'
import { useAddHigherTourPlanMutation, useAddTourplanMutation } from "@/api/MPOSlices/tourPlan&Dcr";
import { getNepaliMonthName } from "@/reusable/utils/reuseableMonth";
import moment from "moment";
import { useGetUsersByCompanyRoleIdExecutativeLevelQuery } from "@/api/MPOSlices/UserSlice";

const AddUnplannedTp = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = useCallback(() => {
        setIsDrawerOpen(!isDrawerOpen);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    let today;
    // const today = NepaliDateConverter.getNepaliDate();

    const [selectedDates, setSelectedDates] = useState(today);

    const mpoAccordingToExecutiveLevel = useGetUsersByCompanyRoleIdExecutativeLevelQuery({ id: Cookies.get('company_id'), page: Cookies.get('company_user_id') })

    const executiveLevelOptions = useMemo(() => {
        if (mpoAccordingToExecutiveLevel !== undefined) {
            if (mpoAccordingToExecutiveLevel.status === 'fulfilled') {
                return mpoAccordingToExecutiveLevel.data.map(key => ({ id: key.id, title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name })
                )
            }
        }
        return [];
    }, [mpoAccordingToExecutiveLevel])


    const MpoArea = useGetMpoAreaQuery({ company_name: Cookies.get('company_id'), mpo_name: Cookies.get('company_user_id') });

    const mpoAreaData = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])

    const initialFValues = {}

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true)

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });
    const [MpoAreaData, setMpoAreaData] = useState([]);

    const [AddTourPlan] = useAddTourplanMutation();
    const [AddHigherOrder] = useAddHigherTourPlanMutation();

    const addTourPlan = () => {
        if (Cookies.get('user_role') === 'MPO') {
            const data = [{
                company_name: Cookies.get('company_id'),
                mpo_name: Cookies.get('company_user_id'),
                mpo_area: [{ company_mpo_area_id: values.select_the_area }],
                tour_plan: {
                    shift: { shift: 1 },
                    tour_plan: {
                        select_the_month: getNepaliMonthName(moment(selectedDates).month() + 1),
                        select_the_date_id: selectedDates,
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
                    if (res.data) {
                        setIsDrawerOpen(false)
                        setSuccessMessage({ show: true, message: 'Successfully Added Unplanned Tourplan.' });
                        setTimeout(() => {
                            setSuccessMessage({ show: false, message: '' });
                        }, 3000);
                    } else {
                        setErrorMessage({ show: true, message: response.error.data[0] });
                        setTimeout(() => {
                            setErrorMessage({ show: false, message: '' });
                        }, 3000);
                    }
                })
                .catch(err => {
                    setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 3000);
                });
        } else {
            const data = {
                company_id: Cookies.get('company_id'),
                user_id: Cookies.get('company_user_id'),
                dates: [selectedDates],
                shift: 1,
                visit_data: MpoAreaData,
                hulting_station: values.hulting_station,
                is_admin_opened: false,
                is_unplanned: true,
                is_approved: true,
            }
            AddHigherOrder(data)
                .then((res) => {
                    if (res.data) {
                        setIsDrawerOpen(false)
                        setSuccessMessage({ show: true, message: 'Successfully Added Unplanned Tourplan.' });
                        setTimeout(() => {
                            setSuccessMessage({ show: false, message: '' });
                        }, 3000);
                    } else if (res.error.status === '400') {
                        setErrorMessage({ show: true, message: res.error.data[0] });
                        setTimeout(() => {
                            setErrorMessage({ show: false, message: '' });
                        }, 3000);
                    }
                })
                .catch(err => {
                    setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 3000);
                });
        }
    }


    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={toggleDrawer} >
                Add Unplanned TP
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
                            Add Unplanned Tourplan
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
                                Cookies.get('user_role') === "MPO" ?
                                    <>
                                        <Box marginBottom={2}>
                                            <Controls.Select
                                                name={`select_the_area`}
                                                label="Select the Area*"
                                                value={values.select_the_area}
                                                onChange={handleInputChange}
                                                options={mpoAreaData}
                                            />
                                        </Box>

                                        <Box marginBottom={2}>
                                            <Controls.Input
                                                name={`purpose_of_visit`}
                                                label="Remark"
                                                value={values.purpose_of_visit}
                                                onChange={handleInputChange}
                                            />
                                        </Box>
                                        <Box marginBottom={2}>
                                            <Controls.Input
                                                name={`hulting_station`}
                                                label="Hulting Station"
                                                value={values.hulting_station}
                                                onChange={handleInputChange}
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
                                            />
                                        </Box>
                                        {
                                            values.visited_with &&
                                            <Box marginBottom={2}>
                                                <MpoUserWiseArea id={values.visited_with} setMpoAreaData={setMpoAreaData} MpoAreaData={MpoAreaData} />
                                            </Box>
                                        }
                                        <Box marginBottom={2}>
                                            <Controls.Input
                                                name={`hulting_station`}
                                                label="Hulting Station"
                                                value={values.hulting_station || ""}
                                                onChange={handleInputChange}
                                            />
                                        </Box>
                                    </>
                            }

                            <Stack spacing={1} direction="row">
                                <Button
                                    variant="contained"
                                    className="summit-button"
                                    onClick={addTourPlan}
                                >
                                    Add TP{" "}
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
                    </Box>
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

const MpoUserWiseArea = ({ id, setMpoAreaData }) => {
    const [visitData, setVisitData] = useState([]);

    const MpoArea = useGetMpoAreaQuery({ company_name: Cookies.get('company_id'), mpo_name: Cookies.get('role') === 'other' ? '' : id });

    const mpoAreaData = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])


    const handleInputChange = (event) => {
        const selectedAreaId = event.target.value;
        const newVisitData = [{ visited_with: id, area: selectedAreaId }];
        setMpoAreaData(newVisitData);
        setVisitData(selectedAreaId);
    }

    return (
        <Box marginBottom={2}>
            <Controls.Select
                name={`select_the_area`}
                label="Select the Area*"
                value={visitData}
                onChange={handleInputChange}
                options={mpoAreaData}
            />
        </Box>
    )
}


export default React.memo(AddUnplannedTp);