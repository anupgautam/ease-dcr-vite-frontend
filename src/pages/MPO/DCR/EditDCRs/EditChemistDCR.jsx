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
import { useSelector } from 'react-redux';


const EditChemistDCR = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

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

    const DCRAll = useGetChemistAllDCRByIdQuery(idharu);
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
        if (DCRAll.data) {
            setInitialFValues({
                edit: true,
                date: DCRAll?.data?.date,
                visited_area: DCRAll?.data?.visited_area,
                visited_chemist: DCRAll?.data?.visited_chemist,
                expenses_name: DCRAll?.data?.expenses_name,
                expenses: DCRAll?.data?.expenses,
                expenses_reasoning: DCRAll?.data?.expenses_reasoning,
                company_product: DCRAll?.data?.company_product,
                rewards: DCRAll?.data?.rewards,
                company_roles: DCRAll?.data?.company_roles,
                ordered_products: DCRAll?.data?.ordered_products
            });
            setDateData(DCRAll?.data?.date);
        }
        if (shiftWiseDCR.status == "fulfilled") {
            setInitialShift(shiftWiseDCR?.data?.results[0]?.dcr?.shift.id)
        }
    }, [DCRAll.data, shiftWiseDCR])


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



    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: mpo_id });

    const areas = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map((key) => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])

    const { data: chemistData } = useGetAllVisitedMpoWiseChemistQuery({ company_name: company_id, mpo_name: mpo_id, mpo_area: values.visited_area })

    const chemists = useMemo(() => {
        if (chemistData !== undefined) {
            return chemistData.data.map((key) => ({ id: key.id, title: key.chemist_name.chemist_name }))
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
                        <Box marginBottom={2}>
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

                        </Box>
                        <Box marginBottom={2}>
                            <EditChemistDCROrderedProducts
                                name="ordered_products"
                                value={values.ordered_products}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                context={context}
                                editApi={useUpdateChemistsAllDCRMutation} />

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

export default React.memo(EditChemistDCR);