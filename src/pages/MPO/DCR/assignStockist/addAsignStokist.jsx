import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    Select,
    InputLabel,
    FormControl,
    OutlinedInput,
    MenuItem
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../../components/iconify';

import { useForm } from '../../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../../validation';

import {
    usePostAllMPONamesNoPageMutation
} from '../../../../api/MPOSlices/DoctorSlice'
import Cookies from 'js-cookie'
import NepaliDatePicker, {
    NepaliDateConverter,
} from "react-nepali-date-picker-lite";
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice';
import { useGetAllStockistsQuery } from '@/api/MPOSlices/stockistApiSlice';
import { useCreateAssignStockistsMutation } from '@/api/MPOSlices/StockistSlice';

const AddAsignStockist = () => {
    const today = NepaliDateConverter.getNepaliDate();
    const [selectedDates, setSelectedDates] = useState(today);


    const { data: CompanyArea } = useGetAllCompanyAreasQuery(Cookies.get('company_id'));

    const companyAreaData = [];
    if (CompanyArea !== undefined) {
        CompanyArea?.forEach((key) => {
            companyAreaData.push({ id: key.id, title: key.company_area })
        })
    }

    const [RewardOptions, setRewardsOptions] = useState([]);

    const handleRewardsChange = (event) => {
        const {
            target: { value },
        } = event;
        setRewardsOptions(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const [createMpoWise] = useCreateAssignStockistsMutation()

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('company_area' in fieldValues)
            temp.company_area = returnValidation(['null'], values.company_area)
        temp.mpo_name = returnValidation(['null'], values.mpo_name)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const initialFValues = {

    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true)

    useEffect(() => {
        validate();
    }, [values.mpo_name, RewardOptions])

    const { data } = useGetAllStockistsQuery({ id: Cookies.get('company_id'), page: 1, company_area: values.company_area });

    const stockistData = useMemo(() => {
        if (data !== undefined) {
            return data?.results?.map((key, index) => {
                stockistData.push({
                    id: key.id,
                    title: key.stockist_name.stockist_name
                })
            })
        }
        return [];
    }, [])

    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList.map((key) => ({
                id: key.id,
                title: key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name
            }))
        }
        return [];
    }, [MpoList])

    useEffect(() => {
        if (Cookies.get('company_id')) {
            MpoData({ company_name: Cookies.get('company_id') })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [Cookies.get('company_id')])


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });


    const onAddEvents = useCallback(async (e) => {
        e.preventDefault();
        let data = RewardOptions.map((tour) => ({
            stockist_name: tour,
            mpo_name: values.mpo_name,
            company_name: Cookies.get('company_id')
        }));
        try {
            const response = await createMpoWise(data)
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Assign Stockist.' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            } else {
                setErrorMessage({ show: true, message: response.error.data[0] });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
        setIsDrawerOpen(false)
    }, [createMpoWise, values]);


    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsDrawerOpen(true)} >
                Add
            </Button>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                padding="16px"
                sx={{
                    width: 400, // Set the desired width of the Drawer
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400 // Set the same width for the paper inside the Drawer
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
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Add Assign Stockist
                        </Typography>

                    </Box>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <Box marginBottom={2}>
                                <Controls.Select
                                    name="company_area"
                                    label="Select Company Wise Area*"
                                    value={values.company_area}
                                    onChange={handleInputChange}
                                    error={errors.company_area}
                                    options={companyAreaData}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="mpo_name"
                            label="Select the MPO*"
                            value={values.mpo_name}
                            onChange={handleInputChange}
                            error={errors.mpo_name}
                            options={mpoNames}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        {/* <Controls.Select
                            name="stockist_name"
                            label="Select the Stockist*"
                            value={values.company_area}
                            onChange={handleInputChange}
                            // className={"drawer-first-name-input"}
                            error={errors.company_area}
                            options={stockistData}
                        /> */}
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel>{"Select the Rewards*"}</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                value={RewardOptions}
                                onChange={handleRewardsChange}
                                input={<OutlinedInput label="Select the Rewards*" />}
                                // MenuProps={MenuProps}
                                sx={{ width: '100%' }}
                                style={{
                                    borderBlockColor: "white",
                                    width: "100%",
                                    textAlign: 'start'
                                }}
                            >
                                {stockistData.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Button
                            variant="contained"
                            className="summit-button"
                            onClick={(e) => onAddEvents(e)}
                        >
                            Submit{" "}
                        </Button>
                        <Button
                            variant="outlined"
                            className="cancel-button"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Drawer>
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

export default React.memo(AddAsignStockist); 