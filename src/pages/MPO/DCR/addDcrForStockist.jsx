import { Box, Button, Card, Checkbox, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Typography, Autocomplete, TextField, CircularProgress } from "@mui/material";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostHigherLevelExecutiveGetDataMutation } from "@/api/CompanySlices/companyUserRoleSlice";
import { useGetShiftsQuery } from "@/api/DCRs Api Slice/TourPlanApiSlice";
import { useGetAllRewardsQuery } from "@/api/DCRs Api Slice/rewardsAPISlice";
import { useGetStockistAllDCRByIdQuery } from "@/api/DCRs Api Slice/stockistDCR/stockistDCRAllSlice";
import { useGetAllStockistsWithoutPaginationQuery } from "@/api/MPOSlices/StockistSlice";
import { useUpdateTourPlansMutation } from "@/api/MPOSlices/TourPlanSlice";
import { useGetUsersByCompanyUserByIdQuery } from "@/api/MPOSlices/UserSlice";
import {
    useAddDcrForStockistWithShiftMpoMutation, useCreateDcrForStockistWithNullValuesMutation,
    usePostToGetTheTourPlanQuery,
    useUpdateDcrForStockistMutation
} from "@/api/MPOSlices/tourPlan&Dcr";
import { useGetAllCompanyProductsWithoutPaginationQuery } from "@/api/productSlices/companyProductSlice";
import Controls from "@/reusable/forms/controls/Controls";
import { useForm } from "@/reusable/forms/useForm";
import StockistOrderedProduct from "./orderProduct/stockistOrderProduct";
import { useSelector } from 'react-redux';

const AddDCRForStockist = () => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const location = useLocation();
    const id = new URLSearchParams(location.search).get('id');

    const { data: tourplanData } = usePostToGetTheTourPlanQuery(company_user_role_id);


    const [PromotedProduct, setPromotedProduct] = useState([]);

    const handleProductChange = useCallback((event) => {
        const {
            target: { value },
        } = event;
        setPromotedProduct(
            typeof value === 'string' ? value.split(',') : value,
        );
    }, [])

    const [CompanyRoles, setCompanyRoles] = useState([]);

    //! Autocomplete

    const handleRolesChange = (event, value) => {
        const mpotparea = value.map(option => option.id)
        setCompanyRoles(mpotparea)
    }

    const [RewardOptions, setRewardsOptions] = useState([]);

    const handleRewardsChange = (event, value) => {
        const mpotparea = value.map(option => option.id)
        setRewardsOptions(mpotparea)
    }

    const { data: ShiftData } = useGetShiftsQuery();

    const shiftAllData = useMemo(() => {
        if (ShiftData !== undefined) {
            return ShiftData?.map(key => ({ id: key.id, title: key.shift }))
        }
        return [];
    }, [ShiftData])

    const companyUserArea = useGetUsersByCompanyUserByIdQuery(company_user_id, {
        skip: !company_user_id
    });

    const doctors = useGetAllStockistsWithoutPaginationQuery({ company_name: company_id, company_area: companyUserArea?.data?.company_area?.id ? companyUserArea?.data?.company_area?.id : "" },
        {
            skip: !company_id || !companyUserArea?.data?.company_area?.id
        }
    );

    const doctorOptions = useMemo(() => {
        if (doctors !== undefined) {
            if (doctors.status === 'fulfilled') {
                return doctors.data.map(key => ({ id: key.id, title: key.stockist_name.stockist_name }));
            }
        }
        return [];
    }, [doctors])

    const [initialFValues, setInitialFvalues] = useState({
        edit: false,
        tour_id: "",
        id: "",
        shift: '',
        date: "",
        visited_area: '',
        visited_stockist: '',
        expenses: '',
        expenses_name: '',
        expenses_reasoning: '',
        rewards: [],
        company_roles: [],
        company_product: [],
    })

    const dcrForDoctor = useGetStockistAllDCRByIdQuery(id);

    const [NewTourPlanData, setNewTourPlanData] = useState('');

    const selectTourPlanById = (key) => {
        setNewTourPlanData(key);
    }

    const areaOptions = useMemo(() => {
        if (NewTourPlanData !== undefined) {
            return NewTourPlanData?.mpo_area_read?.map(key => ({ id: key.company_mpo_area_id.id, title: key.company_mpo_area_id.area_name }))
        }
        return [];
    }, [NewTourPlanData])


    useEffect(() => {
        if (dcrForDoctor?.data || NewTourPlanData || companyUserArea?.data || CompanyRoles || RewardOptions) {
            // if (dcrForDoctor?.data || NewTourPlanData) {
            setInitialFvalues({
                edit: true,
                tour_id: NewTourPlanData?.id,
                id: id,
                shift: dcrForDoctor?.shift?.id,
                date: NewTourPlanData?.tour_plan?.tour_plan?.select_the_date_id,
                visited_area: dcrForDoctor?.data?.visited_area,
                visited_stockist: dcrForDoctor?.data?.visited_stockist,
                expenses: dcrForDoctor?.data?.expenses,
                expenses_name: dcrForDoctor?.data?.expenses_name,
                expenses_reasoning: dcrForDoctor?.data?.expenses_reasoning,
                rewards: RewardOptions,
                company_roles: dcrForDoctor?.data?.company_roles,
                company_product: dcrForDoctor?.data?.company_product,
            });
        }
    }, [dcrForDoctor?.data, NewTourPlanData, companyUserArea?.data]);
    // }, [dcrForDoctor?.data, NewTourPlanData]);

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

    const [executiveOptions, setExecutiveOptions] = useState([]);
    const [executiveUsers] = usePostHigherLevelExecutiveGetDataMutation();
    useEffect(() => {
        executiveUsers({ id: company_user_role_id },{
            skip:!company_user_role_id
        })
            .then(res => {
                if (res.data) {
                    const executive = [];
                    res.data.forEach(keyData => {
                        executive.push({
                            id: keyData.id,
                            title: keyData.user_name.first_name + " " + keyData.user_name.middle_name + " " + keyData.user_name.last_name,
                        });
                    });
                    setExecutiveOptions(executive);
                }
            })
            .catch(err => {

            });
    }, [company_user_role_id]);

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
                    title: key.product_name.product_name,
                })
                );
            }
        }
        return [];
    }, [companyProduct])

    const [updateDcr] = useUpdateDcrForStockistMutation();
    const [createMpoDcr] = useAddDcrForStockistWithShiftMpoMutation();
    const [DcrForStockist] = useCreateDcrForStockistWithNullValuesMutation()
    const [updateTourplan] = useUpdateTourPlansMutation();
    const [LastData, setLastData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });
    const navigate = useNavigate();

    const handlePostDcr = () => {
        setLoading(true)
        let sendingData = { ...values };
        if (id) {
            sendingData['id'] = id;
            if (sendingData['company_product']) {
                let companyProduct = sendingData['company_product'];
                sendingData['company_product'] = [];
                companyProduct.map(key => {
                    sendingData['company_product'].push({ id: key });
                });
            } else {
                sendingData['company_product'] = [];
            }
            if (sendingData['rewards']) {
                let rewards = RewardOptions;

                sendingData['rewards'] = [];
                rewards.map(key => {
                    sendingData['rewards'].push({ id: key });
                });
            } else {
                sendingData['rewards'] = [];
            }
            if (sendingData['company_roles']) {
                let companyRoles = CompanyRoles;
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
                sendingData['visited_stockist']
            ) {
                sendingData['visited_area'] = sendingData['visited_area'];
                sendingData['shift'] = values.shift;
                sendingData['visited_stockist'] = sendingData['visited_stockist'];
            } else {
                sendingData['visited_area'] = null;
                sendingData['visited_doctor'] = null;
                sendingData['shift'] = null;
            }
            updateDcr({ id: id, value: sendingData })
                .then((res) => {
                    if (res.data) {
                        if (LastData === true) {
                            updateTourplan({
                                id: values.tour_id,
                                value: { is_stockist_dcr_added: true },
                            })
                                .then(res => {
                                    if (res.data) {
                                        setSuccessMessage({ show: true, message: 'All DCR Successfully Added.' });
                                        setTimeout(() => {
                                            setSuccessMessage({ show: false, message: '' });
                                            navigate('/dashboard/admin/dcr');
                                        }, 2000);
                                    }
                                })
                                .catch(err => {

                                })
                                .finally(() => {
                                    setLoading(false)
                                })
                        } else {
                            DcrForStockist()
                                .then((res) => {
                                    if (res.data) {
                                        setSuccessMessage({ show: true, message: 'Dcr Added Successfully. Add Another Dcr.' });
                                        setTimeout(() => {
                                            setSuccessMessage({ show: false, message: '' });
                                            navigate(`/dashboard/admin/dcr/for/stockist?id=${res.data.id}`)
                                        }, 2000);
                                    }
                                })
                        }
                        // createMpoDcr({
                        //     mpo_name: company_user_id,
                        //     dcr_id: id,
                        //     shift: values.shift,
                        // })
                        //     .then((res) => {
                        //         if (res.data) {

                        //         } else {
                        //             setErrorMessage({ show: true, message: 'This TP is not allowed to create DCR.' });
                        //             setTimeout(() => {
                        //                 setErrorMessage({ show: false, message: '' });
                        //             }, 2000);
                        //         }
                        //     })
                        //     .catch(err => {
                        //         setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                        //         setTimeout(() => {
                        //             setErrorMessage({ show: false, message: '' });
                        //         }, 2000);
                        //     })
                        //     .finally(() => {
                        //         setLoading(false)
                        //     })
                    } else {
                        setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
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
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    return (
        <Box style={{ padding: "10px" }}>
            <Typography style={{ fontWeight: '600', fontSize: '18px' }}>
                Add Dcr For Stockist
            </Typography>
            <Box style={{ marginTop: "20px" }}>
                <Grid container spacing={2}>
                    <Grid item md={4} xs={12}>
                        <Card style={{ height: "393px" }}>
                            <Box style={{ padding: "15px" }}>
                                <Typography style={{ color: "black", fontSize: '15px', fontWeight: "600" }}>Select Tour Plan*</Typography>
                                <Box style={{ marginTop: "15px" }}>
                                    {
                                        tourplanData !== undefined ?
                                            <>
                                                {
                                                    tourplanData.length !== 0 ?
                                                        <Box style={{ marginBottom: '20px' }}>

                                                            <Box style={{ width: "100%", overflowX: "auto", whiteSpace: 'nowrap', cursor: "pointer" }}>
                                                                {
                                                                    tourplanData.map((key, index) => (
                                                                        <Box style={{ width: '220px', display: "inline-block", marginRight: "10px" }} key={index} onClick={(e) => selectTourPlanById(key)}>
                                                                            <Box style={{ borderRadius: '5px', border: '1.2px solid #dbe0e4', padding: "5px", paddingTop: "10px", paddingLeft: "10px", paddingRight: '10px' }}>
                                                                                <Grid container spacing={2}>
                                                                                    <Grid item xs={3.5}>
                                                                                        <Box style={{ padding: '5px', textAlign: 'center', border: '1.2px solid #2d8960', borderRadius: "5px", marginTop: '11px', marginBottom: "11px" }}>
                                                                                            <Typography style={{ fontSize: "16px", color: 'black', fontWeight: '600' }}>{key.tour_plan.tour_plan.select_the_date_id.slice(8)}</Typography>
                                                                                            {/* <Typography style={{ fontSize: '13px', color: "black", marginTop: "-5px" }}>{key.tour_plan.tour_plan.select_the_month}</Typography> */}
                                                                                        </Box>
                                                                                    </Grid>
                                                                                    <Grid item xs={8.5}>
                                                                                        <Box >
                                                                                            <span style={{ backgroundColor: "#2d8960", padding: "4px", fontSize: "12px", color: "white", borderRadius: '15px', fontWeight: '600', paddingLeft: "10px", paddingRight: "10px" }}>
                                                                                                {key.tour_plan.tour_plan.select_the_month}
                                                                                            </span>
                                                                                            <Typography style={{ marginTop: '5px', color: 'black', width: "150px", overflow: 'hidden', fontSize: "12px", fontWeight: "600", textOverflow: "ellipsis", whiteSpace: 'nowrap' }}>{key.mpo_area_read.map((key) => key.company_mpo_area_id.area_name)
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
                                            // error={errors.select_the_date}
                                            // className={"drawer-first-name-input"}
                                            disable={true}
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
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Card style={{ height: "393px" }}>
                            <Box style={{ padding: "15px" }}>
                                <Typography style={{ color: "black", fontSize: '15px', fontWeight: "600" }}>Visited Stcokist & Product Promotion*</Typography>
                                <Box style={{ marginTop: "15px" }}>
                                    <Box marginBottom={2}>
                                        <Controls.Select
                                            name={`visited_stockist`}
                                            disable={false}
                                            label="Select the Visited Stockist*"
                                            value={values.visited_stockist}
                                            onChange={handleInputChange}
                                            options={doctorOptions}
                                        />
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
                                                {executiveOptions.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl> */}

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
                                    </Box>
                                    {/* <Box marginBottom={2}>
                                        <FormControl sx={{ m: 1, width: 300 }}>
                                            <InputLabel>{"Select the Promoted Product*"}</InputLabel>
                                            <Select
                                                labelId="demo-multiple-name-label"
                                                id="demo-multiple-name"
                                                multiple
                                                value={PromotedProduct}
                                                onChange={handleProductChange}
                                                input={<OutlinedInput label="Select the Promoted Product*" />}
                                                // MenuProps={MenuProps}
                                                sx={{ width: '100%' }}
                                                style={{
                                                    borderBlockColor: "white",
                                                    width: "100%",
                                                    textAlign: 'start'
                                                }}
                                            >
                                                {productOptions.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box> */}
                                    <Box marginBottom={2}>
                                        {/* <FormControl sx={{ m: 1, width: 300 }}>
                                            <InputLabel>{"Select the Rewards*"}</InputLabel>
                                            <Select
                                                labelId="demo-multiple-name-label"
                                                id="demo-multiple-name"
                                                multiple
                                                value={RewardOptions}
                                                onChange={handleRewardsChange}
                                                input={<OutlinedInput label="Select the Rewards*" />}
                                                // MenuProps={MenuProps}
                                                sx={{ width: '100%' }}
                                                style={{
                                                    borderBlockColor: "white",
                                                    width: "100%",
                                                    textAlign: 'start'
                                                }}
                                            >
                                                {rewardsOptions.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl> */}
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
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Card style={{ height: "393px" }}>
                            <Box style={{ padding: "15px" }}>
                                <Typography style={{ color: "black", fontSize: '15px', fontWeight: "600" }}>Ordered Product & Expenses</Typography>
                                <Box style={{ marginTop: "15px" }}>
                                    <Box marginBottom={2}>
                                        <StockistOrderedProduct id={id} />
                                    </Box>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name="expenses_name"
                                            label="Expenses Name"
                                            value={values.expenses_name}
                                            onChange={handleInputChange}
                                            // error={errors.select_the_date}
                                            // className={"drawer-first-name-input"}
                                            disable={false}
                                        />
                                    </Box>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name="expenses"
                                            label="Expenses"
                                            value={values.expenses}
                                            onChange={handleInputChange}
                                            // error={errors.select_the_date}
                                            // className={"drawer-first-name-input"}
                                            disable={false}
                                        />
                                    </Box>
                                    <Box marginBottom={2}>
                                        <Controls.Input
                                            name="expenses_reasoning"
                                            label="Expenses Resoning*"
                                            value={values.expenses_reasoning}
                                            onChange={handleInputChange}
                                            // error={errors.select_the_date}
                                            // className={"drawer-first-name-input"}
                                            disable={false}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
                <Box style={{ marginTop: '15px' }}>
                    <Checkbox name="remember" label="Remember me" checked={LastData} onChange={(e) => setLastData(e.target.checked)} />
                    <label style={{ textAlign: 'start', flex: 1, fontWeight: "600", marginLeft: "4px", fontSize: "14px" }}>Last DCR for Stockist</label>
                </Box>
                <Box style={{ marginTop: "10px" }}>
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


export default React.memo(AddDCRForStockist);