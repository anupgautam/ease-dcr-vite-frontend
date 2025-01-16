import React, { useEffect, useState, useMemo } from 'react'
import {
    Box,
    Grid,
    Typography,
    CircularProgress,
    Autocomplete,
    TextField,
    Stack,
    Button
} from '@mui/material'
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import 'react-datepicker/dist/react-datepicker.css';

//! Reusable Component
import { useForm, Form } from '../../../../reusable/forms/useForm'
import Controls from '../../../../reusable/components/forms/controls/Controls';
import { usePostHigherLevelExecutiveGetDataMutation } from "@/api/CompanySlices/companyUserRoleSlice";

//! Api Slices 
import {
    useGetStockistAllDCRByIdQuery,
    useGetStockistDcrByIdQuery,
    useUpdateStockistsAllDCRMutation,
} from '@/api/DCRs Api Slice/stockistDCR/stockistDCRAllSlice';
import editWithoutImage from '@/reusable/components/forms/utils/editUtils/editWithoutImage';
import useDebounce from '@/reusable/components/forms/utils/debounce';
import {
    useUpdateShiftWiseStockistDCRMutation,
    useGetShiftWiseStockistDCRByDCRIdQuery
} from '@/api/DCRs Api Slice/stockistDCR/shiftWiseStockistDCRSlice';

import EditDCRStockistRewards from '../EditDCRPackages/EditDCRStockistRewards';
import EditStockistDCRRoles from '../EditDCRPackages/EditStockistDCRRoles';
import EditStockistDCRProducts from '../EditDCRPackages/EditStockistDCRProducts';
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice';
import { useGetAllStockistsWithoutPaginationQuery } from '@/api/MPOSlices/StockistSlice';
import { useGetUsersByIdQuery } from '@/api/MPOSlices/UserSlice';
import { useSelector } from 'react-redux';
import {
    useGetAllRewardsByCompanyIdQuery,
} from "@/api/DCRs Api Slice/rewardsAPISlice"
import EditStockistOrderProduct from '../orderProduct/EditStockistOrderProduct';

const EditStockistDCR = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const [noLoop, setNoLoop] = useState(true);
    const [initialShift, setInitialShift] = useState("");
    // const areas = useSelector(state => state.dcrData.company_areas);
    // const stockists = useSelector(state => state.dcrData.visited_stockist);

    //! Stockist Ordered Product
    const id = new URLSearchParams(window.location.search).get('id');

    const [Formdata, setFormData] = useState({
        expenses_name: "",
        expenses: "",
        expenses_reasoning: "",
        ordered_products: [],
    })

    const handleChemistOrderChange = (event) => {
        const { name, value } = event.target;
        const newData = { ...Formdata, [name]: value };
        setFormData(newData);
    }

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

    const shifts = useSelector(state => state.dcrData.shifts);
    const mpo_id = useSelector(state => state.dcrData.selected_user);
    const context = { 'company_roles': 'select', 'rewards': 'select' }
    const [dateData, setDateData] = useState()

    const shiftWiseDCR = useGetShiftWiseStockistDCRByDCRIdQuery(idharu);


    const MpoArea = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });

    const areas = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map((key) => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [MpoArea])


    const [updateShiftWiseDCR] = useUpdateShiftWiseStockistDCRMutation();


    //! Getting TourPlan by ID

    const DCRAll = useGetStockistDcrByIdQuery(idharu);

    const { data: mpoArea } = useGetUsersByIdQuery(mpo_id, {
        skip: !mpo_id
    });

    const { data: StockistData } = useGetAllStockistsWithoutPaginationQuery({ company_name: company_id, company_area: mpoArea?.company_area?.id ? mpoArea?.company_area?.id : "" }, {
        skip: !company_id
    })

    const stockists = useMemo(() => {
        if (StockistData !== undefined) {
            return StockistData.map((key) => ({
                id: key.id,
                title: key?.stockist_name?.stockist_name
            }))
        }
        return []
    }, [StockistData])

    //! Rewards Options
    const { data: rewardAllData } = useGetAllRewardsByCompanyIdQuery(company_id);

    const rewardsOptions = useMemo(() => {
        if (rewardAllData) {
            return rewardAllData?.map(key => ({ id: key.id, title: key.reward }));
        }
        return [];
    }, [rewardAllData]);

    const [multipleRewards, setMultipleRewards] = useState([])
    const handleMultipleRewards = (e, value) => {
        setMultipleRewards(value);
    }

    //! Visited With Options
    const [executiveOptions, setExecutiveOptions] = useState([]);
    const [executiveUsers] = usePostHigherLevelExecutiveGetDataMutation();
    useEffect(() => {
        executiveUsers({ id: DCRAll?.data?.mpo_name?.id }, {
            skip: !DCRAll?.data?.mpo_name?.id
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
                console.log(err)
            });
    }, [DCRAll?.data?.mpo_name?.id]);

    const [multipleVisitedWith, setMultipleVisitedWith] = useState([])
    const handleMultipleVisitedWith = (e, value) => {
        setMultipleVisitedWith(value);
    }

    const [initialFValues, setInitialFValues] = useState({
        edit: false,
        date: "",
        visited_area: "",
        visited_stockist: "",
        expenses_name: "",
        expenses: "",
        expenses_reasoning: "",
        rewards: [],
        company_roles: [],
    });

    console.log(DCRAll?.data?.visited_with)

    useEffect(() => {
        if (DCRAll?.data) {

            //! Initial Rewards 
            const selectedRewards = DCRAll?.data?.rewards?.map(visited => ({
                id: visited.id, title: visited.rewards
            })) || []

            //! Initial Promoted Products 
            const selectedVisitedWith = DCRAll?.data?.visited_with?.map(visited => ({
                id: visited.id, title: `${visited.user_name?.first_name} ${visited.user_name?.middle_name} ${visited.user_name?.last_name}`
            })) || []

            setInitialFValues({
                edit: true,
                date: DCRAll?.data?.dcr?.date,
                visited_area: DCRAll?.data?.visited_area?.id,
                visited_stockist: DCRAll?.data?.dcr?.visited_stockist?.stockist_name?.id,
                expenses_name: DCRAll?.data?.dcr?.expenses_name,
                expenses: DCRAll?.data?.dcr?.expenses,
                expenses_reasoning: DCRAll?.data?.dcr?.expenses_reasoning,
                rewards: DCRAll?.data?.rewards,
                company_roles: DCRAll?.data?.company_roles
            });
            setDateData(DCRAll?.data?.dcr?.date);
            setMultipleRewards(selectedRewards)
            setMultipleVisitedWith(selectedVisitedWith)

        }
        if (shiftWiseDCR.status == "fulfilled") {
            setInitialShift(shiftWiseDCR?.data?.results[0]?.shift.id)
        }
    }, [DCRAll?.data, shiftWiseDCR])

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
    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Edit tourplan

    const [updateDCRAll] = useUpdateStockistsAllDCRMutation();

    // useEffect(() => {
    //     if (DCRAll.data) {
    //         editWithoutImage(noLoop, setNoLoop, updateDCRAll, values, idharu, context);
    //     }
    // }, [
    //     values.date,
    //     values.visited_area,
    //     values.visited_stockist,
    //     useDebounce(values.expenses_name, 3000),
    //     useDebounce(values.expenses, 3000),
    //     useDebounce(values.expenses_reasoning, 3000),
    //     values.rewards,
    //     values.company_roles
    // ]);
    // const changeShift = (e) => {
    //     const form = new FormData();
    //     form.append('id', shiftWiseDCR?.data?.results[0]?.id)
    //     form.append('shift', e.target.value);
    //     form.append('dcr_id', idharu);
    //     form.append('mpo_name', mpo_id);
    //     updateShiftWiseDCR(form);
    // }

    // const handleInputChangeLoop = (e) => {

    //     if (!noLoop) {
    //         setNoLoop(true)
    //         handleInputChange(e);

    //     }
    //     else {
    //         handleInputChange(e);
    //     }
    // }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = {
            id: values.id,
            date: values.date,
            expenses: values.expenses,
            expenses_name: values.expenses_name,
            expenses_reasoning: values.expenses_reasoning,

            // company_product: multipleProducts.map(key => key.id),
            rewards: multipleRewards.map(key => key.id),
            company_roles: multipleVisitedWith.map(key => key.id),
            // ordered_products: multipleOrderedProducts.map(key => key.id),

            mpo_name: values.mpo_name,
            shift: values.shift,
            visited_area: values.visited_area,
            visited_doctor: values.visited_doctor,
            year: values.year,
            month: values.month,
            visited_stockist: values.visited_stockist
        }
        try {
            const response = await updateDCRAll(data)
            if (response?.data) {
                toast.success(`${response?.data?.message}`)
                // setIsButtonDisabled(true)
                setLoading(false);
                onClose();
            } else if (response?.error) {
                toast.error(`${response?.error?.data?.message}`)
                setLoading(false);
            } else {
                toast.error(`Some Error Occured`)
            }
        }
        catch (error) {
            console.log(error)
            toast.error('Backend Error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
                padding="16px"
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        width="400px"
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: "40px" }}
                    >

                        <Typography variant="h6" className="drawer-box-text">

                            <IconButton
                                className="close-button"
                                onClick={onClose}
                            >
                                <Close />
                            </IconButton>
                            <Typography variant="h6">
                                Edit Stockist DCR
                            </Typography>
                        </Typography>
                    </Box>

                    <Form>
                        <Box marginBottom={2}>
                            {/* <InputLabel style={{ fontSize: '15px', color: 'black', marginBottom: "12px" }}>{"Date*"}</InputLabel>
                            <Controls.DatePicker
                                name="date"
                                showIcon
                                date={values.date ? values.date : new Date()}
                                onChange={handleInputChange}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select the Date"
                            /> */}
                            <Controls.Input
                                disabled={true}
                                name="date"
                                // label=""
                                value={dateData}
                                onChange={(e) => handleInputChangeLoop(e)}
                                // options={userList}
                                error={errors.date}
                            // className={"drawer-first-name-input"}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="visited_area"
                                label="Visited Area"
                                value={values.visited_area}
                                onChange={(e) => handleInputChangeLoop(e)}
                                options={areas}
                                disabled
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="shifts"
                                label="Shift*"
                                value={initialShift}
                                onChange={(e) => changeShift(e)}
                                options={shifts}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="visited_stockist"
                                label="Visited Stockist*"
                                value={values.visited_stockist}
                                onChange={(e) => handleInputChangeLoop(e)}
                                options={stockists}
                            />
                        </Box>
                        {/* //! Multiple Visited With  */}
                        <Box marginBottom={2}>
                            <Autocomplete
                                multiple
                                value={multipleVisitedWith || []}
                                options={executiveOptions}
                                getOptionLabel={(option) => option.title}
                                onChange={handleMultipleVisitedWith}
                                renderInput={(params) => (
                                    <TextField {...params} label="Visited With" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                )}
                            />
                        </Box>
                        {/* //! Multiple Rewards  */}
                        <Box marginBottom={2}>
                            <Autocomplete
                                multiple
                                value={multipleRewards || []}
                                options={rewardsOptions}
                                getOptionLabel={(option) => option.title}
                                onChange={handleMultipleRewards}
                                renderInput={(params) => (
                                    <TextField {...params} label="Rewards" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                )}
                            />
                        </Box>
                        {/*//! Order Product   */}
                        <Box marginBottom={2}>
                            <EditStockistOrderProduct
                                id={id}
                                data={OrderProduct}
                                allData={DCRAll}
                                handleOrderProductChange={handleOrderedProducts}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Input
                                name="expenses"
                                label="Expenses*"
                                value={values.expenses}
                                onChange={(e) => handleInputChangeLoop(e)}
                            />
                        </Box>

                        <Box marginBottom={2}>
                            <Controls.Input
                                name="expenses_name"
                                label="Expenses Name*"
                                value={values.expenses_name}
                                onChange={(e) => handleInputChangeLoop(e)}
                            />
                        </Box>

                        <Box marginBottom={2}>
                            <Controls.Input
                                name="expenses_reasoning"
                                label="Expenses Reasoning*"
                                value={values.expenses_reasoning}
                                onChange={(e) => handleInputChangeLoop(e)}
                            />
                        </Box>


                        {/* <Box marginBottom={2}>
                            <EditStockistDCRRoles
                                name="company_roles"
                                value={values.company_roles}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                context={context}
                                editApi={useUpdateStockistsAllDCRMutation} />
                        </Box> */}


                        <Stack spacing={1} direction="row">
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                // disabled={isButtonDisabled}
                                onClick={(e) => handleSubmit(e)}
                                text="Submit"
                            />
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
    );
};

export default React.memo(EditStockistDCR);