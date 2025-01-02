import React, { useEffect, useState } from 'react'
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
//! Api Slices 
import {
    useGetChemistOrderedProductByIdQuery,
    useUpdateChemistOrderedProductMutation,
} from '@/api/DCRs Api Slice/chemistDCR/chemistOrderedProductInformation';
import editWithoutImage from '@/reusable/components/forms/utils/editUtils/editWithoutImage';
import EditChemistStockistOrder from '../EditDCRPackages/EditChemistStockistOrder';
import { toast } from 'react-toastify';

import { useSelector } from 'react-redux';

const EditChemistOrderedProduct = ({ id, onClose, companyArea }) => {
    const [noLoop, setNoLoop] = useState(true);
    const [initialShift, setInitialShift] = useState("");
    const stockists = useSelector(state => state.dcrData.visited_stockist);
    const context = { 'product_information': 'normal' }

    //! Getting TourPlan by ID


    const DCRAll = useGetChemistOrderedProductByIdQuery(id);

    const [initialFValues, setInitialFValues] = useState({
        edit: false,
        product_information: [],
    });

    useEffect(() => {
        if (DCRAll.data) {
            setInitialFValues({
                edit: true,
                product_information: DCRAll.data.product_information
            });
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

    const [updateDCRAll] = useUpdateChemistOrderedProductMutation();
    useEffect(() => {
        if (DCRAll.data) {
            editWithoutImage(noLoop, setNoLoop, updateDCRAll, values, id, context);
        }
    }, [
        values.product_information
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
                padding="8px"
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        width="300px"
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
                        <Typography variant="h6" className="drawer-box-text">
                            Edit Product
                        </Typography>
                    </Box>

                    <Form>
                        <Box marginBottom={2}>
                            <EditChemistStockistOrder
                                name="product_information"
                                value={values.product_information}
                                onChange={handleInputChangeLoop}
                                companyArea={companyArea}
                                id={id}
                                context={context}
                                editApi={useUpdateChemistOrderedProductMutation} />
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

export default React.memo(EditChemistOrderedProduct);