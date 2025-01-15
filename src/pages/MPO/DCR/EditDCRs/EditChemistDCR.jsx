import React, { useEffect, useState, useMemo } from 'react'
import {
    Box, Grid,
    Typography, CircularProgress,
    Autocomplete,
    TextField,
    Stack,
    Button
} from '@mui/material'
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import 'react-datepicker/dist/react-datepicker.css';
import { usePostHigherLevelExecutiveGetDataMutation } from "@/api/CompanySlices/companyUserRoleSlice";
import { useGetAllProductsOptionsWithDivisionQuery } from "@/api/MPOSlices/productApiSlice";

//! Reusable Component
import { useForm, Form } from '../../../../reusable/forms/useForm'
import Controls from '../../../../reusable/components/forms/controls/Controls';
//! Api Slices 
import {
    useGetChemistAllDCRByIdForMpoIdQuery,
    useGetChemistAllDCRByIdQuery,
    useUpdateChemistsAllDCRMutation
} from '@/api/DCRs Api Slice/chemistDCR/ChemistDCRAllSlice';
import editWithoutImage from '@/reusable/components/forms/utils/editUtils/editWithoutImage';
import useDebounce from '@/reusable/components/forms/utils/debounce';

import EditChemistDCRProducts from '../EditDCRPackages/EditChemistDCRProducts';
import EditChemistDCRRoles from '../EditDCRPackages/EditChemistDCRRoles';
import EditDCRChemistRewards from '../EditDCRPackages/EditDCRChemistRewards';
import EditChemistDCROrderedProducts from '../EditDCRPackages/EditChemistDCROrderedProducts';

import { useSelector } from 'react-redux';
import {
    useUpdateShiftWiseChemistDCRMutation,
    useGetShiftWiseChemistDCRByDCRIdQuery
} from '@/api/DCRs Api Slice/chemistDCR/shiftWiseChemistDCRSlice';
import { useGetMpoAreaQuery } from '@/api/MPOSlices/TourPlanSlice';
import { useGetAllVisitedMpoWiseChemistQuery } from '@/api/MPOSlices/doctorApiSlice';
import { toast } from 'react-toastify';
import { useGetAllCompanyProductsWithoutPaginationQuery } from "@/api/productSlices/companyProductSlice";
import {
    useGetAllRewardsByCompanyIdQuery,
} from "@/api/DCRs Api Slice/rewardsAPISlice"
import ChemistOrderProduct from '../orderProduct/chemistOrderProduct';
import EditChemistOrderProduct from '../orderProduct/EditChemistOrderProduct';

const EditChemistDCR = ({ idharu, onClose }) => {

    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    //! Chemist Ordered Product
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



    const [noLoop, setNoLoop] = useState(true);
    const [initialShift, setInitialShift] = useState("");
    // const areas = useSelector(state => state.dcrData.company_areas);
    // const chemists = useSelector(state => state.dcrData.visited_chemist);
    const shifts = useSelector(state => state.dcrData.shifts);
    const mpo_id = useSelector(state => state.dcrData.selected_user);
    const context = { 'company_product': 'select', 'company_roles': 'select', 'rewards': 'select', 'ordered_products': 'select' }
    const shiftWiseDCR = useGetShiftWiseChemistDCRByDCRIdQuery(idharu);
    const [updateShiftWiseDCR] = useUpdateShiftWiseChemistDCRMutation();
    const [dateData, setDateData] = useState()

    //! Getting TourPlan by ID
    const DCRAll = useGetChemistAllDCRByIdQuery(idharu, {
        skip: !idharu
    });

    //! Promoted Products wala 
    const { data: productData } = useGetAllCompanyProductsWithoutPaginationQuery(company_id, {
        skip: !company_id
    });

    const promotedArray = useMemo(() => {
        if (productData) {
            return productData?.map(key => ({ id: key.id, title: key.product_name?.product_name }));
        }
        return [];
    }, [productData]);

    //! Rewards Options
    const { data: rewardAllData } = useGetAllRewardsByCompanyIdQuery(company_id);

    const rewardsOptions = useMemo(() => {
        if (rewardAllData) {
            return rewardAllData?.map(key => ({ id: key.id, title: key.reward }));
        }
        return [];
    }, [rewardAllData]);

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

            });
    }, [DCRAll?.data?.mpo_name?.id]);

    //! Ordered Products ko options 
    const { data: orderedProducts } = useGetAllProductsOptionsWithDivisionQuery({ company_name: company_id, division_name: DCRAll?.data?.mpo_name?.division_name?.id })

    const orderedProductOptions = useMemo(() => {
        if (orderedProducts) {
            return orderedProducts?.map(key => ({ id: key.id, title: key.reward }));
        }
        return [];
    }, [orderedProducts]);

    const [multipleProducts, setMultipleProducts] = useState([])
    const handleMultipleProducts = (e, value) => {
        setMultipleProducts(value);
    }

    const [multipleVisitedWith, setMultipleVisitedWith] = useState([])
    const handleMultipleVisitedWith = (e, value) => {
        setMultipleVisitedWith(value);
    }

    const [multipleRewards, setMultipleRewards] = useState([])
    const handleMultipleRewards = (e, value) => {
        setMultipleRewards(value);
    }

    const [multipleOrderedProducts, setMultipleOrderedProducts] = useState([])
    const handleMultipleChemistOrderedProducts = (e, value) => {
        setMultipleOrderedProducts(value);
    }

    const dcrId = useGetChemistAllDCRByIdForMpoIdQuery(idharu);

    const [initialFValues, setInitialFValues] = useState({
        edit: false,
        date: "",
        visited_area: "",
        visited_chemist: "",
        expenses_name: "",
        expenses: "",
        expenses_reasoning: "",
        company_product: [],
        rewards: [],
        company_roles: [],
        ordered_products: []
    });

    useEffect(() => {
        if (DCRAll?.data) {

            //! Initial Promoted Products 
            const selectedPromotedProducts = DCRAll?.data?.promoted_product?.map(promoted => ({
                id: promoted.id, title: promoted?.product_name?.product_name
            })) || []

            //! Initial Visited With 
            const selectedVisitedWith = DCRAll?.data?.visited_with?.map(visited => ({
                id: visited.id, title: `${visited.user_name?.first_name} ${visited.user_name?.middle_name} ${visited.user_name?.last_name}`
            })) || []

            //! Initial Rewards 
            const selectedRewards = DCRAll?.data?.rewards?.map(visited => ({
                id: visited.id, title: visited.rewards
            })) || []

            //! Initial Chemist Ordered Products 
            const selectedChemistOrderedProducts = DCRAll?.data?.ordered_products?.map(visited => ({
                id: visited.id, title: visited?.product_id?.product_name?.product_name + " " + `(${visited?.ordered_quantity})`
            })) || []


            setInitialFValues({
                edit: true,
                date: DCRAll?.data?.dcr?.date,
                visited_area: DCRAll?.data?.dcr?.visited_area?.id,
                visited_chemist: DCRAll?.data?.dcr?.visited_chemist?.id,
                expenses_name: DCRAll?.data?.dcr?.expenses_name,
                expenses: DCRAll?.data?.dcr?.expenses,
                expenses_reasoning: DCRAll?.data?.dcr?.expenses_reasoning,
                company_product: DCRAll?.data?.company_product,
                rewards: DCRAll?.data?.rewards,
                company_roles: DCRAll?.data?.company_roles,
                ordered_products: DCRAll?.data?.ordered_products
            });
            setDateData(DCRAll?.data?.dcr?.date);
            setMultipleProducts(selectedPromotedProducts)
            setMultipleVisitedWith(selectedVisitedWith)
            setMultipleRewards(selectedRewards)
            setMultipleOrderedProducts(selectedChemistOrderedProducts)
        }
        if (shiftWiseDCR.status == "fulfilled") {
            // setInitialShift(shiftWiseDCR?.data?.results[0]?.shift.id)
            setInitialShift(shiftWiseDCR?.data?.shift.id)
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

    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: mpo_id }, {
        skip: !company_id || !mpo_id
    });

    const areas = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map((key) => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])

    const { data: chemistData } = useGetAllVisitedMpoWiseChemistQuery({ company_name: company_id, mpo_name: mpo_id, mpo_area: values.visited_area })

    const chemists = useMemo(() => {
        if (chemistData !== undefined) {
            return chemistData?.map((key) => ({ id: key.id, title: key.chemist_name.chemist_name }))
        }
        return [];
    }, [chemistData])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Edit tourplan

    const [updateDCRAll] = useUpdateChemistsAllDCRMutation();
    useEffect(() => {
        if (DCRAll.data) {
            editWithoutImage(noLoop, setNoLoop, updateDCRAll, values, idharu, context);
        }
    }, [
        values.date,
        values.visited_area,
        values.visited_chemist,
        useDebounce(values.expenses_name, 3000),
        useDebounce(values.expenses, 3000),
        useDebounce(values.expenses_reasoning, 3000),
        values.company_product,
        values.rewards,
        values.company_roles,
        values.ordered_products
    ]);
    const changeShift = (e) => {
        const form = new FormData();
        form.append('id', shiftWiseDCR?.data?.results[0]?.id)
        form.append('shift', e.target.value);
        form.append('dcr_id', idharu);
        form.append('mpo_name', mpo_id);
        updateShiftWiseDCR(form);
    }

    const handleInputChangeLoop = (e) => {
        if (!noLoop) {
            setNoLoop(true)
            handleInputChange(e);
        }
        else {
            handleInputChange(e);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = {
            date: values.date,
            promoted_product: multipleProducts.map(key => key.id),
            rewards: multipleRewards.map(key => key.id),
            visited_with: multipleVisitedWith.map(key => key.id),
            ordered_products: multipleOrderedProducts.map(key => key.id),
        }
        try {
            const response = await updateDCRAll(data)
            if (response) {
                toast.success(`${response?.data?.msg}`)
                setIsButtonDisabled(true)
                setLoading(false);
                onClose();
            } else if (response?.error) {
                console.log(response?.error)
                toast.error(`${response?.error?.data?.msg}`)
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
                        <IconButton
                            className="close-button"
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6">
                            Edit Chemist DCR
                        </Typography>
                    </Box>

                    <Form>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="visited_area"
                                label="Visited Area"
                                value={values.visited_area}
                                onChange={(e) => handleInputChangeLoop(e)}
                                options={areas}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="visited_chemist"
                                label="Visited Chemist*"
                                value={values.visited_chemist}
                                onChange={(e) => handleInputChangeLoop(e)}
                                options={chemists}
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

                        <Box marginBottom={2}>
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
                        {/* <Box marginBottom={2}>
                            <EditChemistDCRProducts
                                name="company_product"
                                value={values.company_product}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                context={context}
                                editApi={useUpdateChemistsAllDCRMutation} />
                        </Box>
                        <Box marginBottom={2}>
                            <EditChemistDCRRoles
                                name="company_roles"
                                // mpoId={Dc}
                                value={values.company_roles}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                context={context}
                                editApi={useUpdateChemistsAllDCRMutation} />
                        </Box>

                        <Box marginBottom={2}>
                            <EditDCRChemistRewards
                                name="rewards"
                                value={values.rewards}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                context={context}
                                editApi={useUpdateChemistsAllDCRMutation} />

                        </Box> */}
                        {/* <Box marginBottom={2}>
                            <EditChemistDCROrderedProducts
                                name="ordered_products"
                                value={values.ordered_products}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                context={context}
                                editApi={useUpdateChemistsAllDCRMutation} />
                        </Box> */}

                        {/* //! New Multiple Ordered Products Wala  */}
                        {/* <Box marginBottom={2}>
                            <Autocomplete
                                multiple
                                value={multipleOrderedProducts || []}
                                options={}
                                getOptionLabel={(option) => option.title}
                                onChange={handleMultipleChemistOrderedProducts}
                                renderInput={(params) => (
                                    <TextField {...params} label="Ordered Products" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                )}
                            />
                        </Box> */}
                        <Box marginBottom={2}>
                            <EditChemistOrderProduct
                                id={id}
                                data={OrderProduct}
                                allData={DCRAll}
                                handleOrderProductChange={handleOrderedProducts}
                            />
                        </Box>

                        {/* //! New Multiple Wala  */}
                        <Box marginBottom={2}>
                            <Autocomplete
                                multiple
                                value={multipleProducts || []}
                                options={promotedArray}
                                getOptionLabel={(option) => option.title}
                                onChange={handleMultipleProducts}
                                renderInput={(params) => (
                                    <TextField {...params} label="Promoted Products" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                )}
                            />
                        </Box>

                        {/* //! New Multiple Wala  */}
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

                        {/* //! New Multiple Wala  */}
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

export default React.memo(EditChemistDCR);