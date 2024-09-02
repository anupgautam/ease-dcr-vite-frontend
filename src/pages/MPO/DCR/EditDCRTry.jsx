import React, { useEffect, useState } from 'react'
import {
    Box, Grid,
    Typography, InputLabel, CircularProgress
} from '@mui/material'
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import 'react-datepicker/dist/react-datepicker.css';

//! Reusable Component
import { useForm, Form } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";

import {
    useGetDoctorAllDCRByIdQuery,
    useUpdateDoctorsAllDCRMutation
} from '@/api/DCRs Api Slice/doctorDCR/doctorDCRAllApiSlice';

import editWithoutImage from '@/reusable/components/forms/utils/editUtils/editWithoutImage';
import useDebounce from '@/reusable/components/forms/utils/debounce';
import { useGetAllVisitedDoctorsOptionsQuery } from '@/api/MPOSlices/doctorApiSlice';
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice';
import { useGetAllCompanyProductsWithoutPaginationQuery } from '@/api/productSlices/companyProductSlice';
import { useGetAllRewardsQuery } from '@/api/DCRs Api Slice/rewardsAPISlice';
import { useGetAllCompanyRolesQuery } from '@/api/MPOSlices/companyRolesSlice';
import { GetNameListFromOptions } from '@/reusable/components/forms/utils/getNameListFromOptions';
import { useSelector } from 'react-redux';


const EditDCR = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const [noLoop, setNoLoop] = useState(true);
    const [doctors, setDoctors] = useState([]);
    const [areas, setAreas] = useState([]);
    const [products, setProducts] = useState([]);
    const [productMultiSelect, setProductMultiSelect] = useState([]);
    const [rewards, setRewards] = useState([]);
    const [rewardMultiSelect, setRewardMultiSelect] = useState([]);
    const [roles, setRoles] = useState([]);
    const [roleMultiSelect, setRoleMultiSelect] = useState([]);
    const context = { 'company_product': 'select', 'company_roles': 'select', 'expenses': 'normal' }

    const doctorData = useGetAllVisitedDoctorsOptionsQuery();
    useEffect(() => {
        const intermediateDoctors = []
        if (doctorData.data) {
            doctorData.data.forEach((key) => {
                intermediateDoctors.push({ id: key.id, title: key.doctor_name.doctor_name })
            })
            setDoctors(intermediateDoctors);
        }
    }, [doctorData])

    const areaData = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });
    useEffect(() => {
        const intermediateAreas = []
        if (areaData.data) {
            areaData.data.forEach((key) => {
                intermediateAreas.push({ id: key.id, title: key.company_area.area_name })
            })
            setAreas(intermediateAreas);
        }
    }, [areaData])

    const productData = useGetAllCompanyProductsWithoutPaginationQuery(company_id, {
        skip: !company_id
    });
    useEffect(() => {
        const intermediateProducts = [];
        const intermediateMultiProducts = [];
        if (productData.data) {
            productData.data.forEach((key) => {
                intermediateProducts.push({ id: key.id, title: key.product_name.product_name + " " + key.product_name.product_molecular_name })
                intermediateMultiProducts.push(key.product_name.product_name + " " + key.product_name.product_molecular_name);
            })
            setProducts(intermediateProducts);
            setProductMultiSelect(intermediateMultiProducts);
        }
    }, [productData])

    const rewardData = useGetAllRewardsQuery(company_id, {
        skip: !company_id
    });
    useEffect(() => {
        const intermediateRewards = []
        const intermediateMultiRewards = []
        if (rewardData.data) {
            rewardData.data.forEach((key) => {
                intermediateRewards.push({ id: key.id, title: key.reward });
                intermediateMultiRewards.push(key.reward);
            })
            setRewards(intermediateRewards);
            setRewardMultiSelect(intermediateMultiRewards);
        }
    }, [rewardData])

    const rolesData = useGetAllCompanyRolesQuery(company_id, {
        skip: !company_id
    });
    useEffect(() => {
        const intermediateRoles = [];
        const intermediateMultiRoles = [];
        if (rolesData.data) {
            rolesData.data.forEach((key) => {
                intermediateRoles.push({ id: key.id, title: key.role_name.role_name })
                intermediateMultiRoles.push(key.role_name.role_name)
            })
            setRoles(intermediateRoles);
            setRoleMultiSelect(intermediateMultiRoles);
        }
    }, [rolesData])


    //! Getting TourPlan by ID

    const DCRAll = useGetDoctorAllDCRByIdQuery(idharu);

    // 

    const [initialFValues, setInitialFValues] = useState({
        edit: false,
        date: "",
        visited_area: "",
        visited_doctor: "",
        expenses_name: "",
        expenses: "",
        expenses_reasoning: "",
        company_product: [],
        rewards: [],
        company_roles: [],
    });


    // //! Validation wala  
    // const validate = (fieldValues = values) => {
    //     // 
    //     let temp = { ...errors }
    //     if ('first_name' in fieldValues)
    //         temp.first_name = returnValidation(['null', 'number'], values.first_name)
    //     temp.last_name = returnValidation(['null', 'number'], values.last_name)
    //     temp.email = returnValidation(['email'], values.email)
    //     temp.area_name = returnValidation(['null'], values.area_name)
    //     temp.shift = returnValidation(['null'], values.shift)
    //     temp.select_the_month = returnValidation(['null'], values.select_the_month)
    //     temp.select_the_date_id = returnValidation(['null'], values.select_the_date_id)

    //     setErrors({
    //         ...temp
    //     })
    //     // 

    //     if (fieldValues === values)
    //         return Object.values(temp).every(x => x == "")
    // }

    useEffect(() => {
        if (DCRAll.data) {
            setInitialFValues({
                edit: true,
                date: DCRAll.data.date,
                visited_area: DCRAll.data.visited_area,
                visited_doctor: DCRAll.data.visited_doctor,
                expenses_name: DCRAll.data.expenses_name,
                expenses: DCRAll.data.expenses,
                expenses_reasoning: DCRAll.data.expenses_reasoning,
                company_product: GetNameListFromOptions(DCRAll.data.company_product, "product_name", products),
                rewards: GetNameListFromOptions(DCRAll.data.rewards, "rewards", rewards),
                company_roles: GetNameListFromOptions(DCRAll.data.company_roles, "company_roles", roles),
            });
        }
    }, [DCRAll.data, products])


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

    const [updateDCRAll] = useUpdateDoctorsAllDCRMutation();
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
        values.company_roles
    ]);

    const handleInputChangeLoop = (e) => {

        if (!noLoop) {
            setNoLoop(true)
            handleInputChange(e);

        }
        else {
            handleInputChange(e);
        }
    }


    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
            >
                <Box
                    p={1}
                    width="340px"
                    textAlign="center"
                    role="presentation"
                    className="drawer-box"
                >
                    <Typography variant="h6" className="drawer-box-text">
                        Edit DCR
                        <IconButton
                            className="close-button"
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                    </Typography>
                </Box>

                <Form>
                    <Box marginBottom={4}>
                        <Controls.Select
                            name="visited_area"
                            label="Visited Area"
                            value={values.visited_area}
                            onChange={(e) => handleInputChangeLoop(e)}
                            options={areas}
                        />
                    </Box>
                    <Box marginBottom={4}>
                        <Controls.Select
                            name="visited_doctor"
                            label="Visited Doctor*"
                            value={values.visited_doctor}
                            onChange={(e) => handleInputChangeLoop(e)}
                            options={doctors}
                        />
                    </Box>
                    <Box marginBottom={4}>
                        <Controls.Input
                            name="expenses"
                            label="Expenses*"
                            value={values.expenses}
                            onChange={(e) => handleInputChangeLoop(e)}
                        />
                    </Box>

                    <Box marginBottom={4}>
                        <Controls.Input
                            name="expenses_name"
                            label="Expenses Name*"
                            value={values.expenses_name}
                            onChange={(e) => handleInputChangeLoop(e)}
                        />
                    </Box>

                    <Box marginBottom={4}>
                        <Controls.Input
                            name="expenses_reasoning"
                            label="Expenses Reasoning*"
                            value={values.expenses_reasoning}
                            onChange={(e) => handleInputChangeLoop(e)}
                        />
                    </Box>

                    <Box marginBottom={4}>
                        <InputLabel>{"date"}</InputLabel>
                        {/* <Controls.DatePicker
                            name="date"
                            showIcon
                            selectedDate={values.date}
                            onChange={handleInputChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select the Date"
                        /> */}
                    </Box>
                    <Box marginBottom={4}>
                        <Controls.MultiSelect
                            name="company_product"
                            label="Company Product"
                            value={values.company_product}
                            onChange={handleMultipleInput}
                            valueArray={valueArray.company_product}
                            names={productMultiSelect}
                        />
                    </Box>
                    <Box marginBottom={4}>
                        <Controls.MultiSelect
                            name="rewards"
                            label="Rewards"
                            value={values.rewards}
                            onChange={handleMultipleInput}
                            valueArray={valueArray.rewards}
                            names={rewardMultiSelect}
                        />
                    </Box>

                    <Box marginBottom={4}>
                        <Controls.MultiSelect
                            name="company_roles"
                            label="Company Roles"
                            value={values.company_roles}
                            onChange={handleMultipleInput}
                            valueArray={valueArray.company_roles}
                            names={roleMultiSelect}
                        />
                    </Box>

                    {/* <Stack spacing={6} direction="row">
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
                    </Stack> */}
                </Form>
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