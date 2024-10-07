import React, { useState, useCallback, useMemo, useEffect } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    Autocomplete,
    TextField,
    CircularProgress,
    Badge
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
import { useAddHigherTourPlanMutation, useAddTourplanMutation } from '@/api/MPOSlices/tourPlan&Dcr';
import { usePostUserIdToGetLowerLevelExecutiveMutation } from '@/api/MPOSlices/UserSlice';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';

import moment from 'moment';
import { useSelector } from 'react-redux';
import {
    useDeleteTourPlansByIdMutation,
} from '@/api/MPOSlices/TourPlanSlice';


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
        if (company_user_role_id) {
            LowerExecutive({ id: company_user_role_id })
                .then((res) => {
                    if (res.data) {
                        const data = res.data.map(key => ({ id: key.id, title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name }));
                        setExecutiveLevelOptions(data);
                    }
                })
        }
    }, [company_user_role_id])


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

    const [MpoAreaData, setMpoAreaData] = useState([]);
    const [visitedWithData, setVisitedWithData] = useState([]);



    useEffect(() => {
        if (CompanyRoles) {
            const data = CompanyRoles.map((key) => {
                return {
                    visit_with: key
                }
            })
            setMpoAreaData(data);
        }
    }, [CompanyRoles])

    //! Add MPO TP
    const addTodo = () => {
        setLoading(true);
        const newTodo = {
            selected_date: selectedDates,
            purpose_of_visit: formValuesArray.purpose_of_visit || "",
            hulting_station: formValuesArray.hulting_station || "",
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
                    select_the_month: getNepaliMonthName(moment(tour.selected_date).month() + 1),
                    select_the_date_id: tour.selected_date,
                    year: moment(tour.selected_date).year(),
                    purpose_of_visit: tour.purpose_of_visit,
                    hulting_station: tour.hulting_station,
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

        console.log('new_data', new_data);

        AddTourPlan(new_data)
            .then(res => {
                if (res.data) {
                    console.log('res.data', res.data);
                    setSuccessMessage({ show: true, message: 'Successfully Added Tourplan.' });
                    const updatedData = res.data.map((item, index) => ({
                        ...item,
                        mpo_area_name: TPAreaName[index]
                    }));

                    setTpResponseData(prevData => [...prevData, ...updatedData]);
                    initialStates()
                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                        // toggleDrawer()
                    }, 4000);
                } else if (response?.error) {
                    setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                    setLoading(false);
                    setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                } else {
                    initialStates()
                    setErrorMessage({ show: true, message: res.error.data[0] });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 4000);
                }
            })
            .catch(err => {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 4000);
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
                console.error("Failed to delete tour plan:", error);
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
    })

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true)

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
        let sending_data = { ...values };
        sending_data['dates'] = [selectedDates];
        sending_data['shift'] = 1;
        sending_data['visit_data'] = MpoAreaData;
        sending_data['hulting_station'] = values['hulting_station'];
        sending_data['is_admin_opened'] = false;
        sending_data['user_id'] = company_user_role_id;
        AddHigherOrder(sending_data)
            .then(res => {
                if (res.data) {
                    initialStates()
                    setSuccessMessage({ show: true, message: 'Successfully Added Tourplan.' });
                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                    }, 5000);
                    setInitialFValues({
                        shift: "",
                        visit_data: MpoAreaData,
                        hulting_station: "",
                        user_id: company_user_role_id,
                    })
                }
                else if (response?.error) {
                    setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                    setLoading(false);
                    setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                    toggleDrawer()
                }
                else {
                    initialStates()
                    setErrorMessage({ show: true, message: res.error.data[0] });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                        toggleDrawer()
                    }, 5000);
                }
            })
            .catch(err => {
                initialStates()
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                    toggleDrawer()
                }, 5000);
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
                            Add Tourplan
                        </Typography>

                    </Box>
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
                                        <Controls.Input
                                            name={`purpose_of_visit`}
                                            label="Day Status"
                                            value={formValuesArray?.purpose_of_visit || ""}
                                            onChange={(event) => {
                                                handleFormChange('purpose_of_visit', event.target.value, false);
                                            }}
                                        />
                                    </Box>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name={`hulting_station`}
                                            label="Hulting Station"
                                            value={formValuesArray?.hulting_station || ""}
                                            onChange={(event) => {
                                                handleFormChange('hulting_station', event.target.value, false);
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </> : <Box>
                                <Box marginBottom={2}>
                                    {/* <FormControl sx={{ m: 1, width: 300 }}>
                                        <InputLabel>{"Select the Visited With*"}</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label"
                                            id="demo-multiple-name"
                                            multiple
                                            value={CompanyRoles}
                                            onChange={handleRolesChange}
                                            input={<OutlinedInput label="Select the Visited With*" />}
                                            sx={{ width: '100%' }}
                                            style={{
                                                borderBlockColor: "white",
                                                width: "100%",
                                                textAlign: 'start'
                                            }}
                                        >
                                            {executiveLevelOptions.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {item.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl> */}
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
                                {/* {
                                    CompanyRoles?.map((key, index) => (
                                        <MpoUserWiseArea id={key} key={index} setMpoAreaData={setMpoAreaData} MpoAreaData={MpoAreaData} />
                                    ))
                                } */}
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name={`hulting_station`}
                                        label="Hulting Station"
                                        value={values.hulting_station || ""}
                                        onChange={handleInputChange}
                                    />
                                </Box>
                            </Box>
                    }
                    <Stack spacing={1} direction="row">
                        <Button
                            variant="contained"
                            className="summit-button"
                            onClick={user_role === 'MPO' ? addTodo : handleSave}
                        >
                            Add TP{" "}
                        </Button>
                        {/* {
                            user_role === 'MPO' ?
                                <Button
                                    variant="contained"
                                    className="summit-button"
                                    onClick={handleSave}
                                >
                                    Submit All TP{" "}
                                </Button> : null
                        } */}
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

// const MpoUserWiseArea = ({ id, setMpoAreaData, MpoAreaData }) => {
//     const { company_id, user_role, company_user_id, company_user_role_id, role } = useSelector((state) => state.cookie);

//     const [visitData, setVisitData] = useState([]);

//     const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: id },
//         //     {
//         //     skip: !company_id || !role || !id
//         // }
//     );

//     console.log('MpoAreaData', MpoAreaData);

//     const [MpoTpArea, setMpoTpArea] = useState([]);
//     const [TPAreaName, setTPAreaName] = useState([])
//     const [mpoAreaData, setmpoAreaData] = useState([]);
//     const [AllMpoAreaData] = usePostUserIdToGetMpoAreaMutation();

//     useEffect(() => {
//         AllMpoAreaData({ id: company_user_role_id })
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

//     //! Display value
//     const [selectedAreas, setSelectedAreas] = useState(
//         MpoTpArea.map((id) => mpoAreaData.find((option) => option.id === id) || {})
//     )

//     //! On Chnage
//     const handleMpoTpArea = (event, value) => {
//         const mpotparea = value.map(option => option.id)
//         const mpotpareavalue = value.map(option => option.title)
//         setMpoTpArea(mpotparea)
//         setTPAreaName(mpotpareavalue)
//         setSelectedAreas(value)
//     }

//     //! Filter Options
//     const filteredOptions = mpoAreaData.filter(
//         (option) => !selectedAreas.some((selected) => selected.id === option.id)
//     );

//     // const mpoAreaData = useMemo(() => {
//     //     if (MpoArea?.data) {
//     //         return MpoArea?.data.map(key => ({ id: key.id, title: key.area_name }))
//     //     }
//     //     return [];
//     // }, [MpoArea])

//     const handleInputChange = (event) => {
//         const selectedAreaId = event.target.value;
//         // const newVisitData = [...MpoAreaData, { visited_with: id, area: selectedAreaId }];

//         const newVisitData = [{ visited_with: id, area: selectedAreaId }];
//         setMpoAreaData(newVisitData);
//         setVisitData(selectedAreaId);
//         console.log(MpoAreaData)
//     }

//     useEffect(() => {
//         const newVisitData = [{ visited_with: id }];
//         setMpoAreaData(newVisitData);
//     }, [id])

//     const [mulipleSelectedAreasId, setMultipleSelectedAreasId] = useState([])
//     //! On Chnage
//     // const handleMpoTpVisitedArea = (event, value) => {
//     //     // const mpotparea = value.map(option => option.id)
//     //     // const mpotpareavalue = value.map(option => option.title)
//     //     // setMpoTpArea(mpotparea)
//     //     // setTPAreaName(mpotpareavalue)
//     //     setSelectedAreas(value)

//     //     const selectedAreaId = value.map(option => option.id)
//     //     console.log(selectedAreaId)
//     //     // const newVisitData = [...MpoAreaData, { visited_with: id, area: selectedAreaId }];
//     //     // const newVisitData = [{ visited_with: id, area: selectedAreaId }];
//     //     const newVisitData = id.map(id => ({
//     //         visited_with: id,
//     //         area: selectedAreaId
//     //     }))
//     //     // setMpoAreaData(newVisitData);
//     //     setMpoAreaData(prevState => {
//     //         const updatedVisitData = [...prevState, ...newVisitData];
//     //         return updatedVisitData;
//     //     });
//     //     setVisitData(selectedAreaId);
//     //     console.log(MpoAreaData)
//     // }
//     // useEffect(() => {
//     //     console.log(MpoAreaData)
//     // }, [(MpoAreaData || id)]);

//     return (
//         <Box marginBottom={2}>
//             {/* <Controls.Select
//                 name={`select_the_area`}
//                 label="Select the Area*"
//                 value={visitData}
//                 onChange={handleInputChange}
//                 options={mpoAreaData}
//             /> */}

//             {/* <Autocomplete
//                 multiple
//                 options={filteredOptions}
//                 value={selectedAreas}
//                 // options={mpoAreaData}
//                 // value={MpoTpArea.map(id => mpoAreaData.find(option => option.id === id) || {})}
//                 getOptionLabel={(option) => option.title}
//                 onChange={handleMpoTpVisitedArea}
//                 renderInput={(params) => (
//                     <TextField {...params} label="Select the Areas" />
//                 )}
//                 renderOption={(props, option) => (
//                     <li {...props} key={option.id}>
//                         {option.title}
//                     </li>
//                 )}
//             /> */}
//         </Box>
//     )
// }

export default React.memo(AddTourPlan);