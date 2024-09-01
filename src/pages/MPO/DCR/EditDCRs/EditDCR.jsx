import React, { useEffect, useState, useMemo } from 'react'
import {
    Box, Grid,
    Typography, CircularProgress
} from '@mui/material'
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import 'react-datepicker/dist/react-datepicker.css';

//! Reusable Component
import { useForm, Form } from '../../../../reusable/forms/useForm'
import Controls from '../../../../reusable/components/forms/controls/Controls';
//! Api Slices 
import {
    useGetDoctorDcrByIdQuery,
    useUpdateDoctorsAllDCRMutation
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
import { useGetAllCompanyAreasQuery } from '../../../../api/CompanySlices/companyAreaSlice'


const EditDCR = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

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
    });



    useEffect(() => {
        if (DCRAll?.data) {
            setInitialFValues({
                edit: true,
                date: DCRAll?.data?.date,
                shift: DCRAll?.data?.dcr?.shift.id,
                mpo_name: DCRAll?.data?.mpo_name?.id,
                visited_area: DCRAll?.data?.dcr?.dcr?.visited_area?.id,
                visited_doctor: DCRAll?.data?.dcr?.dcr?.visited_doctor?.id,
                expenses_name: DCRAll?.data?.dcr?.dcr?.expenses_name,
                expenses: DCRAll?.data?.dcr?.dcr?.expenses,
                expenses_reasoning: DCRAll?.data?.dcr?.dcr?.expenses_reasoning,
                company_product: DCRAll?.data?.company_product,
                rewards: DCRAll?.data?.rewards,
                company_roles: DCRAll?.data?.company_roles
            });
            setDateData(DCRAll?.data?.dcr?.dcr?.date);
        }
        if (shiftWiseDCR.status == "fulfilled") {
            setInitialShift(shiftWiseDCR?.data?.results?.dcr?.shift.id)
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
            return doctorsdata?.map((key) => ({ id: key.id, title: key.doctor_name.doctor_name }))
        }
        return [];
    }, [doctorsdata])

    const MpoArea = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });

    const areas = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map((key) => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [MpoArea])

    const [updateShiftWiseDCR] = useUpdateShiftWiseDoctorDCRMutation();

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
                        <Box marginBottom={2}>
                            <EditDoctorDCRProducts
                                name="company_product"
                                value={values.company_product}
                                onChange={handleInputChangeLoop}
                                id={DCRAll?.data?.dcr?.dcr?.id}
                                division={DCRAll?.data?.mpo_name?.division_name}
                                context={context}
                                editApi={useUpdateDoctorsAllDCRMutation} />
                        </Box>
                        <Box marginBottom={2}>
                            <EditDoctorDCRRoles
                                name="company_roles"
                                value={values.company_roles}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                mpoId={DCRAll?.data?.mpo_name?.id}
                                context={context}
                                editApi={useUpdateDoctorsAllDCRMutation} />
                        </Box>

                        <Box marginBottom={2}>
                            <EditDCRRewards
                                name="rewards"
                                value={values.rewards}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                context={context}
                                editApi={useUpdateDoctorsAllDCRMutation} />

                        </Box>
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