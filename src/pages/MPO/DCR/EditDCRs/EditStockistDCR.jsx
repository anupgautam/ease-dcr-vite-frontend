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
    useGetStockistAllDCRByIdQuery,
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


const EditStockistDCR = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);


    const [noLoop, setNoLoop] = useState(true);
    const [initialShift, setInitialShift] = useState("");
    // const areas = useSelector(state => state.dcrData.company_areas);
    // const stockists = useSelector(state => state.dcrData.visited_stockist);

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

    const DCRAll = useGetStockistAllDCRByIdQuery(idharu);
    const { data: mpoArea } = useGetUsersByIdQuery(mpo_id, {
        skip: !mpo_id
    });

    const { data: StockistData } = useGetAllStockistsWithoutPaginationQuery({ company_name: company_user_role_id, company_area: mpoArea?.company_area?.id ? mpoArea?.company_area?.id : "" }, {
        skip: !company_user_role_id || !mpoArea?.company_area?.id,
    })

    const stockists = useMemo(() => {
        if (StockistData !== undefined) {
            return StockistData.map((key) => ({
                id: key.id,
                title: key.stockist_name.stockist_name
            }))
        }
        return []
    }, [StockistData])

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

    useEffect(() => {
        if (DCRAll.data) {
            setInitialFValues({
                edit: true,
                date: DCRAll?.data?.date,
                visited_area: DCRAll?.data?.visited_area,
                visited_stockist: DCRAll?.data?.visited_stockist,
                expenses_name: DCRAll?.data?.expenses_name,
                expenses: DCRAll?.data?.expenses,
                expenses_reasoning: DCRAll?.data?.expenses_reasoning,
                rewards: DCRAll?.data?.rewards,
                company_roles: DCRAll?.data?.company_roles
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
    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Edit tourplan

    const [updateDCRAll] = useUpdateStockistsAllDCRMutation();
    useEffect(() => {
        if (DCRAll.data) {
            editWithoutImage(noLoop, setNoLoop, updateDCRAll, values, idharu, context);
        }
    }, [
        values.date,
        values.visited_area,
        values.visited_stockist,
        useDebounce(values.expenses_name, 3000),
        useDebounce(values.expenses, 3000),
        useDebounce(values.expenses_reasoning, 3000),
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
                                Edit DCR
                            </Typography>
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
                                name="visited_stockist"
                                label="Visited Stockist*"
                                value={values.visited_stockist}
                                onChange={(e) => handleInputChangeLoop(e)}
                                options={stockists}
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
                            <EditStockistDCRRoles
                                name="company_roles"
                                value={values.company_roles}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                context={context}
                                editApi={useUpdateStockistsAllDCRMutation} />
                        </Box>

                        <Box marginBottom={2}>
                            <EditDCRStockistRewards
                                name="rewards"
                                value={values.rewards}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                context={context}
                                editApi={useUpdateStockistsAllDCRMutation} />

                        </Box>
                        <Box marginBottom={2}>
                            <EditStockistDCRProducts
                                name="company_product"
                                division={mpoArea?.division_name}
                                value={values.company_product}
                                onChange={handleInputChangeLoop}
                                id={idharu}
                                context={context}
                                editApi={useUpdateStockistsAllDCRMutation} />
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

export default React.memo(EditStockistDCR);