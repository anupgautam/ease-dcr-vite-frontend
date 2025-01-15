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
import { usePostHigherLevelExecutiveGetDataMutation } from "@/api/CompanySlices/companyUserRoleSlice";

//! Reusable Component
import { useForm, Form } from '../../../../reusable/forms/useForm'
import Controls from '../../../../reusable/components/forms/controls/Controls';
//! Api Slices 
import {
    useGetDoctorDcrByIdQuery,
    useAddDoctorsAllDCRMutation,
    // useAddDoctorsAllDCRMutation
} from '../../../../api/DCRs Api Slice/doctorDCR/DoctorDCRAllSlice';
import { BSDate } from "nepali-datepicker-react";
import editWithoutImage from '@/reusable/components/forms/utils/editUtils/editWithoutImage';
import useDebounce from '@/reusable/components/forms/utils/debounce';
import EditDoctorDCRProducts from '../EditDCRPackages/EditDoctorDCRProducts';
import EditDoctorDCRRoles from '../EditDCRPackages/EditDoctorDCRRoles';
import EditDCRRewards from '../EditDCRPackages/EditDCRRewards';
import { useSelector } from 'react-redux';
import { useGetShiftWiseDoctorDCRByIdQuery, useUpdateShiftWiseDoctorDCRMutation } from '@/api/DCRs Api Slice/doctorDCR/shiftWiseDoctorDCRSlice';
import { useGetAllVisitedMpoWiseDoctorQuery } from '@/api/MPOSlices/doctorApiSlice';
import { useGetMpoAreaQuery } from '@/api/MPOSlices/TourPlanSlice';

//! Multiple Wala
import { useGetAllCompanyProductsWithoutPaginationQuery } from "@/api/productSlices/companyProductSlice";
import { useGetVisitedWithByDcrIdQuery } from "@/api/MPOSlices/companyRolesSlice";
import {
    useGetAllRewardsByCompanyIdQuery,
    useGetRewardsByDcrIdQuery,
    useGetRewardsByIdQuery,
    usePostRewardForDcrMutation
} from "@/api/DCRs Api Slice/rewardsAPISlice"

const EditDCR = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const now = new BSDate().now();
    const [noLoop, setNoLoop] = useState(true);
    const [initialShift, setInitialShift] = useState("");
    // const doctors = useSelector(state => state.dcrData.visited_doctors);
    const shifts = useSelector(state => state.dcrData.shifts);
    const mpo_id = useSelector(state => state.dcrData.selected_user);
    const DCRAll = useGetDoctorDcrByIdQuery(idharu);

    const shiftWiseDCR = useGetShiftWiseDoctorDCRByIdQuery(idharu);

    //! Nepali Date format 
    const [dateData, setDateData] = useState()
    const context = { 'company_product': 'select', 'company_roles': 'select', 'rewards': 'normal' }

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

    //! Getting TourPlan by ID
    const [initialFValues, setInitialFValues] = useState({
        edit: false,
        mpo_name: "",
        date: "",
        shift: "",
        visited_area: "",
        visited_doctor: "",
        expenses_name: "",
        expenses: "",
        expenses_reasoning: "",
        company_product: [],
        rewards: [],
        company_roles: [],
        // dcr_id: [],
    });


    useEffect(() => {
        if (DCRAll?.data) {

            //! Initial Promoted Products 
            const selectedPromotedProducts = DCRAll?.data?.promoted_product?.map(promoted => ({
                id: promoted.id, title: promoted?.product_name?.product_name
            })) || []

            //! Initial Promoted Products 
            const selectedVisitedWith = DCRAll?.data?.visited_with?.map(visited => ({
                id: visited.id, title: `${visited.user_name?.first_name} ${visited.user_name?.middle_name} ${visited.user_name?.last_name}`
            })) || []

            //! Initial Rewards 
            const selectedRewards = DCRAll?.data?.rewards?.map(visited => ({
                id: visited.id, title: visited.rewards
            })) || []

            setInitialFValues({
                edit: true,
                date: DCRAll?.data?.date,
                shift: DCRAll?.data?.shift?.id,
                mpo_name: DCRAll?.data?.mpo_name?.id,
                visited_area: DCRAll?.data?.dcr?.visited_area?.id,
                visited_doctor: DCRAll?.data?.dcr?.visited_doctor?.id,
                expenses_name: DCRAll?.data?.dcr?.expenses_name,
                expenses: DCRAll?.data?.dcr?.expenses,
                expenses_reasoning: DCRAll?.data?.dcr?.expenses_reasoning,
                company_product: DCRAll?.data?.company_product,
                rewards: DCRAll?.data?.rewards,
                company_roles: DCRAll?.data?.company_roles,
                // dcr_id: DCRAll?.data?.dcr?.dcr?.id
            });
            setDateData(DCRAll?.data?.dcr?.date);
            setMultipleProducts(selectedPromotedProducts)
            setMultipleVisitedWith(selectedVisitedWith)
            setMultipleRewards(selectedRewards)
        }
        if (shiftWiseDCR.status == "fulfilled") {
            setInitialShift(shiftWiseDCR?.data?.results?.shift.id)
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

    const { data: doctorsdata } = useGetAllVisitedMpoWiseDoctorQuery({ company_name: company_id, mpo_name: values.mpo_name, mpo_area: values.visited_area })

    const doctors = useMemo(() => {
        if (doctorsdata !== undefined) {
            return doctorsdata?.map((key) => ({ id: key.id, title: key?.doctor_name?.doctor_name }))
        }
        return [];
    }, [doctorsdata])

    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: mpo_id }, {
        skip: !company_id || !mpo_id
    });

    const areas = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map((key) => ({ id: key?.id, title: key?.area_name }))
        }
        return [];
    }, [MpoArea])

    const [updateShiftWiseDCR] = useUpdateShiftWiseDoctorDCRMutation();

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Edit tourplan

    const [updateDCRAll] = useAddDoctorsAllDCRMutation();

    useEffect(() => {
        if (DCRAll.data) {
            editWithoutImage(noLoop, setNoLoop, updateDCRAll, values, idharu, context);
        }
    }, [
        values.date,
        values.visited_area,
        values.visited_doctor,
        useDebounce(values.expenses_name, 3000),
        useDebounce(values.expenses, 3000),
        useDebounce(values.expenses_reasoning, 3000),
        values.company_product,
        values.rewards,
        values.company_roles,

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
        setLoading(true)
        const jsonData = {
            date: values.date,
            promoted_product: multipleProducts.map(key => key.id),
            rewards: multipleRewards.map(key => key.id),
            visited_with: multipleVisitedWith.map(key => key.id),
        }
    }

    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
                padding="16px"
                sx={{
                    width: 500, // Set the desired width of the Drawer
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 500 // Set the same width for the paper inside the Drawer
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
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6">
                            Edit Doctor DCR
                        </Typography>
                    </Box>

                    <Form>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="visited_area"
                                        label="Visited Area"
                                        value={values.visited_area}
                                        onChange={(e) => handleInputChangeLoop(e)}
                                        options={areas}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="visited_doctor"
                                        label="Visited Doctor*"
                                        value={values.visited_doctor}
                                        onChange={(e) => handleInputChangeLoop(e)}
                                        options={doctors}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="shifts"
                                        label="Shift*"
                                        value={values.shift}
                                        onChange={(e) => changeShift(e)}
                                        options={shifts}
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="expenses"
                                        label="Expenses*"
                                        value={values.expenses}
                                        onChange={(e) => handleInputChangeLoop(e)}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

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
                            {/* <NepaliDatePicker disable={true} value={dateData} format="YYYY-MM-DD" onChange={(value) => setDateData(value)} /> */}
                        </Box>

                        {/* <Box marginBottom={2}>
                            <EditDoctorDCRProducts
                                name="company_product"
                                value={values.company_product}
                                onChange={handleInputChangeLoop}
                                id={DCRAll?.data?.dcr?.id}
                                division={DCRAll?.data?.mpo_name?.division_name}
                                context={context}
                                editApi={useAddDoctorsAllDCRMutation} />
                        </Box>
                        <Box marginBottom={2}>
                            <EditDoctorDCRRoles
                                name="company_roles"
                                value={values.company_roles}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                mpoId={DCRAll?.data?.mpo_name?.id}
                                context={context}
                                editApi={useAddDoctorsAllDCRMutation} />
                        </Box>

                        <Box marginBottom={2}>
                            <EditDCRRewards
                                name="rewards"
                                value={values.rewards}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                context={context}
                                editApi={useAddDoctorsAllDCRMutation} />
                        </Box> */}


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

export default React.memo(EditDCR);