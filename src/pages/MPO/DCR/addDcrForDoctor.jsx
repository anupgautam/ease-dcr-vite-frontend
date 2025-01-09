import { Box, Button, Card, Checkbox, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Autocomplete, TextField, CircularProgress } from "@mui/material";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostHigherLevelExecutiveGetDataMutation } from "@/api/CompanySlices/companyUserRoleSlice";
import { useGetShiftsQuery } from "@/api/DCRs Api Slice/TourPlanApiSlice";
import { useGetShiftWiseDoctorDCRByIdQuery } from "@/api/DCRs Api Slice/doctorDCR/shiftWiseDoctorDCRSlice";
import { useGetAllRewardsQuery } from "@/api/DCRs Api Slice/rewardsAPISlice";
import { useUpdateTourPlansMutation } from "@/api/MPOSlices/TourPlanSlice";
import {
    useGetAllVisitedMpoWiseDoctorQuery,
    useGetDoctorsByIdQuery
} from "@/api/MPOSlices/doctorApiSlice";
import {
    useCreateDcrWithNullValuesForDoctorMutation, useCreateMpoShiftWiseDcrForDoctorMutation,
    usePostToGetTheTourPlanQuery,
    useUpdateDcrForDoctorValuesMutation
} from "@/api/MPOSlices/tourPlan&Dcr";
import { useGetAllCompanyProductsWithoutPaginationQuery } from "@/api/productSlices/companyProductSlice";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import Controls from "@/reusable/forms/controls/Controls";
import { useForm } from "@/reusable/forms/useForm";
import { UserListHead } from "@/sections/@dashboard/user";
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import moment from "moment";
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { BSDate } from "nepali-datepicker-react";
import { useGetAllProductsOptionsQuery, useGetAllProductsQuery } from "../../../api/MPOSlices/ProductSlice";
import { toast } from 'react-toastify';
import { returnValidation } from "../../../validation";

const TABLE_HEAD = [
    { id: 'doctor_name', label: 'Doctor Name', alignRight: false },
    { id: 'visited_with', label: 'Visited With', alignRight: false },
    { id: 'promoted_product', label: 'Promoted Product', alignRight: false },
    { id: 'rewards', label: 'Rewards', alignRight: false },
    { id: 'expenses_name', label: 'Expenses Name', alignRight: false },
    { id: 'expenses', label: 'Expense Cost', alignRight: false },
    { id: 'expenses_resoning', label: 'Expenses Reasoning', alignRight: false },
];

const AddDcrForDoctor = () => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const location = useLocation();
    const id = new URLSearchParams(location.search).get('id');

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now?._date?.year;

    const { data: tourplanData } = usePostToGetTheTourPlanQuery({ mpo_name: company_user_role_id, year: yearData, month: monthData });
    console.log(tourplanData)

    const [updateDcr] = useUpdateDcrForDoctorValuesMutation();
    const [createMpoDcr] = useCreateMpoShiftWiseDcrForDoctorMutation();
    const [DcrForDoctor] = useCreateDcrWithNullValuesForDoctorMutation();
    const [updateTourplan] = useUpdateTourPlansMutation();
    const [AllMutipleData, setAllMutipleData] = useState([]);


    const [PromotedProduct, setPromotedProduct] = useState([]);
    const handleProductChange = (event, value) => {
        const mpotparea = value.map(option => option.id)
        setPromotedProduct(mpotparea)
    }

    const [CompanyRoles, setCompanyRoles] = useState([]);

    const handleRolesChange = (event, value) => {
        const mpotparea = value.map(option => option.id)
        setCompanyRoles(mpotparea)
    }

    const [CompanyDoctor, setCompanyDoctor] = useState([]);
    const [DoctorData, setDoctorData] = useState([]);

    useEffect(() => {
        setDoctorData([]);

        CompanyDoctor.map(doctorId => {
            createNullValuesForDoctor(doctorId);
        });
    }, [CompanyDoctor]);

    const createNullValuesForDoctor = async (doctorId) => {
        if (doctorId) {
            try {
                const response = await DcrForDoctor();
                if (response.data) {
                    const newData = { doctor_id: doctorId, dcr_id: response.data.data.id };
                    const isDuplicate = DoctorData.some(item => item.doctor_id === newData.doctor_id && item.dcr_id === newData.dcr_id);
                    if (!isDuplicate) {
                        setDoctorData(prevData => [...prevData, newData]);
                    }
                }
            } catch (error) {
                console.error('Error creating null values for doctor:', error);
            }
        }
    }

    //! AutoComplete

    const handleDoctorChange = (event, value) => {
        const doctorname = value.map(option => option.id)
        setCompanyDoctor(doctorname)

        const removedDoctorIds = CompanyDoctor.filter(doctorId => !value.includes(doctorId));
        setDoctorData(prevData => prevData.filter(item => !removedDoctorIds.includes(item.doctor_id)));
    }

    const [RewardOptions, setRewardsOptions] = useState([]);

    const handleRewardsChange = (event, value) => {
        const mpotparea = value.map(option => option.id)
        setRewardsOptions(mpotparea)
    }

    const { data: ShiftData } = useGetShiftsQuery()

    const shiftAllData = useMemo(() => {
        if (ShiftData !== undefined) {
            return ShiftData?.map(key => ({ id: key.id, title: key.shift }))
        }
        return [];
    }, [ShiftData])

    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        // if ('chemist_name' in fieldValues)
        //     temp.chemist_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.chemist_name)

        temp.shift = returnValidation(['null'], values.shift)
        temp.date = returnValidation(['null'], values.date)
        temp.visited_area = returnValidation(['null'], values.visited_area)
        temp.visited_doctor = returnValidation(['null'], values.visited_doctor)

        setErrors({
            ...temp
        })


        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const [initialFValues, setInitialFvalues] = useState({
        edit: false,
        tour_id: "",
        id: "",
        shift: '',
        date: "",
        visited_area: '',
        visited_doctor: '',
        expenses: '',
        expenses_name: '',
        expenses_reasoning: '',
        company_roles: [],
    })


    const dcrForDoctor = useGetShiftWiseDoctorDCRByIdQuery(id);

    const [NewTourPlanData, setNewTourPlanData] = useState('');

    const selectTourPlanById = (key) => {
        setNewTourPlanData(key);
    }

    const areaOptions = useMemo(() => {
        if (NewTourPlanData !== undefined) {
            return NewTourPlanData?.mpo_area_read?.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [NewTourPlanData])

    useEffect(() => {
        if (dcrForDoctor?.data || NewTourPlanData) {
            setInitialFvalues({
                edit: true,
                tour_id: NewTourPlanData?.id,
                id: id,
                shift: "",
                company_roles: dcrForDoctor?.data?.visited_with,
                date: NewTourPlanData?.tour_plan?.tour_plan?.select_the_date_id,
                visited_area: "",
                visited_doctor: dcrForDoctor?.data?.visited_doctor,
                expenses: dcrForDoctor?.data?.expenses,
                expenses_name: dcrForDoctor?.data?.expenses_name,
                expenses_reasoning: dcrForDoctor?.data?.expenses_reasoning,
                day_status: tourplanData?.tour_plan?.tour_plan?.day_status
            });
        }
    }, [dcrForDoctor?.data, NewTourPlanData]);

    const { values,
        errors,
        setErrors,
        handleInputChange,
        handleMultipleInput,
        valueArray
    } = useForm(
        initialFValues,
        true,
        false,
        true
    )

    useEffect(() => {
        validate();

    }, [
        values.shift,
        values.visited_area,
        values.visited_doctor,
        values.date,
    ])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);

        setIsButtonDisabled(!valid);
    }, [
        values.shift,
        values.visited_area,
        values.visited_doctor,
        values.date,
    ]);

    const doctors = useGetAllVisitedMpoWiseDoctorQuery({ company_name: company_id, mpo_area: values.visited_area, mpo_name: company_user_role_id });

    const doctorOptions = useMemo(() => {
        if (doctors !== undefined) {
            if (doctors.status === 'fulfilled') {
                return doctors.data.map(key => ({ id: key.id, title: key?.doctor_name?.doctor_name }));
            }
        }
        return [];
    }, [doctors])

    const [executiveOptions, setExecutiveOptions] = useState([]);
    const [executiveUsers] = usePostHigherLevelExecutiveGetDataMutation();
    useEffect(() => {
        executiveUsers({ id: company_user_role_id }, {
            skip: !company_user_role_id
        })
            .then(res => {
                if (res.data) {
                    const executive = [];
                    res.data.forEach(keyData => {
                        executive.push({
                            id: keyData.id,
                            title: keyData?.user_name?.first_name + " " + keyData?.user_name?.middle_name + " " + keyData?.user_name?.last_name,
                        });
                    });
                    setExecutiveOptions(executive);
                }
            })
            .catch(err => {

            });
    }, [company_user_id]);

    const rewards = useGetAllRewardsQuery(company_id, {
        skip: !company_id
    });

    const rewardsOptions = useMemo(() => {
        if (rewards !== undefined) {
            if (rewards.status === 'fulfilled') {
                return rewards?.data?.map(key => ({ id: key.id, title: key.reward }))
            }
        }
        return [];
    }, [rewards])

    const companyProduct = useGetAllCompanyProductsWithoutPaginationQuery(
        company_id, {
        skip: !company_id
    }
    );

    const productOptions = useMemo(() => {
        if (companyProduct !== undefined) {
            if (companyProduct.status === 'fulfilled') {
                return companyProduct.data.map(key =>
                ({
                    id: key.id,
                    title: key?.product_name?.product_name,
                })
                );
            }
        }
        return [];
    }, [companyProduct])

    const [LastData, setLastData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });
    const navigate = useNavigate();

    const handlePostDcr = () => {
        setLoading(true)
        // if (AllMutipleData.length !== []) {
        if (AllMutipleData.length !== 0) {
            for (const allData of AllMutipleData) {
                let sendingData = { ...allData };
                sendingData['id'] = allData.id;
                if (sendingData['promoted_product']) {
                    let companyProduct = allData.company_product;
                    sendingData['promoted_product'] = [];
                    companyProduct.map(key => {
                        sendingData['promoted_product'].push({ id: key });
                    });
                } else {
                    sendingData['promoted_product'] = [];
                }
                if (sendingData['rewards']) {
                    let rewards = allData.rewards;

                    sendingData['rewards'] = [];
                    rewards.map(key => {
                        sendingData['rewards'].push({ id: key });
                    });
                } else {
                    sendingData['rewards'] = [];
                }
                if (sendingData['company_roles']) {
                    let companyRoles = allData.company_roles;
                    sendingData['company_roles'] = [];
                    companyRoles.map(key => {
                        sendingData['company_roles'].push({ id: key });
                    });
                } else {
                    sendingData['company_roles'] = [];
                }
                if (
                    sendingData['visited_area'] ||
                    sendingData['shift'] ||
                    sendingData['visited_doctor']
                ) {
                    sendingData['visited_area'] = sendingData['visited_area'];
                    sendingData['shift'] = allData.shift;
                    sendingData['visited_doctor'] = sendingData['visited_doctor'];
                    sendingData['expenses'] = sendingData?.Formdata?.expenses;
                    sendingData['expenses_name'] = sendingData?.Formdata?.expenses_name;
                    sendingData['expenses_reasoning'] = sendingData?.Formdata?.expenses_reasoning;
                    sendingData['month'] = getNepaliMonthName(moment(sendingData.date).month() + 1);
                    sendingData['year'] = moment(sendingData.date).year();
                    sendingData['mpo_name'] = company_user_role_id;
                    sendingData['company_name'] = company_id;
                    sendingData['day_status'] = tourplanData[0]?.tour_plan?.tour_plan?.day_status;
                } else {
                    sendingData['visited_area'] = null;
                    sendingData['visited_doctor'] = null;
                    sendingData['shift'] = null;
                }

                updateDcr({ id: allData.id, value: sendingData })
                    .then(res => {
                        if (res.data) {
                            // createMpoDcr(mpoShiftData)
                            //     .then(res => {
                            //         if (res.data) {
                            //             if (LastData === true) {
                            // setSuccessMessage({ show: true, message: 'All DCR Successfully Added.' });
                            // setTimeout(() => {
                            //     setSuccessMessage({ show: false, message: '' });
                            //     navigate('/dashboard/admin/dcr');
                            // }, 2000);
                            toast.success(`All DCR Successfully Added.`)
                            navigate('/dashboard/admin/dcr');

                            //         } else {
                            //             setSuccessMessage({ show: true, message: 'DCR Added Successfully Added.' });
                            //             setTimeout(() => {
                            //                 setSuccessMessage({ show: false, message: '' });
                            //                 // navigate('/dashboard/admin/dcr');
                            //             }, 2000);
                            //         }
                            //     }
                            // })
                            // .catch(err => {

                            // });
                        } else if (res?.error) {
                            // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                            // setLoading(false);
                            // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                            toast.error(`${res?.error?.data?.message}`)
                            setLoading(false);
                        } else {
                            // setErrorMessage({ show: true, message: 'This TP is not allowed to create DCR.' });
                            // setTimeout(() => {
                            //     setErrorMessage({ show: false, message: '' });
                            // }, 2000);
                            toast.error(`This TP is not allowed to create DCR.`)
                        }
                    })
                    .catch(err => {
                        // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                        // setTimeout(() => {
                        //     setErrorMessage({ show: false, message: '' });
                        // }, 2000);
                        toast.error(`This TP is not allowed to create DCR.`)

                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
        }
    }

    return (
        <Box style={{ padding: "10px" }}>
            <Typography style={{ fontWeight: '600', fontSize: '18px' }}>
                Add Dcr For Doctor
            </Typography>
            <Box style={{ marginTop: "20px" }}>
                <Grid container spacing={2}>
                    <Grid item md={4} xs={12}>
                        <Card >
                            <Box style={{ padding: "15px" }}>
                                <Typography style={{ color: "black", fontSize: '15px', fontWeight: "600" }}>Select Tour Plan*</Typography>
                                <Box style={{ marginTop: "15px" }}>
                                    {
                                        tourplanData !== undefined ?
                                            <>
                                                {
                                                    tourplanData?.length !== 0 ?
                                                        <Box style={{ marginBottom: '20px' }}>

                                                            <Box style={{ width: "100%", overflowX: "auto", whiteSpace: 'nowrap', cursor: "pointer" }}>
                                                                {
                                                                    tourplanData?.map((key, index) => (
                                                                        <Box style={{ width: '220px', display: "inline-block", marginRight: "10px" }} key={index} onClick={(e) => selectTourPlanById(key)}>
                                                                            <Box style={{ borderRadius: '5px', border: '1.2px solid #dbe0e4', padding: "5px", paddingTop: "10px", paddingLeft: "10px", paddingRight: '10px' }}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item xs={3.5}>
                                                                                        <Box style={{ padding: '5px', textAlign: 'center', border: '1.2px solid #2d8960', borderRadius: "5px", marginTop: '11px', marginBottom: "11px" }}>
                                                                                            <Typography style={{ fontSize: "16px", color: 'black', fontWeight: '600' }}>{key?.tour_plan?.tour_plan?.select_the_date_id?.slice(8)}</Typography>
                                                                                        </Box>
                                                                                    </Grid>
                                                                                    <Grid item xs={8.5}>
                                                                                        <Box >
                                                                                            <span style={{ backgroundColor: "#2d8960", padding: "4px", fontSize: "12px", color: "white", borderRadius: '15px', fontWeight: '600', paddingLeft: "10px", paddingRight: "10px" }}>
                                                                                                {key?.tour_plan?.tour_plan?.select_the_month}
                                                                                            </span>
                                                                                            <Typography style={{ marginTop: '5px', color: 'black', width: "150px", overflow: 'hidden', fontSize: "12px", fontWeight: "600", textOverflow: "ellipsis", whiteSpace: 'nowrap' }}>{key?.mpo_area_read?.map((key) => key.area_name)
                                                                                                .join(', ')}</Typography>
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
                                            </> : null
                                    }
                                </Box>
                                <Box style={{ marginTop: "15px" }}>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            // name="select_the_date"
                                            label="Select the Date*"
                                            value={values.date}
                                            onChange={handleInputChange}
                                            disable={true}
                                        // error={errors.date}
                                        />
                                    </Box>
                                    <Box marginBottom={2}>
                                        <Controls.Select
                                            name={`shift`}
                                            disable={false}
                                            label="Select the Shift*"
                                            value={values.shift}
                                            onChange={handleInputChange}
                                            options={shiftAllData}
                                        // error={errors.shift}
                                        />
                                    </Box>
                                    <Box marginBottom={2}>
                                        <Controls.Select
                                            name={`visited_area`}
                                            disable={false}
                                            label="Select the Area*"
                                            value={values.visited_area}
                                            onChange={handleInputChange}
                                            options={areaOptions}
                                        // error={errors.visited_area}
                                        />
                                    </Box>
                                    {values?.visited_area && (
                                        <Box marginBottom={2}>
                                            <Autocomplete
                                                multiple
                                                options={doctorOptions}
                                                getOptionLabel={(option) => option.title}
                                                onChange={handleDoctorChange}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Select Doctors" />
                                                )}
                                                renderOption={(props, option) => (
                                                    <li {...props} key={option.id}>
                                                        {option.title}
                                                    </li>
                                                )}
                                            />
                                        </Box>
                                    )}

                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item md={8} xs={12}>
                        <Card >
                            <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
                                <Scrollbar>
                                    <TableContainer sx={{ minWidth: 2000 }}>
                                        <Table>
                                            <UserListHead
                                                headLabel={TABLE_HEAD}
                                            />
                                            <TableBody>
                                                {
                                                    DoctorData.map((key, index) => (
                                                        <TableRow key={index}>
                                                            <DoctorDcr sn={index} data={key} values={values} setAllMutipleData={setAllMutipleData} AllMutipleData={AllMutipleData} />
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Scrollbar>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
                <Box style={{ marginTop: '15px' }}>
                    <Checkbox name="remember" label="Remember me" checked={LastData} onChange={(e) => setLastData(e.target.checked)} />
                    <label style={{ textAlign: 'start', flex: 1, fontWeight: "600", marginLeft: "4px", fontSize: "14px" }}>Last DCR for Doctor</label>
                </Box>
                <Box style={{ marginTop: "10px" }}>
                    {/* <Controls.SubmitButton
                        variant="contained"
                        className="summit-button"
                        disabled={isButtonDisabled}
                        onClick={(e) => handlePostDcr(e)}
                        text="Submit DCR"
                    /> */}

                    <Button
                        variant="contained"
                        className="summit-button"
                        onClick={(e) => handlePostDcr(e)}
                    >
                        Submit Dcr
                    </Button>
                </Box>
            </Box>
            {loading && (
                <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1000 }}>
                    <CircularProgress />
                </Grid>
            )}
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
        </Box>
    )
}

const DoctorDcr = ({ sn, data, setAllMutipleData, AllMutipleData, values }) => {
    const { company_id, user_role, company_user_id, company_user_role_id, company_division_name } = useSelector((state) => state.cookie);

    const Doctor = useGetDoctorsByIdQuery(data.doctor_id);
    const [executiveOptions, setExecutiveOptions] = useState([]);
    const [executiveUsers] = usePostHigherLevelExecutiveGetDataMutation();
    useEffect(() => {
        executiveUsers({ id: company_user_role_id }, {
            skip: !company_user_role_id
        })
            .then(res => {
                if (res.data) {
                    const executive = [];
                    res.data.forEach(keyData => {
                        executive.push({
                            id: keyData.id,
                            title: keyData?.user_name?.first_name + " " + keyData?.user_name?.middle_name + " " + keyData?.user_name?.last_name,
                        });
                    });
                    setExecutiveOptions(executive);
                }
            })
            .catch(err => {

            });
    }, [company_user_role_id]);


    const [CompanyRoles, setCompanyRoles] = useState([]);
    const handleRolesChange = (event, value) => {
        const mpotparea = value.map(option => option.id)
        setCompanyRoles(mpotparea)
    }
    // const companyProduct = useGetAllCompanyProductsWithoutPaginationQuery(company_id, {
    //     skip: !company_id
    // });

    const companyProduct = useGetAllProductsOptionsQuery({ id: company_id, division_name: company_division_name }, {
        skip: !company_id || !company_division_name
    })

    const productOptions = useMemo(() => {
        if (companyProduct !== undefined) {
            if (companyProduct?.status === 'fulfilled') {
                return companyProduct?.data.map(key =>
                ({
                    id: key.id,
                    title: key?.product_name?.product_name,
                })
                );
            }
        }
        return [];
    }, [companyProduct])

    const [PromotedProduct, setPromotedProduct] = useState([]);

    const handleProductChange = (event, value) => {
        const mpotparea = value.map(option => option.id)
        setPromotedProduct(mpotparea)
    }

    const rewards = useGetAllRewardsQuery(company_id, {
        skip: !company_id
    });

    const rewardsOptions = useMemo(() => {
        if (rewards !== undefined) {
            if (rewards.status === 'fulfilled') {
                return rewards?.data.map(key => ({ id: key.id, title: key.reward }));
            }
        }
        return [];
    }, [rewards])

    const [RewardOptions, setRewardsOptions] = useState([]);

    const handleRewardsChange = (event, value) => {
        const mpotparea = value.map(option => option.id)
        setRewardsOptions(mpotparea)
    }

    const [Formdata, setFormData] = useState({
        expenses_name: "",
        expenses: "",
        expenses_reasoning: "",
    })

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const newData = { ...Formdata, [name]: value };
        setFormData(newData);
    }

    useEffect(() => {
        setAllMutipleData(prevData => {
            const updatedData = [...prevData];
            updatedData[sn] = {
                ...updatedData[sn],
                id: data.dcr_id,
                edit: true,
                shift: values.shift,
                date: values.date,
                visited_area: values.visited_area,
                visited_doctor: data.doctor_id,
                Formdata,
                rewards: RewardOptions,
                company_roles: CompanyRoles,
                company_product: PromotedProduct,
                context: {
                    request: 'PATCH',
                    company_product: 'select',
                    company_roles: 'select',
                    rewards: 'select',
                },
            };
            return updatedData;
        });
    }, [Formdata, RewardOptions, CompanyRoles, PromotedProduct])
    return (
        <>
            <TableCell style={{ width: "50px" }}>{sn + 1}</TableCell>
            <TableCell style={{ width: "200px" }}>{Doctor?.data?.doctor_name.doctor_name}</TableCell>
            <TableCell align="left" style={{ width: "300px" }}>
                {/* //! Autocomplete */}
                <Autocomplete
                    multiple
                    options={executiveOptions}
                    getOptionLabel={(option) => option.title}
                    onChange={handleRolesChange}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Visited With" />
                    )}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.title}
                        </li>
                    )}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "300px" }}>
                {/* //! Autocomplete */}
                <Autocomplete
                    multiple
                    options={productOptions}
                    getOptionLabel={(option) => option.title}
                    onChange={handleProductChange}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Promoted Products" />
                    )}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.title}
                        </li>
                    )}
                />
            </TableCell>
            <TableCell align="left" style={{ width: "300px" }}>
                <Autocomplete
                    multiple
                    options={rewardsOptions}
                    getOptionLabel={(option) => option.title}
                    onChange={handleRewardsChange}
                    renderInput={(params) => (
                        <TextField {...params} label="Select the Rewards" />
                    )}
                    renderOption={(props, option) => (
                        <li {...props} key={option.id}>
                            {option.title}
                        </li>
                    )}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="expenses_name"
                    label="Expenses Name"
                    value={Formdata.expenses_name || ""}
                    onChange={handleInputChange}
                    disable={false}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="expenses"
                    label="Expenses Cost"
                    value={Formdata.expenses || ""}
                    onChange={handleInputChange}
                    disable={false}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="expenses_reasoning"
                    label="Expenses Reasoning*"
                    value={Formdata.expenses_reasoning || ""}
                    onChange={handleInputChange}
                    disable={false}
                />
            </TableCell>
        </>
    )
}

export default React.memo(AddDcrForDoctor);