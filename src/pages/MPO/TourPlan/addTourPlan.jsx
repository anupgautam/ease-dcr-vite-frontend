import React, { useState, useMemo, useEffect } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    Autocomplete,
    TextField,
    CircularProgress,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';
import { useForm } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { useGetShiftsQuery } from '@/api/DCRs Api Slice/TourPlanApiSlice';
import {
    NepaliDateConverter,
} from "react-nepali-date-picker-lite";
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { useGetMpoAreaQuery, usePostUserIdToGetMpoAreaMutation } from '@/api/MPOSlices/TourPlanSlice';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { useAddHigherTourPlanMutation, useAddTourplanMutation, useGetAllVisitedWithAreaQuery } from '@/api/MPOSlices/tourPlan&Dcr';
import { usePostUserIdToGetLowerLevelExecutiveMutation } from '@/api/MPOSlices/UserSlice';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
    useDeleteTourPlansByIdMutation,
} from '@/api/MPOSlices/TourPlanSlice';
import { returnValidation } from "../../../validation";
import { useGetAllDayStatusQuery } from "../../../api/MPOSlices/UserSlice";

const AddTourPlan = () => {
    const { company_id, user_role, company_user_id, company_user_role_id, role } = useSelector((state) => state.cookie);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [TpResponseData, setTpResponseData] = useState([]);


    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    }

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setTpResponseData([]);
    }

    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: company_user_role_id },
        {
            skip: !company_id || !company_user_role_id
        }
    )

    const mpoAreaData = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])

    //! Get visited Area
    const VisitedArea = useGetAllVisitedWithAreaQuery(company_user_role_id)

    const visitedAreas = useMemo(() => {
        if (VisitedArea?.data) {
            return VisitedArea?.data.map((key => ({
                id: key.id, title: key.area_name + " " + `( ${key.station_type})`
            })))
        }
        return [];
    })

    const dayStatus = useGetAllDayStatusQuery();

    const DayStatus = useMemo(() => {
        if (dayStatus?.data) {
            return dayStatus?.data.map(key => ({ id: key.id, title: key.day_status }))
        }
        return [];
    }, [dayStatus])

    const { data: ShiftData } = useGetShiftsQuery();

    const shiftAllData = useMemo(() => {
        if (ShiftData) {
            return ShiftData?.map((key) => ({ id: key.id, title: key.shift }))
        }
        return []
    }, [ShiftData])

    const [LowerExecutive] = usePostUserIdToGetLowerLevelExecutiveMutation()

    const [executiveLevelOptions, setExecutiveLevelOptions] = useState([]);

    useEffect(() => {
        if (company_user_id) {
            LowerExecutive({ id: company_user_id })
                .then((res) => {
                    if (res.data) {
                        const data = res?.data.map(key => ({ id: key.id, title: key?.user_name?.first_name + " " + key?.user_name?.middle_name + " " + key?.user_name?.last_name }));
                        setExecutiveLevelOptions(data);
                    }
                })
        }
    }, [company_user_id])


    const today = NepaliDateConverter.getNepaliDate();

    const [TourPlanTodos, setTourPlanTodos] = useState([]);
    const [formValuesArray, setFormValuesArray] = useState([]);
    const [selectedDates, setSelectedDates] = useState(today);

    const initialStates = () => {
        setSelectedDates(today);
        setSelectedAreas([])
        setSelectedExecutiveOptions([])
    }
    const [CompanyRoles, setCompanyRoles] = useState([]);

    const handleRolesChange = (event) => {
        const {
            target: { value },
        } = event;
        setCompanyRoles(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    // const handleRolesChange = (e, value) => {
    //     setCompanyRoles(value?.id)
    // }
    //! States
    const [MpoTpArea, setMpoTpArea] = useState([]);
    const [TPAreaName, setTPAreaName] = useState([])

    //! Display value
    const [selectedAreas, setSelectedAreas] = useState(
        MpoTpArea.map((id) => mpoAreaData.find((option) => option.id === id) || {})
    )

    //! On Chnage
    const handleMpoTpArea = (event, value) => {
        const mpotparea = value.map(option => option.id)
        const mpotpareavalue = value.map(option => option.title)
        setMpoTpArea(mpotparea)
        setTPAreaName(mpotpareavalue)
        setSelectedAreas(value)
    }
    //! Filter Options
    const filteredOptions = mpoAreaData.filter(
        (option) => !selectedAreas.some((selected) => selected.id === option.id)
    );

    //! States Executive
    const [visitedWithWala, setVisitedWithWala] = useState([])

    //! Display value
    const [selectedExecutiveOptions, setSelectedExecutiveOptions] = useState(
        visitedWithWala.map((id) => executiveLevelOptions.find((option) => option.id === id) || {})
    )

    //! on Change Executive wala
    const handleVisitedWith = (e, value) => {
        const visitedWith = value.map(option => option.id)
        setVisitedWithWala(visitedWith)
        setSelectedExecutiveOptions(value)
        setCompanyRoles(visitedWith)
    }

    //! Filter option executive
    const filteredExecutiveOptions = executiveLevelOptions.filter(
        (option) => !selectedExecutiveOptions.some((selected) => selected.id === option.id)
    )

    const [multipleVisitedArea, setMultipleVisitedArea] = useState([])
    const handleMultipleVisitedArea = (e, value) => {
        setMultipleVisitedArea(value);
    }

    const [MpoAreaData, setMpoAreaData] = useState([]);
    const [visitedWithData, setVisitedWithData] = useState([]);
    useEffect(() => {
        if (CompanyRoles) {
            const data = CompanyRoles?.map((key) => {
                return {
                    visit_with: key
                }
            })
            setMpoAreaData(data);
        }
    }, [CompanyRoles])

    //! Validation wala  
    const validate = user_role === "MPO" ?
        (fieldValues = values) => {
            // 
            let temp = { ...errors }
            if ('purpose_of_visit' in fieldValues)
                temp.purpose_of_visit = returnValidation(['null'], values.purpose_of_visit)

            // temp.hulting_station = returnValidation(['null', 'lessThan50', 'validateUsername', 'minLength2'], values.hulting_station)

            setErrors({
                ...temp
            })
            // 

            if (fieldValues === values)
                return Object.values(temp).every(x => x == "")
        }
        : (fieldValues = values) => {
            // 
            let temp = { ...errors }
            if ('day_status' in fieldValues)
                temp.day_status = returnValidation(['null'], values.day_status)

            // temp.hulting_station = returnValidation(['null', 'lessThan50', 'validateUsername', 'minLength2'], values.hulting_station)

            setErrors({
                ...temp
            })
            // 

            if (fieldValues === values)
                return Object.values(temp).every(x => x == "")
        }

    //! Add MPO TP
    const addTodo = () => {
        setLoading(true);
        const newTodo = {
            selected_date: selectedDates,
            purpose_of_visit: formValuesArray?.purpose_of_visit || "",
            hulting_station: formValuesArray?.hulting_station || "",
        };

        // setTourPlanTodos(prevTodos => [...prevTodos, newTodo]);
        // setTourPlanTodos(newTodo);

        setFormValuesArray({
            select_the_area: "",
            purpose_of_visit: "",
            hulting_station: "",
            mpo_area: [],
        });

        setMpoTpArea([]);

        let new_data = [newTodo].map((tour) => ({
            company_name: company_id,
            mpo_name: company_user_role_id,
            mpo_area: newData,
            tour_plan: {
                shift: { shift: 1 },
                tour_plan: {
                    select_the_month: getNepaliMonthName(moment(tour?.selected_date).month() + 1),
                    select_the_date_id: tour?.selected_date,
                    year: moment(tour.selected_date).year(),
                    purpose_of_visit: tour?.purpose_of_visit,
                    hulting_station: tour?.hulting_station,
                    is_dcr_added: false,
                    is_unplanned: false,
                    is_admin_opened: false,
                    is_doctor_dcr_added: false,
                    is_chemist_dcr_added: false,
                    is_stockist_dcr_added: false,
                },
            },
            approved_by: null,
            is_approved: false,
        }));


        AddTourPlan(new_data)
            .then(res => {
                if (res.data) {
                    toast.success(`Successfully Added Tourplan.`)
                    const updatedData = res.data.data.map((item, index) => ({
                        ...item,
                        mpo_area_name: TPAreaName[index]
                    }));

                    setTpResponseData(prevData => [...prevData, ...updatedData]);
                    initialStates()
                } else {
                    toast.error(`${res?.error?.data?.message}`)
                    setLoading(false);

                }
            })
            .catch(err => {
                toast.error(`Some Error Occurred. Try again later.`)
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const [deleteTourPlan] = useDeleteTourPlansByIdMutation()

    const deleteTourPlans = (dataToDelete) => {
        deleteTourPlan(dataToDelete)
            .then((res) => {

                setTpResponseData((prevTourPlans) =>
                    prevTourPlans.filter((tour) => tour.id !== dataToDelete)
                );
            })
            .catch((error) => {
                toast.error('Failed to delete tour plan')
            });
    };

    const handleFormChange = (fieldName, value) => {
        setFormValuesArray(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    }

    const [initialFValues, setInitialFValues] = useState({
        shift: "",
        visit_data: MpoAreaData,
        hulting_station: "",
        user_id: company_user_role_id,
        purpose_of_visit: "",
        day_status: ""
    })

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
        formValuesArray.purpose_of_visit,
        values.purpose_of_visit,
        values.day_status
    ])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);
        setIsButtonDisabled(!valid);
    }, [values]);

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const [AddTourPlan] = useAddTourplanMutation();
    const [AddHigherOrder] = useAddHigherTourPlanMutation();

    const newData = useMemo(() => {
        if (MpoTpArea.length !== 0) {
            return MpoTpArea.map((key) => ({ company_mpo_area_id: key }))
        }
        return [];
    }, [MpoTpArea])

    //! Others TP
    const handleSave = () => {
        setLoading(true)
        const data = {
            date: selectedDates,
            shift: 1,
            visited_data: multipleVisitedArea.map(key => ({ visited_area: key.id })),
            hulting_station: values.hulting_station,
            day_status: values.day_status,
            is_admin_opened: false,
            user_id: company_user_role_id,
            company_id: company_id,
            month: getNepaliMonthName(moment(selectedDates).month() + 1),
            year: moment(selectedDates).year(),
            is_dcr_added: false,
            is_unplanned: false,
        }
        AddHigherOrder(data)
            .then(res => {
                if (res.data) {
                    initialStates()
                    setIsDrawerOpen(false)
                    // setSuccessMessage({ show: true, message: 'Successfully Added Tourplan.' });
                    // setTimeout(() => {
                    //     setSuccessMessage({ show: false, message: '' });
                    // }, 5000);
                    toast.success(`${res?.data?.message}`)
                    setInitialFValues({
                        shift: "",
                        visit_data: MpoAreaData,
                        hulting_station: "",
                        user_id: company_user_role_id,
                        day_status: ""
                    })
                }
                else {
                    // setErrorMessage({ show: true, message: extractErrorMessage({ data: res?.error }) });
                    // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                    toast.error(`${res?.error?.data?.message}`)
                    setLoading(false);
                }
            })
            .catch(err => {
                initialStates()
                // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                // setTimeout(() => {
                //     setErrorMessage({ show: false, message: '' });
                // }, 5000);
                toast.error(`Some Error Occurred. Try again later.`)
                toggleDrawer()
            })
            .finally(() => {
                setLoading(false)
            })
    }


    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={toggleDrawer}>
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
                            Add {user_role} Tourplan
                        </Typography>

                    </Box>
                    {/*//! Selected TP Dates MPO Multiples  */}
                    {
                        TpResponseData.length !== 0 ?
                            <Box style={{ marginBottom: '20px' }}>

                                <Box style={{ width: "100%", overflowX: "auto", whiteSpace: 'nowrap' }}>
                                    {
                                        TpResponseData.map((key, index) => (
                                            <Box style={{ width: '178px', display: "inline-block", marginRight: "10px" }} key={index}>
                                                <Box style={{ borderRadius: '5px', border: '1.2px solid #dbe0e4', padding: "5px", paddingTop: "10px", paddingLeft: "10px", paddingRight: '10px' }}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={4.3}>
                                                            <IconButton
                                                                className="close-button"
                                                                onClick={() => deleteTourPlans(key.id)}
                                                                style={{ color: "red" }}
                                                            >
                                                                <Close color='red' />
                                                            </IconButton>
                                                            <Box style={{ padding: '5px', textAlign: 'center', border: '1.2px solid #2d8960', borderRadius: "5px" }}>
                                                                <Typography style={{ fontSize: "16px", color: 'black', fontWeight: '600' }}>{moment(key.tour_plan.tour_plan.select_the_date_id).format('DD')}</Typography>
                                                                {/* <Typography style={{ fontSize: '13px', color: "black", marginTop: "-5px" }}>{getNepaliMonthName(moment(key.selected_date).month() + 1).substring(0, 3)}</Typography> */}
                                                            </Box>
                                                        </Grid>
                                                        <Grid item xs={7.7}>
                                                            <Box>
                                                                <span style={{ backgroundColor: "#2d8960", padding: "4px", fontSize: "12px", color: "white", borderRadius: '15px', fontWeight: '600', paddingLeft: "10px", paddingRight: "10px" }}>
                                                                    {key.tour_plan.tour_plan.select_the_month}
                                                                </span>
                                                                {/* <Typography style={{ marginTop: '10px', color: 'black', width: "60px", overflow: 'hidden', fontSize: "12px", color: 'black', fontWeight: "600", textOverflow: "ellipsis", whiteSpace: 'nowrap' }}>{key.select_the_area.title}</Typography> */}
                                                                {/* {TPAreaName.map((key, index) => (
                                                                    <Typography key={index} variant="body2" style={{ fontSize: "12px", fontWeight: "600" }}>
                                                                        {key}
                                                                    </Typography>
                                                                ))} */}
                                                                <Typography key={index} variant="body2" style={{ fontSize: "12px", fontWeight: "600", marginTop: '4px' }}>
                                                                    {key.mpo_area_name}
                                                                </Typography>
                                                                <IconButton color={'success'} >
                                                                    <Iconify icon="mdi:tick-circle" />
                                                                </IconButton>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Box>
                                        ))
                                    }
                                </Box>
                            </Box>
                            : null
                    }
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
                    {/*//! MPO Wala Fields  */}
                    {
                        user_role === "MPO" ?
                            <>
                                <Box>
                                    <Box marginBottom={2}>
                                        <Autocomplete
                                            multiple
                                            options={filteredOptions}
                                            value={selectedAreas}
                                            // options={mpoAreaData}
                                            // value={MpoTpArea.map(id => mpoAreaData.find(option => option.id === id) || {})}
                                            getOptionLabel={(option) => option.title}
                                            onChange={handleMpoTpArea}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Select the Areas" />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.id}>
                                                    {option.title}
                                                </li>
                                            )}
                                        />
                                    </Box>
                                    <Box marginBottom={2}>
                                        <Controls.Select
                                            name={`purpose_of_visit`}
                                            label="Day Status"
                                            value={formValuesArray?.purpose_of_visit}
                                            onChange={(event) => {
                                                handleFormChange('purpose_of_visit', event.target.value, false);
                                            }}
                                            options={DayStatus}
                                        // error={errors.purpose_of_visit}

                                        />
                                        {/* <Box marginBottom={2}>
                                            <Controls.Select
                                                name={`day_status`}
                                                label="Day Status"
                                                value={values.day_status || ""}
                                                onChange={handleInputChange}
                                                options={DayStatus}
                                            />
                                        </Box> */}
                                    </Box>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name={`hulting_station`}
                                            label="Hulting Station"
                                            value={formValuesArray?.hulting_station}
                                            onChange={(event) => {
                                                handleFormChange('hulting_station', event.target.value, false);
                                            }}
                                            error={errors.hulting_station}
                                        />
                                    </Box>
                                </Box>
                            </> :
                            <Box>
                                <Box marginBottom={2}>
                                    <Autocomplete
                                        multiple
                                        options={filteredExecutiveOptions}
                                        value={selectedExecutiveOptions}
                                        getOptionLabel={(option) => option.title}
                                        onChange={handleVisitedWith}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select the Visited With*" />
                                        )}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                {option.title}
                                            </li>
                                        )}
                                    />
                                </Box>
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
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name={`day_status`}
                                        label="Day Status"
                                        value={values.day_status}
                                        onChange={handleInputChange}
                                        options={DayStatus}
                                        error={errors.day_status}
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
                            </Box>
                    }
                    <Stack spacing={1} direction="row">
                        <Button
                            variant="contained"
                            className="summit-button"
                            // disabled={isButtonDisabled}
                            onClick={user_role === 'MPO' ? addTodo : handleSave}
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
                <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1500 }}>
                    <CircularProgress />
                </Grid>
            )}

        </>
    )
}
export default React.memo(AddTourPlan);