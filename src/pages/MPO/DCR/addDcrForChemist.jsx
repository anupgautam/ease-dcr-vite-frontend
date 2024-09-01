import { Box, Button, Card, Checkbox, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Autocomplete, TextField, CircularProgress } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostHigherLevelExecutiveGetDataMutation } from "@/api/CompanySlices/companyUserRoleSlice";
import { useGetShiftsQuery } from "@/api/DCRs Api Slice/TourPlanApiSlice";
import { useGetAllRewardsQuery } from "@/api/DCRs Api Slice/rewardsAPISlice";
import { useUpdateTourPlansMutation } from "@/api/DCRs Api Slice/TourPlanApiSlice";
import { useGetAllVisitedMpoWiseChemistQuery } from "@/api/MPOSlices/doctorApiSlice";
import { useGetChemistsByIdQuery } from "@/api/MPOSlices/chemistApiSlice";
import {
    useCreateDcrForChemistWithNullValuesMutation,
    useCreateMpoShiftWiseDcrForChemistMutation,
    usePostToGetTheTourPlanQuery,
    useUpdateDcrForChemistValuesMutation
} from "@/api/MPOSlices/tourPlan&Dcr";
import { useGetAllCompanyProductsWithoutPaginationQuery } from "@/api/productSlices/companyProductSlice";
import Controls from "@/reusable/forms/controls/Controls";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import { useForm } from "@/reusable/forms/useForm";
import { UserListHead } from "@/sections/@dashboard/user";

import { useGetChemistAllDCRByIdQuery } from "@/api/DCRs Api Slice/chemistDCR/ChemistDCRAllSlice";
import ChemistOrderProduct from "./orderProduct/chemistOrderProduct";
import { useSelector } from 'react-redux';

const TABLE_HEAD = [
    { id: 'chemist_name', label: ' Name', alignRight: false },
    { id: 'select_the_ordered_product', label: 'Select Ordered Product', alignRight: false },
    { id: 'promoted_product', label: 'Promoted Product', alignRight: false },
    { id: 'rewards', label: 'Rewards', alignRight: false },
    { id: 'ordered_product', label: 'Ordered Products', alignRight: false },
    { id: 'expenses_name', label: 'Expenses Name', alignRight: false },
    { id: 'expenses', label: 'Expense Cost', alignRight: false },
    { id: 'expenses_resoning', label: 'Expenses Resoning', alignRight: false },
];

//! Add DCR For Chemist Component
const AddDCRforChemist = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const location = useLocation();
    const id = new URLSearchParams(window.location.search).get('id');
    // 

    const { data: tourplanData } = usePostToGetTheTourPlanQuery(company_user_id);
    const [updateDcr] = useUpdateDcrForChemistValuesMutation();
    const [createMpoDcr] = useCreateMpoShiftWiseDcrForChemistMutation();
    const [DcrForChemist] = useCreateDcrForChemistWithNullValuesMutation();
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

    const [CompanyChemist, setCompanyChemist] = useState([]);
    const [ChemistData, setChemistData] = useState([]);

    useEffect(() => {
        setChemistData([]);

        CompanyChemist.map(chemistId => {
            createNullValuesForChemist(chemistId);
        });
    }, [CompanyChemist]);

    const createNullValuesForChemist = async (chemistId) => {
        if (chemistId) {
            try {
                const response = await DcrForChemist();
                if (response.data) {
                    const newData = { chemist_id: chemistId, dcr_id: response.data.id };
                    const isDuplicate = ChemistData.some(item => item.chemist_id === newData.chemist_id && item.dcr_id === newData.dcr_id);
                    if (!isDuplicate) {
                        setChemistData(prevData => [...prevData, newData]);
                    }
                }
            } catch (error) {
                console.error('Error creating null values for chemist:', error);
            }
        }
    }

    const handleChemistChange = (event, value) => {
        const mpotparea = value.map(option => option.id)
        setCompanyChemist(mpotparea)
        const removedChemistIds = CompanyChemist.filter(chemistId => !value.includes(chemistId));
        setChemistData(prevData => prevData.filter(item => !removedChemistIds.includes(item.chemist_id)));
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

    const [initialFValues, setInitialFvalues] = useState({
        edit: false,
        tour_id: "",
        id: "",
        shift: '',
        date: "",
        visited_area: '',
        visited_chemist: '',
        expenses: '',
        order_product: '',
        expenses_name: '',
        expenses_reasoning: '',
        company_product: [],
        rewards: [],
        company_roles: [],
        ordered_products: [],
        context: {
            request: 'PATCH',
            company_product: 'select',
            company_roles: 'select',
            ordered_products: 'normal',
            rewards: 'select',
        },
    })
    const dcrForChemist = useGetChemistAllDCRByIdQuery(id);

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
        if (dcrForChemist?.data || NewTourPlanData || RewardOptions || PromotedProduct || CompanyRoles) {
            setInitialFvalues({
                edit: true,
                tour_id: NewTourPlanData?.id,
                id: id,
                shift: "",
                company_roles: dcrForChemist?.data?.visited_with,
                date: NewTourPlanData?.tour_plan?.tour_plan?.select_the_date_id,
                visited_area: "",
                visited_doctor: dcrForChemist?.data?.visited_doctor,
                expenses: dcrForChemist?.data?.expenses,
                expenses_name: dcrForChemist?.data?.expenses_name,
                expenses_reasoning: dcrForChemist?.data?.expenses_reasoning,
            });
        }
    }, [dcrForChemist?.data, NewTourPlanData]);

    // 
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


    const chemists = useGetAllVisitedMpoWiseChemistQuery({ company_name: company_id, mpo_area: values.visited_area, mpo_name: company_user_id });

    const chemistOptions = useMemo(() => {
        if (chemists !== undefined) {
            if (chemists.status === 'fulfilled') {
                return chemists?.data.map(key => ({ id: key.id, title: key.chemist_name.chemist_name }))
            }
        }
        return [];
    }, [chemists])

    const [executiveOptions, setExecutiveOptions] = useState([]);
    const [executiveUsers] = usePostHigherLevelExecutiveGetDataMutation();
    useEffect(() => {
        executiveUsers({ id: company_user_id })
            .then(res => {
                if (res.data) {
                    const executive = [];
                    res.data.forEach(keyData => {
                        executive.push({
                            id: keyData.id,
                            title: keyData.user_name.email,
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
        if (companyProduct.status === 'fulfilled') {
            return companyProduct.data.map(key =>
            ({
                id: key.id,
                title: key.product_name.product_name,
            })
            );
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
                if (sendingData['company_product']) {
                    let companyProduct = allData.company_product;
                    sendingData['company_product'] = [];
                    companyProduct.map(key => {
                        sendingData['company_product'].push({ id: key });
                    });
                } else {
                    sendingData['company_product'] = [];
                }
                let ordered_products = sendingData?.Formdata?.ordered_products;
                if (ordered_products.length !== 0) {
                    sendingData['ordered_products'] = ordered_products;
                } else {
                    sendingData['ordered_products'] = [];
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
                    let companyRoles = allData.visited_with;
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
                    sendingData['visited_chemist'] ||
                    sendingData['date']
                ) {
                    sendingData['visited_area'] = sendingData['visited_area'];
                    sendingData['shift'] = allData.shift;
                    sendingData['visited_chemist'] = sendingData['visited_chemist'];
                    sendingData['expenses'] = sendingData?.Formdata?.expenses;
                    sendingData['expenses_name'] = sendingData?.Formdata?.expenses_name;
                    sendingData['expenses_reasoning'] = sendingData?.Formdata?.expenses_reasoning;
                    sendingData['date'] = allData.date;
                } else {
                    sendingData['visited_area'] = null;
                    sendingData['visited_chemist'] = null;
                    sendingData['shift'] = null;
                }
                const mpoShiftData = {
                    mpo_name: company_user_id,
                    shift: allData.shift,
                    dcr_id: allData.id,
                };
                updateDcr({ id: allData.id, value: sendingData })
                    .then(res => {
                        if (res.data) {
                            createMpoDcr(mpoShiftData)
                                .then(res => {
                                    if (res.data) {
                                        if (LastData === true) {
                                            setSuccessMessage({ show: true, message: 'All DCR Successfully Added.' });
                                            setTimeout(() => {
                                                setSuccessMessage({ show: false, message: '' });
                                                navigate('/dashboard/admin/dcr');
                                            }, 2000);
                                        } else {
                                            setSuccessMessage({ show: true, message: 'DCR Added Successfully Added.' });
                                            setTimeout(() => {
                                                setSuccessMessage({ show: false, message: '' });
                                            }, 2000);
                                        }
                                    }
                                })
                                .catch(err => {

                                })
                                .finally(() => {
                                    setLoading(false)
                                })

                        } else {
                            setErrorMessage({ show: true, message: 'This TP is not allowed to create DCR.' });
                            setTimeout(() => {
                                setErrorMessage({ show: false, message: '' });
                            }, 2000);
                        }
                    })
                    .catch(err => {
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
    }

    return (
        <Box style={{ padding: "10px" }}>
            <Typography style={{ fontWeight: '600', fontSize: '18px' }}>
                Add Dcr For Chemist
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
                                            label="Select the Date*"
                                            value={values.date}
                                            onChange={handleInputChange}
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
                                    <Box marginBottom={2}>
                                        <Autocomplete
                                            multiple
                                            options={chemistOptions}
                                            getOptionLabel={(option) => option.title}
                                            onChange={handleChemistChange}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Select Chemists" />
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
                                                    ChemistData.map((key, index) => (
                                                        <TableRow key={index}>
                                                            <ChemistDcr sn={index} data={key} values={values} setAllMutipleData={setAllMutipleData} AllMutipleData={AllMutipleData} />
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
                    <label style={{ textAlign: 'start', flex: 1, fontWeight: "600", marginLeft: "4px", fontSize: "14px" }}>Last DCR for Chemist</label>
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

//! Chemist DCR
const ChemistDcr = ({ sn, data, setAllMutipleData, AllMutipleData, values, id }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const Chemist = useGetChemistsByIdQuery(data.chemist_id);
    const [executiveOptions, setExecutiveOptions] = useState([]);
    const [executiveUsers] = usePostHigherLevelExecutiveGetDataMutation();
    useEffect(() => {
        executiveUsers({ id: company_user_id })
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
    }, [company_user_id]);

    const [CompanyRoles, setCompanyRoles] = useState([]);
    const handleRolesChange = (event, value) => {
        const mpotparea = value.map(option => option.id)
        setCompanyRoles(mpotparea)
    }

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
                return rewards.data.map(key => ({ id: key.id, title: key.reward }));
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
        ordered_products: [],
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
                visited_chemist: data.chemist_id,
                Formdata,
                rewards: RewardOptions,
                company_roles: CompanyRoles,
                company_product: PromotedProduct,
                context: {
                    request: 'PATCH',
                    company_product: 'select',
                    company_roles: 'select',
                    ordered_products: 'normal',
                    rewards: 'select',
                },
            };
            return updatedData;
        });
    }, [Formdata, RewardOptions, CompanyRoles, PromotedProduct])

    //! Ordered Product
    const [OrderProduct, setOrderedProduct] = useState([]);

    const handleOrderedProducts = (e) => {
        setOrderedProduct(e.target.value);
        if (!Formdata.ordered_products.includes(e.target.value)) {
            setFormData(prevFormdata => ({
                ...prevFormdata,
                ordered_products: e.target.value.map((key) => ({
                    id: key
                })),
            }));
        }
    };

    return (
        <>
            <TableCell style={{ width: "50px" }}>{sn + 1}</TableCell>
            <TableCell style={{ width: "200px" }}>{Chemist?.data?.chemist_name.chemist_name}</TableCell>
            <TableCell align="left" style={{ width: "300px" }}>
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
                {/* //! Chemist Ordered Product */}
                <ChemistOrderProduct id={id} data={OrderProduct} allData={AllMutipleData[sn]} handleOrderProductChange={handleOrderedProducts} />
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
                    label="Expenses"
                    value={Formdata.expenses || ""}
                    onChange={handleInputChange}
                    disable={false}
                />
            </TableCell>
            <TableCell align="left">
                <Controls.Input
                    name="expenses_reasoning"
                    label="Expenses Resoning*"
                    value={Formdata.expenses_reasoning || ""}
                    onChange={handleInputChange}
                    disable={false}
                />
            </TableCell>
        </>
    )
}


export default React.memo(AddDCRforChemist);