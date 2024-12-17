import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';
import { useForm } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { usePostAllMPONamesNoPageMutation } from '@/api/MPOSlices/DoctorSlice';
import { useGetShiftsQuery } from '@/api/DCRs Api Slice/TourPlanApiSlice';
import { useGetUsersByCompanyRoleIdExecutativeLevelQuery, usePostUserIdToGetLowerLevelExecutiveMutation } from '@/api/MPOSlices/UserSlice';
import {
    useAddHigherOrderDcrMutation,
    useCreateDcrForChemistWithNullValuesMutation,
    useCreateDcrForStockistWithNullValuesMutation,
    useCreateDcrWithNullValuesForDoctorMutation,
    useGetHigherOrderTourPlanUsingIdQuery
} from '@/api/MPOSlices/tourPlan&Dcr';
import { useNavigate } from 'react-router-dom';
import { useGetcompanyUserRolesByIdQuery } from '@/api/CompanySlices/companyUserRoleSlice';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import moment from 'moment';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { NepaliDatePicker, BSDate } from "nepali-datepicker-react";


const AddDcrForHo = () => {

    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);


    const now = new BSDate().now();
    const [dateData, setDateData] = useState(now);

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;

    const [dateFormat, setDateFormat] = useState(dateData?._date)
    const [nepaliDate, setNepaliDate] = useState(dateFormat)


    const formatDate = (date) => {
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formattedDate = formatDate(nepaliDate);

    useEffect(() => {
        const formatDate = (date) => {
            const year = date.year;
            const month = String(date.month).padStart(2, '0');
            const day = String(date.day).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const formattedDate = formatDate(nepaliDate);
    }, [dateData])

    const chemistcategories = [
        { id: "A", title: "A" },
        { id: "B", title: "B" },
        { id: "C", title: "C" },
    ]

    const { data: ShiftData } = useGetShiftsQuery();

    const shiftAllData = useMemo(() => {
        if (ShiftData) {
            return ShiftData.map(key => ({ id: key.id, title: key.shift }))
        }
        return [];
    }, [ShiftData])


    const [LowerExecutive] = usePostUserIdToGetLowerLevelExecutiveMutation()

    const [executiveLevelOptions, setExecutiveLevelOptions] = useState([]);

    useEffect(() => {
        if (company_user_id) {
            LowerExecutive({ id: company_user_id })
                .then((res) => {
                    if (res.data) {
                        const data = res.data.map(key => ({ id: key.id, title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name }));
                        setExecutiveLevelOptions(data);
                    }
                })
        }
    }, [company_user_id])

    // const [higherOrderTourplans, setHigherOrderTourplans] = useState([]);

    const { data: higherOrderTourplans } = useGetHigherOrderTourPlanUsingIdQuery({ user_id: company_user_role_id, year: yearData, month: monthData });

    // useEffect(() => {
    //     GethingherOrder({ user_id: company_user_role_id })
    //         .then((res) => {
    //             setHigherOrderTourplans(res.data);
    //         })
    //         .catch((err) => {
    //         })
    // }, [company_user_id])

    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList?.data) {
            return MpoList?.data?.map(key => ({
                id: key.id,
                title: key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name
            }))
        }
        return [];
    }, [MpoList])

    useEffect(() => {
        if (company_id) {
            MpoData({ company_name: company_id }, {
                skip: !company_id
            })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [company_id])

    const [initialFValues, setInitialFvalues] = useState({
        id: "",
        shift: "",
        date: "",
        visited_with: ""
    })


    const [TpDetail, setTpDetail] = useState(null);




    const selectTourPlanById = (key) => {
        setTpDetail({
            id: key.id,
            date: key.date,
        })
    }

    useEffect(() => {
        if (TpDetail) {
            setInitialFvalues({
                id: TpDetail.id,
                date: TpDetail.date,
            })
        }
    }, [TpDetail])

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true, false,
        true)


    const [createDCR] = useAddHigherOrderDcrMutation();

    const [DcrForDoctor] = useCreateDcrWithNullValuesForDoctorMutation()
    const [DcrForChemist] = useCreateDcrForChemistWithNullValuesMutation()
    const [DcrForStockist] = useCreateDcrForStockistWithNullValuesMutation();
    const navigation = useNavigate();

    const handleDCRForDoctor = useCallback(() => {
        // DcrForDoctor()
        //     .then((res) => {
        //         if (res.data) {
        navigation(`/dashboard/admin/dcr/for/doctor`)
        //     }
        // }).catch((err) => {
        // })
    }, [])

    const handleDCRForChemist = useCallback(() => {
        // DcrForChemist()
        //     .then((res) => {
        //         if (res.data) {
        navigation(`/dashboard/admin/dcr/for/chemist`)
        //     }
        // }).catch((err) => {
        // })
    }, [])

    const handleDCRForStockist = useCallback(() => {
        DcrForStockist().then((res) => {
            if (res.data) {
                navigation(`/dashboard/admin/dcr/for/stockist?id=${res.data.data.id}`)
            }
        }).catch((err) => {
        })
    }, [])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });


    //!Modal wala ko click event
    const onAddDcr = async (e) => {
        setLoading(true);
        const data = {
            // date: values.date,
            date: formattedDate,
            visited_with: values.visited_with,
            shift: values.shift,
            user_id: company_user_role_id,
            company_id: company_id,
            year: moment(values.date).year(),
            month: getNepaliMonthName(moment(values.date).month() + 1)
        }
        await createDCR(data)
            .then((res) => {
                if (res.data) {
                    setIsDrawerOpen(false)
                    setSuccessMessage({ show: true, message: 'Successfully Added DCR.' });
                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                    }, 2000);
                }
                else {
                    setErrorMessage({ show: true, message: extractErrorMessage({ data: res?.error }) });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 2000);
                }
            })
            .catch((err) => {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 2000);
            })
        // .finally(() => {
        //     setLoading(false)
        // })

        setIsDrawerOpen(false)
    }


    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsDrawerOpen(true)} >
                Add
            </Button>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
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
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Add DCR
                        </Typography>
                    </Box>
                    {
                        user_role === 'other-roles' &&
                        <>
                            <Box style={{ marginBottom: "20px" }}>
                                <>
                                    {
                                        higherOrderTourplans?.length !== 0 ?
                                            <Box style={{ marginBottom: '20px' }}>

                                                <Box style={{ width: "100%", overflowX: "auto", whiteSpace: 'nowrap', cursor: "pointer" }}>
                                                    {
                                                        higherOrderTourplans?.map((key, index) => (
                                                            <Box style={{ width: '220px', display: "inline-block", marginRight: "10px" }} key={index} onClick={(e) => selectTourPlanById(key)}>
                                                                <Box style={{ borderRadius: '5px', border: '1.2px solid #dbe0e4', padding: "5px", paddingTop: "10px", paddingLeft: "10px", paddingRight: '10px' }}>
                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={3.5}>
                                                                            <Box style={{ padding: '5px', textAlign: 'center', border: '1.2px solid #2d8960', borderRadius: "5px", marginTop: '11px' }}>
                                                                                <Typography style={{ fontSize: "16px", color: 'black', fontWeight: '600' }}>{key.date.slice(8)}</Typography>
                                                                            </Box>
                                                                        </Grid>
                                                                        <Grid item xs={8.5}>
                                                                            <Box >
                                                                                <span style={{ backgroundColor: "#2d8960", padding: "4px", fontSize: "12px", color: "white", borderRadius: '15px', fontWeight: '600', paddingLeft: "10px", paddingRight: "10px" }}>
                                                                                    {key.month}
                                                                                </span>
                                                                                <Typography style={{ marginTop: '5px', color: 'black', width: "150px", overflow: 'hidden', fontSize: "12px", fontWeight: "600", textOverflow: "ellipsis", whiteSpace: 'nowrap' }}>{key.visited_data.map((key) => key.user_name.first_name + " " + " " + key.user_name.middle_name + key.user_name.last_name)
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
                                </>
                            </Box>
                            <Box marginBottom={2}>
                                <Controls.Input
                                    // name="select_the_date"
                                    label="Select the Date*"
                                    value={values.date}
                                    onChange={handleInputChange}
                                    // error={errors.select_the_date}
                                    disable={true}
                                />
                                {/* <label htmlFor="date" style={{ fontSize: '14px', color: "black", fontWeight: '600', marginBottom: "15px" }}>Select the Date*</label><br />

                                <NepaliDatePicker
                                    value={dateData}
                                    format="YYYY-MM-DD"
                                    onChange={(value) => setDateData(value)} /> */}
                            </Box>
                            <Box marginBottom={2}>
                                <Controls.Select
                                    name={`shift`}
                                    disable={false}
                                    label="Select the Shift*"
                                    value={values.shift}
                                    onChange={handleInputChange}
                                    options={shiftAllData}
                                />
                            </Box>
                            <Box marginBottom={2}>
                                <Controls.Select
                                    name={`visited_with`}
                                    disable={true}
                                    label="Select the Visited With*"
                                    value={values.visited_with}
                                    onChange={handleInputChange}
                                    options={executiveLevelOptions}
                                />
                            </Box>
                            <Stack spacing={1} direction="row">
                                <Controls.SubmitButton
                                    variant="contained"
                                    className="submit-button"
                                    onClick={(e) => onAddDcr(e)}
                                    text="Submit"
                                />
                                <Button
                                    variant="outlined"
                                    className="cancel-button"
                                    onClick={() => setIsDrawerOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </>
                    }
                    {
                        user_role === 'MPO' &&
                        <Box style={{ marginTop: "20px" }}>
                            <Button
                                variant="outlined"
                                className="cancel-button"
                                style={{ width: "100%", padding: '15px' }}
                                onClick={handleDCRForDoctor}
                            >
                                Add DCR for Doctor
                            </Button>
                            <Box style={{ marginTop: "20px" }}>
                                <Button
                                    variant="outlined"
                                    className="cancel-button"
                                    style={{ width: "100%", padding: '15px' }}
                                    onClick={handleDCRForChemist}
                                >
                                    Add DCR for Chemist
                                </Button>
                            </Box>
                            <Box style={{ marginTop: "20px" }}>
                                <Button
                                    variant="outlined"
                                    className="cancel-button"
                                    style={{ width: "100%", padding: '15px' }}
                                    onClick={handleDCRForStockist}
                                >
                                    Add DCR for Stockist
                                </Button>
                            </Box>
                        </Box>
                    }
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
            </Drawer>

        </>
    )
}

const HigherVisitedWith = ({ id }) => {
    const { data } = useGetcompanyUserRolesByIdQuery(id);
    return (
        <>
            <Typography style={{ fontSize: '12px', color: "black", fontWeight: '600' }}>{data?.user_name?.first_name + " " + data?.user_name?.middle_name + " " + data?.user_name?.last_name},</Typography>
        </>
    )
}

export default React.memo(AddDcrForHo);