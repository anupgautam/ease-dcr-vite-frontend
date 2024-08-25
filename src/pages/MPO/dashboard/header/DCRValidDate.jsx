import React, { useState, useEffect, useContext } from 'react'
import {
    Grid,
    Box,
    Button,
    Tooltip,
    IconButton,
} from '@mui/material';
import Iconify from '@/components/iconify/Iconify';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useForm } from '../../../../reusable/forms/useForm'
import Controls from '../../../../reusable/components/forms/controls/Controls';
import { returnValidation } from '../../../../validation';
import {
    useGetTourPlanValidityByIdQuery,
    useUpdateTourPlanValidityMutation
} from '@/api/MPOSlices/TourPlanValidityApiSlice';
import { CookieContext } from '@/App'


const DCRValidDate = () => {
    const { company_id, user_role, company_user_id, refresh, access } = useContext(CookieContext)

    const companyId = company_id;
    const DCR = useGetTourPlanValidityByIdQuery(companyId);

    //! Dialogue
    const [openDialogue, setOpenDialogue] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = () => {
        setOpenDialogue(true)
    }

    const handleClose = () => {
        setOpenDialogue(false)
    }

    //! Validation   
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('tourplan_validity' in fieldValues)
            temp.tourplan_validity = returnValidation(['null', 'isNumberEdit'], values.tourplan_validity)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        tourplan_validity: "",
    })

    useEffect(() => {
        if (DCR.data) {
            setInitialFValues({
                tourplan_validity: DCR.data.days,
            });
        }
    }, [DCR.data])


    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true, false, true)

    useEffect(() => {
        validate();

    }, [values.tourplan_validity])


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //! Update DCR Validity Date
    const [updateDCR] = useUpdateTourPlanValidityMutation();

    //! onSubmit
    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("days", values.tourplan_validity);
        formData.append("id", DCR.data.id);
        formData.append('company', companyId)
        formData.append('refresh', refresh)
        formData.append('access', access);
        try {
            const response = await updateDCR(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Added TourPlan Validity dates' });
            setTimeout(() => {
                setSuccessMessage({ show: false, message: '' });
            }, 3000);
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
    };

    return (
        <>
            <Tooltip title="DCR Valid Date" arrow>
                <IconButton color={openDialogue ? 'primary' : 'default'} onClick={handleClickOpen} sx={{ width: 40, height: 40 }}>
                    <Iconify icon="ri:pass-valid-fill" />
                </IconButton>
            </Tooltip>
            <Dialog
                fullScreen={fullScreen}
                open={openDialogue}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Tour Plan Validity"}
                </DialogTitle>
                <DialogContent>
                    <Box marginTop={2}>
                        <Controls.Input
                            name="tourplan_validity"
                            label="No. of Days*"
                            value={values.tourplan_validity}
                            onChange={handleInputChange}
                            error={errors.tourplan_validity}
                        // className={"drawer-first-name-input"}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={(e) => { onSubmit(e); handleClose() }}>
                        Add
                    </Button>
                    <Button
                        onClick={handleClose}
                        autoFocus>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            {
                ErrorMessage.show === true ? (
                    <Grid>
                        <Box className="messageContainer errorMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
            {
                SuccessMessage.show === true ? (
                    <Grid>
                        <Box className="messageContainer successMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
        </>
    )
}

export default DCRValidDate