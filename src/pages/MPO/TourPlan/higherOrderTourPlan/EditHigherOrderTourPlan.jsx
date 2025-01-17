import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
    Box, Grid,
    Typography, Button, Select, OutlinedInput, MenuItem, FormControl, InputLabel, CircularProgress, Autocomplete,
    TextField
} from '@mui/material'
import { useLocation, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Form } from '../../../../reusable/forms/useForm'

import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../../validation';
import {
    useGetShiftsQuery
} from '../../../../api/DCRs Api Slice/TourPlanApiSlice'
import DateToString from '@/reusable/forms/utils/dateToString';
import {
    useGetHOTourPlansByIdQuery,
    useUpdateHOTourPlansMutation
} from '../../../../api/HighOrderSlices/hoTourPlanSlice';
import { usePostUserIdToGetMpoAreaMutation } from '../../../../api/MPOSlices/TourPlanSlice';
import moment from 'moment';
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { useSelector } from 'react-redux';
import { usePostUserIdToGetLowerLevelExecutiveMutation } from '@/api/MPOSlices/UserSlice';
import { ConstructionOutlined } from '@mui/icons-material';
import { extractErrorMessage } from '../../../../reusable/extractErrorMessage';
import { toast } from 'react-toastify';
import { useGetAllDayStatusQuery } from "../../../../api/MPOSlices/UserSlice";
import { useGetAllVisitedWithAreaQuery } from '@/api/MPOSlices/tourPlan&Dcr';

const EditHOTourPlan = ({ idharu, onClose, setEdited }) => {

    const { company_id, user_role, company_user_id, role, company_user_role_id } = useSelector((state) => state.cookie);

    const location = useLocation();

    const dayStatus = useGetAllDayStatusQuery();

    const DayStatus = useMemo(() => {
        if (dayStatus?.data) {
            return dayStatus?.data.map(key => ({ id: key.id, title: key?.day_status }))
        }
        return [];
    }, [dayStatus])

    const now = new BSDate().now();
    const [dateData, setDateData] = useState();

    const [MpoTpArea, setMpoTpArea] = useState([]);
    const [TPAreaName, setTPAreaName] = useState([])
    const [mpoAreaData, setmpoAreaData] = useState([]);
    const [AllMpoAreaData] = usePostUserIdToGetMpoAreaMutation();

    useEffect(() => {
        AllMpoAreaData({ id: company_user_role_id })
            .then((res) => {
                if (res?.data) {
                    const data = res?.data.map((key) => ({
                        id: key.id,
                        title: key?.area_name
                    }));
                    setmpoAreaData(data)
                }
            })
    }, [company_user_role_id])

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

    const [multipleVisitedWith, setMultipleVisitedWith] = useState([])

    const handleMultipleVisitedWith = (e, value) => {
        setMultipleVisitedWith(value)
    }

    //! Filter Options
    const filteredOptions = mpoAreaData.filter(
        (option) => !selectedAreas.some((selected) => selected.id === option.id)
    );

    //! Getting TourPlan by ID
    const TourPlan = useGetHOTourPlansByIdQuery(idharu);

    const [LowerExecutive] = usePostUserIdToGetLowerLevelExecutiveMutation();


    // useEffect(() => {
    //     if (TourPlan?.data?.user_id?.id) {
    //         LowerExecutive({ id: TourPlan?.data?.user_id?.id })
    //             .then((res) => {
    //                 if (res.data) {
    //                     const data = res.data.map(key => ({ id: key.id, title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name }));
    //                     setUsers(data);
    //                 }
    //             })
    //     }
    // }, [TourPlan?.data?.user_id?.id])

    const [users, setUsers] = useState([]);

    const [userLists] = usePostUserIdToGetLowerLevelExecutiveMutation()
    useEffect(() => {
        if (company_user_id) {
            userLists({ id: company_user_id })
                .then((res) => {
                    if (res.data) {
                        const data = res?.data?.map(key => ({
                            id: key.id,
                            title: key?.user_name?.first_name + " " + key?.user_name?.middle_name + " " + key?.user_name?.last_name
                        }));
                        setUsers(data)
                    }
                })
        }
    }, [company_user_id])


    //! Get visited Area
    const VisitedArea = useGetAllVisitedWithAreaQuery(company_user_role_id)

    console.log(VisitedArea)

    const visitedAreas = useMemo(() => {
        if (VisitedArea?.data) {
            return VisitedArea?.data.map((key => ({
                id: key.id, title: key.area_name + " " + `( ${key.station_type})`
            })))
        }
        return [];
    })

    // //! Get selected area
    const shiftData = useGetShiftsQuery();

    const shifts = useMemo(() => {
        if (shiftData) {
            return shiftData?.data?.map((key) => ({
                id: key.id,
                title: key.shift,
            }));
        } return [];
    }, [shiftData])

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        temp.user_id = returnValidation(['null'], values.user_id)
        temp.shift = returnValidation(['null'], values.shift)
        temp.date = returnValidation(['null'], values.date)
        temp.visited_data = returnValidation(['null'], values.visited_data)


        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        user_id: "",
        shift: "",
        month: "",
        visited_data: "",
        is_dcr_added: "",
        is_approved: "",
        hulting_station: "",
        day_status: "",
    })

    const [MpoAreaData, setMpoAreaData] = useState([]);


    const [CompanyRoles, setCompanyRoles] = useState([]);

    const handleRolesChange = (event) => {
        const {
            target: { value },
        } = event;
        setCompanyRoles(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    const [isApproved, setIsApproved] = useState(false)

    const [defaultVisitedWith, setDefaultVisitedWith] = useState([])

    console.log(TourPlan?.data)
    useEffect(() => {
        if (TourPlan?.data) {

            // const selectedVisitedWith = TourPlan?.data?.visited_data?.map(visited => ({
            //     id: visited?.id,
            //     title: visited?.user_name?.first_name + " " + visited?.user_name?.middle_name + " " + visited?.user_name?.last_name
            // }))

            const selectedVisitedArea = TourPlan?.data?.visited_data?.map(visited => ({
                id: visited?.id,
                title: visited?.area_name + " " + `( ${visited.station_type})`
            }))

            setInitialFValues({
                user_id: TourPlan?.data?.user_id?.user_name.first_name + ' ' + TourPlan?.data?.user_id?.user_name.last_name,
                shift: 1,
                date: TourPlan?.data?.date,
                month: TourPlan?.data?.month,
                is_dcr_added: TourPlan?.data?.is_dcr_added,
                is_approved: TourPlan?.data?.is_approved,
                hulting_station: TourPlan?.data?.hulting_station,
                day_status: TourPlan?.data?.day_status,
                visited_data: TourPlan?.data?.visited_data
            });
            setDateData(TourPlan?.data?.date ? TourPlan?.data?.date : now)
            // setMultipleVisitedWith(selectedVisitedWith)
            setMultipleVisitedArea(selectedVisitedArea)
            // setIsApproved(TourPlan?.data?.is_approved)
        }
    }, [TourPlan])



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

    // const [visitedNames, setVisitedNames] = useState([])
    const [defaultExecutives, setDefaultExecutives] = useState()

    useEffect(() => {
        if (values?.visited_data) {
            const defaultVisitedWith = values?.visited_data?.map(item => item.visited_with);
            setCompanyRoles(defaultVisitedWith);
            setDefaultExecutives(defaultVisitedWith)
        }
    }, [values]);

    const [VisitedData, setVisitedData] = useState('');

    const [multipleVisitedArea, setMultipleVisitedArea] = useState([])
    const handleMultipleVisitedArea = (e, value) => {
        setMultipleVisitedArea(value);
    }

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



    useEffect(() => {
        validate();
    }, [values.user_id,
    values.shift,
    values.date,
    values.visited_with,
    values.is_dcr_added,
    values.month])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    useEffect(() => {
        if (values?.visited_data) {
            const defaultRoles = values.visited_data.map((data) => data.visited_with);
            setCompanyRoles(defaultRoles);

            // const visitedIds = values?.visited_data?.map((item) => item.id)
            // setDefaultExecutives(visitedIds)

            const defaultAreaData = values?.visited_data.map((data) => ({
                visited_with: data?.visited_with,
            }));
            setMpoAreaData(defaultAreaData);
        }
    }, [values]);

    //! Edit tourplan
    const [updateTourPlans] = useUpdateHOTourPlansMutation();
    const history = useNavigate();


    const monthData = getNepaliMonthName(moment(dateData).month() + 1);
    const handleSubmit = async (e) => {
        setLoading(true)
        const data = {
            visit_data: MpoAreaData,
            id: idharu,
            company_id: company_id,
            user_id: TourPlan?.data?.user_id?.id,
            shift: 1,
            date: typeof values.date === "string" ? values.date : DateToString(values.date),
            is_dcr_added: values.is_dcr_added === null ? false : values.is_dcr_added,
            is_approved: values.is_approved ? values.is_approved : false,
            hulting_station: values.hulting_station,
            day_status: values.day_status,
            month: monthData
        }
        // const formData = new FormData();
        // formData.append("user_id", TourPlan?.data?.user_id?.id);
        // formData.append("shift", 1);
        // formData.append("date", typeof values.date === "string" ? values.date : DateToString(values.date));
        // formData.append("is_dcr_added", values.is_dcr_added === null ? false : values.is_dcr_added);
        // formData.append("is_approved", values.is_approved);
        // // formData.append("visit_data", values.visited_data?.map((visiteddata) => visiteddata.visited_with));
        // formData.append("visit_data", MpoAreaData);
        // formData.append("hulting_station", values.hulting_station);
        // formData.append('month', monthData)
        // formData.append('id', idharu)
        // formData.append('company_id', company_id)
        try {
            setEdited(true)
            await updateTourPlans(data)
                .then((response) => {
                    if (response?.data) {
                        // setSuccessMessage({ show: true, message: 'Successfully Edited TourPlan' });
                        // setTimeout(() => {
                        //     history("/dashboard/admin/tourplan")
                        //     setSuccessMessage({ show: false, message: '' });
                        //     onClose();
                        // }, 2000);

                        toast.success('Successfully Edited TourPlan')
                        // history("/dashboard/admin/tourplan")
                        onClose();
                    }
                    else if (response?.error) {

                        // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                        // setLoading(false);
                        // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                        toast.error(`${response?.error?.data?.message}`)
                        setLoading(false);
                    }
                    else {
                        // setErrorMessage({ show: true, message: "Error" });
                        // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                        toast.error(`Some Error Occurred. Try again later`)

                    }
                })
        }
        catch (error) {

            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 2000);
            toast.error(`Some Error Occurred. Try again later`)
        } finally {
            setLoading(false)
        }
    }

    // const visitedData = values?.visited_data?.map((visiteddata) => visiteddata.visited_with)

    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
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
                        width="340px"
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: "40px" }}
                    >
                        <Typography variant="h6" className="drawer-box-text">
                            Edit HO TourPlan <br />
                            <IconButton
                                className="close-button"
                                onClick={onClose}
                            >
                                <Close />
                            </IconButton>
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        disabled={true}
                                        name="user_id"
                                        label="User Name*"
                                        value={values.user_id}
                                        onChange={handleInputChange}
                                        // options={userList}
                                        error={errors.user_id}
                                    // className={"drawer-first-name-input"}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                            </Grid>
                        </Grid>
                        <Box marginBottom={2}>
                            <NepaliDatePicker value={dateData} format="YYYY-MM-DD" onChange={(value) => setDateData(value)} />
                        </Box>
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
                                    // MenuProps={MenuProps}
                                    sx={{ width: '100%' }}
                                    style={{
                                        borderBlockColor: "white",
                                        width: "100%",
                                        textAlign: 'start'
                                    }}
                                >
                                    {users.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}

                            {/*//! Visited With  */}
                            {/* <Autocomplete
                                multiple
                                options={users}
                                getOptionLabel={(option) => option.title}
                                value={multipleVisitedWith || []}
                                onChange={handleMultipleVisitedWith}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => (
                                    <TextField {...params} label="Select the Visited With*" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                )}
                            /> */}
                        </Box>
                        {/* {Array.isArray(values?.visited_data) &&
                            values.visited_data.map((key, index) => (
                                <MpoUserWiseArea
                                    id={TourPlan?.data?.user_id?.id}
                                    value={key.area}
                                    key={index}
                                    setMpoAreaData={setMpoAreaData}
                                    MpoAreaData={MpoAreaData}
                                    visitedWith={key.visited_with}
                                    onAreaChange={handleAreaChange}
                                />
                            ))
                        } */}

                        {/*//! Visited Area  */}
                        <Box marginBottom={2}>
                            <Autocomplete
                                value={multipleVisitedArea}
                                multiple
                                options={visitedAreas}
                                getOptionLabel={(option) => option.title}
                                onChange={handleMultipleVisitedArea}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => (
                                    <TextField {...params} label="Select the Visited Name*" />
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
                                name="hulting_station"
                                label="Hulting Station"
                                value={values.hulting_station}
                                onChange={handleInputChange}
                                placeholderText="Hulting Station"
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="day_status"
                                label="Day Status"
                                value={values.day_status}
                                onChange={handleInputChange}
                                placeholderText="Day Status"
                                options={DayStatus}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            {/* <div style={{ display: "flex", alignItems: "center" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "20px",
                                        height: "20px",
                                        border: "2px solid #2065d1",
                                        borderRadius: "4px",
                                        backgroundColor: "#fff",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        position: "relative",
                                    }}
                                    tabIndex={0} // Allows focus
                                    onClick={() => setIsApproved((prev) => !prev)}
                                    onFocus={(e) => {
                                        e.target.style.boxShadow = "0 0 5px #add8e6";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.boxShadow = "none";
                                    }}
                                >
                                    {isApproved && (
                                        <span
                                            style={{
                                                width: "5px",
                                                height: "15px",
                                                borderBottom: "3px solid #103996",
                                                borderRight: "3px solid #103996",
                                                transform: "rotate(45deg)",
                                            }}
                                        ></span>
                                    )}
                                </div>
                                <label
                                    style={{
                                        fontSize: "15px",
                                        color: "black",
                                        fontWeight: "600",
                                        marginLeft: "8px",
                                    }}
                                >
                                    Is Approved
                                </label>
                            </div> */}

                            {/* <Controls.Checkbox
                                name="is_approved"
                                value={values.is_approved}
                                onChange={handleInputChange}
                                label="Is Approved"
                                type="checkbox"
                            /> */}
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
};

// const MpoUserWiseArea = ({ id, setMpoAreaData, MpoAreaData, value, onAreaChange }) => {
//     const [visitData, setVisitData] = useState(value || "");
//     const [mpoAreaData, setmpoAreaData] = useState([]);
//     const [AllMpoAreaData] = usePostUserIdToGetMpoAreaMutation();

//     useEffect(() => {
//         AllMpoAreaData({ id })
//             .then((res) => {
//                 if (res.data) {
//                     const data = res.data.map((key) => ({
//                         id: key.id,
//                         title: key.area_name
//                     }));
//                     setmpoAreaData(data);
//                 }
//             });
//     }, [id]);


//     const handleInputChange = (event) => {
//         const selectedAreaId = event.target.value;
//         setVisitData(selectedAreaId);
//         onAreaChange(selectedAreaId, visitedWith);
//     };

//     return (
//         <Box marginBottom={2}>
//             <Controls.Select
//                 name={`select_the_area`}
//                 label="Select the Area*"
//                 value={visitData} // Bind to the visitData state, which contains the default area
//                 onChange={handleInputChange}
//                 options={mpoAreaData}
//             />
//         </Box>
//     );
// };

export default React.memo(EditHOTourPlan);