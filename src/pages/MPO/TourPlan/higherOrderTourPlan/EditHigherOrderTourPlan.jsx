import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
    Box, Grid,
    Typography, Button, Select, OutlinedInput, MenuItem, FormControl, InputLabel
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import 'react-datepicker/dist/react-datepicker.css';
import { useForm, Form } from '../../../../reusable/forms/useForm'
import Controls from '../../../../reusable/components/forms/controls/Controls';
import { returnValidation } from '../../../../validation';
import {
    useGetShiftsQuery
} from '../../../../api/DCRs Api Slice/TourPlanApiSlice'
import DateToString from '@/reusable/forms/utils/dateToString';
import {
    useGetHOTourPlansByIdQuery,
    useUpdateHOTourPlansMutation
} from '../../../../api/HighOrderSlices/hoTourPlanSlice';
import { useGetMpoAreaQuery } from '../../../../api/MPOSlices/TourPlanSlice';
import { useGetUsersByCompanyRoleIdExecutativeLevelQuery } from '../../../../api/MPOSlices/UserSlice';
import Cookies from 'js-cookie';
import moment from 'moment';
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';


const EditHOTourPlan = ({ idharu, onClose, setEdited }) => {
    const now = new BSDate().now();
    const [users, setUsers] = useState([]);
    const [dateData, setDateData] = useState();


    //! Getting TourPlan by ID
    const TourPlan = useGetHOTourPlansByIdQuery(idharu);


    const userLists = useGetUsersByCompanyRoleIdExecutativeLevelQuery({ id: Cookies.get("company_id"), page: TourPlan?.data?.user_id?.id })

    useEffect(() => {
        const user = []
        if (userLists) {
            userLists?.data?.forEach((key) => {
                user.push({
                    id: key?.id,
                    title: key?.user_name?.first_name + " " + key?.user_name?.last_name
                })
            })
            setUsers(user);
        }
    }, [userLists])



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
        temp.visited_with = returnValidation(['null'], values.visited_with)


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
        visited_with: "",
        is_dcr_added: "",
        is_approved: "",
        hulting_station: "",
    })

    const [CompanyRoles, setCompanyRoles] = useState([]);

    const handleRolesChange = (event) => {
        const {
            target: { value },
        } = event;
        setCompanyRoles(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const [MpoAreaData, setMpoAreaData] = useState([]);

    useEffect(() => {
        if (TourPlan.data) {
            setInitialFValues({
                user_id: TourPlan?.data?.user_id?.user_name.first_name + ' ' + TourPlan?.data?.user_id?.user_name.last_name,
                shift: 1,
                date: TourPlan?.data?.date,
                month: TourPlan?.data?.month,
                is_dcr_added: TourPlan?.data?.is_dcr_added,
                is_approved: TourPlan?.data?.is_approved,
                hulting_station: TourPlan?.data?.hulting_station,
            });
            setDateData(TourPlan?.data?.date ? TourPlan?.data?.date : now)
        }
    }, [TourPlan.data])

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

    useEffect(() => {
        validate();
    }, [values.user_id,
    values.shift,
    values.date,
    values.visited_with,
    values.is_dcr_added,
    values.month,
    values.is_approved])


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Edit tourplan
    const [updateTourPlans] = useUpdateHOTourPlansMutation();
    const history = useNavigate();


    const monthData = getNepaliMonthName(moment(dateData).month() + 1);


    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("user_id", TourPlan?.data?.user_id?.id);
        formData.append("shift", 1);
        formData.append("date", typeof values.date === "string" ? values.date : DateToString(values.date));
        formData.append("is_dcr_added", values.is_dcr_added === null ? false : values.is_dcr_added);
        formData.append("is_approved", values.is_approved);
        formData.append("visited_with", values.visited_with);
        formData.append("hulting_station", values.hulting_station);
        formData.append('month', monthData)
        formData.append('id', idharu)
        formData.append('company_id', Cookies.get('company_id'))
        try {
            await updateTourPlans(formData).unwrap();
            setEdited(true);
            setSuccessMessage({ show: true, message: 'Successfully Edited TourPlan' });
            setTimeout(() => {
                history("/dashboard/admin/tourplan")
                setSuccessMessage({ show: false, message: '' });
            }, 3000);
        }
        catch (error) {

            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
    }, [updateTourPlans, values])

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
                            Edit TourPlan
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
                            <Controls.Select
                                name="visited_with"
                                label="Visited With*"
                                value={values.visited_with}
                                onChange={handleInputChange}
                                options={users}
                                error={errors.visited_with}
                            // className={"drawer-first-name-input"}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <FormControl sx={{ m: 1, width: 300 }}>
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
                            </FormControl>
                        </Box>
                        {
                            users.map((key, index) => (
                                <MpoUserWiseArea id={key} key={index} setMpoAreaData={setMpoAreaData} MpoAreaData={MpoAreaData} />
                            ))
                        }
                        <Box marginBottom={2}>
                            <Controls.Checkbox
                                name="is_approved"
                                value={values.is_approved}
                                onChange={handleInputChange}
                                label="Is Approved"
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
};

const MpoUserWiseArea = ({ id, setMpoAreaData, MpoAreaData }) => {
    const [visitData, setVisitData] = useState([]);
    const MpoArea = useGetMpoAreaQuery({ company_name: Cookies.get('company_id'), mpo_name: Cookies.get('role') === 'other' ? '' : id });

    const mpoAreaData = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map((key) => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])

    const handleInputChange = (event) => {
        const selectedAreaId = event.target.value;
        const newVisitData = [...MpoAreaData, { visited_with: id, area: selectedAreaId }];
        setMpoAreaData(newVisitData);
        setVisitData(selectedAreaId);
    };
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

export default React.memo(EditHOTourPlan);