import React, { useEffect, useState, useContext } from 'react'
import {
    Box, Grid,
    Typography
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
    useGetHODCRsByIdQuery,
    useUpdateHODCRsMutation,
} from '@/api/HighOrderSlices/hoDCRSlice';
import { useSelector } from 'react-redux';
import { useGetUsersByCompanyRoleIdExecutativeLevelQuery } from '@/api/MPOSlices/UserSlice';
import { CookieContext } from '@/App'


const EditHoDCR = ({ idharu, onClose }) => {

    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const [noLoop, setNoLoop] = useState(true);
    const [lowerLevels, setLowerLevels] = useState([]);
    const shifts = useSelector(state => state.dcrData.shifts);
    const [dateData, setDateData] = useState()

    const user_id = useSelector(state => state.dcrData.selected_user);

    //! Getting TourPlan by ID
    const DCRAll = useGetHODCRsByIdQuery(idharu);

    const { data: userLists } = useGetUsersByCompanyRoleIdExecutativeLevelQuery({ id: company_id, page: user_id })

    useEffect(() => {
        const lower = [];
        if (userLists !== undefined) {
            userLists.forEach((key) => {
                lower.push({ id: key.id, title: key.user_name.first_name + " " + key.user_name.last_name })
            })
        }
        setLowerLevels(lower);
    }, [userLists])

    const [initialFValues, setInitialFValues] = useState({
        edit: false,
        date: "",
        company_id: "",
        user_id: "",
        visited_with: "",
        shift: "",
        id: ""
    });
    useEffect(() => {
        if (DCRAll.data) {
            setInitialFValues({
                edit: true,
                id: DCRAll?.data?.id,
                date: DCRAll?.data?.date,
                company_id: company_id,
                user_id: DCRAll?.data?.user_id?.id,
                visited_with: DCRAll?.data?.visited_with?.id,
                shift: DCRAll?.data?.shift?.id
            });
            setDateData(DCRAll?.data?.date)
        }
    }, [DCRAll.data])



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

    const [updateDCRAll] = useUpdateHODCRsMutation();
    useEffect(() => {
        if (DCRAll.data) {
            updateDCRAll(values)
            // editWithoutImage(noLoop, setNoLoop, updateDCRAll, values, idharu, context);
        }
    }, [
        values.date,
        values.visited_with,
        values.shift
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
                padding="16px"
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        width="340px"
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
                            Edit DCR
                        </Typography>
                    </Box>

                    <Form>
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
                            <Controls.Select
                                name="visited_with"
                                label="Visited With"
                                value={values.visited_with}
                                onChange={(e) => handleInputChangeLoop(e)}
                                options={lowerLevels}
                            />
                        </Box>
                        <Box marginBottom={2}>
                            <Controls.Select
                                name="shift"
                                label="Shift*"
                                value={values.shift}
                                onChange={(e) => handleInputChangeLoop(e)}
                                options={shifts}
                            />
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

export default React.memo(EditHoDCR);