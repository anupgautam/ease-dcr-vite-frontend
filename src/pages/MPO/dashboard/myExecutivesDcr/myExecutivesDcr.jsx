import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Card,
    MenuItem,
    Typography,
    Box,
    Select,
    FormControl,
    InputLabel,
    Grid,
} from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker.css';
import "nepali-datepicker-reactjs/dist/index.css"
import 'react-loading-skeleton/dist/skeleton.css'
import SelectDataDCR from '../../DCR/SelectDataDCR';

import {
    useDeleteTourPlansByIdMutation,
    useGetTourplanOfMpoByDateMonthQuery
} from '@/api/MPOSlices/TourPlanSlice';
import {
    useGetUsersByHigherLevelUserQuery,
} from '@/api/MPOSlices/UserSlice';
import { useGetCompanyRolesByCompanyQuery } from '@/api/CompanySlices/companyRolesSlice';
import { useGetUsersByCompanyRoleIdQuery } from '@/api/MPOSlices/UserSlice';

import { useDispatch } from 'react-redux';
import { addUserList } from '@/reducers/tourPlanReducer';
import { BSDate } from "nepali-datepicker-react";
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import MyExecutiveDoctorDcr from './myExecutiveDoctorDcr';
import MyExecutiveChemistDcr from './myExecutiveChemistDcr';
import MyExecutiveStockistDcr from './myExecutiveStockistDcr';
import { useGetUsersByIdQuery } from '@/api/DemoUserSlice';
import MyHoDcr from './myHoDcr';
import { useSelector } from 'react-redux';

const TABLE_HEAD = [
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'area_name', label: 'Area Name', alignRight: false },
    { id: 'shift', label: 'Shift', alignRight: false },
    { id: 'month', label: 'Month', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: '' },
];

const MyExecutivesDcr = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const dispatch = useDispatch();

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const roleList = useGetCompanyRolesByCompanyQuery(company_id, {
        skip: !company_id
    });
    const { data: myHigherData } = useGetUsersByHigherLevelUserQuery(company_user_id, {
        skip: !company_user_id
    });

    const lowerList = useMemo(() => {
        if (myHigherData !== undefined) {
            return myHigherData?.map((key, index) => ({
                id: key.id,
                title: key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name
            }));
        }
        return [];
    }, [myHigherData])

    const [selectedOption, setSelectedOption] = useState(() => {
        // Check if myHigherData is not empty and contains at least one element
        if (lowerList && lowerList.length > 0) {
            return lowerList[0]?.id;
        }
        return null; // Set default value if myHigherData is empty or undefined
    });


    const handleOptionChange = useCallback((event) => {
        setSelectedOption(event.target.value);
    }, []);

    const [companyRoleList, setCompanyRoleList] = useState([]);
    const [companyUserList, setCompanyUserList] = useState([]);
    const [roleSelect, setRoleSelect] = useState('');
    const userList = useGetUsersByCompanyRoleIdQuery({ id: company_id, page: roleSelect?.id }, {
        skip: !company_id || !roleSelect?.id
    });

    const userData = useGetUsersByIdQuery(company_user_id, {
        skip: !company_user_id
    });

    useEffect(() => {
        let dataList = []
        if (roleList?.data) {
            roleList.data.map((key) => {
                dataList.push({ id: key.id, title: key.role_name_value })
            })
        }
        setCompanyRoleList(dataList);
    }, [roleList])


    useEffect(() => {
        let dataList1 = []
        if (userList?.data) {
            userList.data.map((key) => {
                dataList1.push({ id: key.id, title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name })
            })
        }
        setCompanyUserList(dataList1);
        dispatch(addUserList(dataList1))
    }, [userList])

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);


    //! Option

    const [page, setPage] = useState(1);

    const [selectedYear, setSelectedYear] = useState(yearData);
    const yearList = ['2075', '2076', '2077', '2078', '2079', '2080', '2081', '2082', '2083', '2084', '2085', '2086', '2087', '2088', '2089', '2090']

    const months = [
        { value: 'Baisakh', label: 'Baisakh' },
        { value: 'Jesth', label: 'Jestha' },
        { value: 'Asadh', label: 'Asadh' },
        { value: 'Shrawan', label: 'Shrawan' },
        { value: 'Bhadra', label: 'Bhadra' },
        { value: 'Ashwin', label: 'Ashwin' },
        { value: 'Kartik', label: 'Kartik' },
        { value: 'Mangsir', label: 'Mangsir' },
        { value: 'Poush', label: 'Poush' },
        { value: 'Magh', label: 'Magh' },
        { value: 'Falgun', label: 'Falgun' },
        { value: 'Chaitra', label: 'Chaitra' },
    ]
    const [selectedMonth, setSelectedMonth] = useState(monthData)
    const handleNepaliMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const [selectedDCRType, setSelectedDCRType] = useState("Doctor");

    const handleOptionDCRType = useCallback((e) => {
        setSelectedDCRType(e.target.value);
    }, [])

    const [mpoName, setMPOName] = useState('');

    const handleInputMPOChange = useCallback((event) => {
        const { name, value } = event.target;

        setMPOName(event.target.value)
    }, []);

    const handleRoleSelect = useCallback((e, value) => {
        setRoleSelect(value);
    }, [])



    //! Date Format 
    const [startDate, setStartDate] = useState();
    const [dateData, setDateData] = useState()

    const handleDateChange = (date) => {
        setStartDate(date)
        if (date) {
            const nextDate = new Date(date.getTime());
            nextDate.setDate(nextDate.getDate() + 1);
            const dateValue = nextDate.toISOString().split('T')[0];
            setDateData(dateValue);
        }
    }

    // !Delete TourPlan
    const [deleteTourPlan] = useDeleteTourPlansByIdMutation()

    //! Dialogue 
    const [openDialogue, setOpenDialogue] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true)
    }, [])

    const handleClose = useCallback(() => {
        setOpenDialogue(false)
    }, [])

    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]
    const { data: TourPlanSearch } = useGetTourplanOfMpoByDateMonthQuery({ company_name: company_id, date: selectedYear, month: selectedMonth, mpo_name: selectedOption, page: page }, {
        skip: !company_id || !selectedYear || !selectedMonth || !selectedOption || !page
    })

    return (
        <>
            <Grid item xs={10}>
                <Typography style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Executives DCR</Typography>
            </Grid>
            <SelectDataDCR />
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item md={2}>
                            <FormControl>
                                <InputLabel id="mpo-select-label">Year</InputLabel>
                                <Select
                                    labelId="mpo-select-label"
                                    id="mpo-select"
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    label="Year"
                                >
                                    <MenuItem value="">None</MenuItem>
                                    {yearList.map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={2}>
                            <FormControl fullWidth>
                                <InputLabel>Month</InputLabel>
                                <Select
                                    value={selectedMonth}
                                    onChange={handleNepaliMonthChange}
                                    label="Month"
                                >
                                    {months.map((month) => (
                                        <MenuItem key={month.value} value={month.value}>
                                            {month.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={2}>
                            {/* <FormControl>
                                <Autocomplete
                                    options={lowerList}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleOptionChange}
                                    renderInput={(params) => (
                                        <TextField value={selectedOption} {...params} label="User" />
                                    )}
                                />
                            </FormControl> */}
                            <FormControl fullWidth>
                                <InputLabel>User</InputLabel>
                                <Select
                                    value={selectedOption}
                                    onChange={handleOptionChange}
                                    label="Month"
                                >
                                    {lowerList.map((month) => (
                                        <MenuItem key={month.id} value={month.id}>
                                            {month.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={2}>
                            {
                                userData?.data?.role_name.role_name.role_name === "ASM" &&
                                <FormControl>
                                    <InputLabel id="mpo-select-label">DCR Type</InputLabel>
                                    <Select
                                        labelId="mpo-select-label"
                                        id="mpo-select"
                                        value={selectedDCRType}
                                        onChange={handleOptionDCRType}
                                        label="DCR Type"
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem key={"doctor"} value={"Doctor"}>
                                            {"Doctor"}
                                        </MenuItem>
                                        <MenuItem key={"chemist"} value={"Chemist"}>
                                            {"Chemist"}
                                        </MenuItem>
                                        <MenuItem key={"stockist"} value={"Stockist"}>
                                            {"Stockist"}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            }
                        </Grid>
                        {/* <Grid item xs={2.85}>
                            <NepaliDatePicker
                                inputClassName="form-control-design"
                                value={dateData}
                                onChange={(value) => setDateData(value)}
                                options={{ calenderLocale: "en", valueLocale: "en" }}
                            />
                        </Grid> */}
                    </Grid>
                </Box>
                <>
                    {
                        userData?.data?.role_name.role_name.role_name === "ASM" ?
                            <>
                                {selectedDCRType === "Doctor" &&
                                    <MyExecutiveDoctorDcr
                                        selectedUser={selectedOption}
                                        selectedMonth={selectedMonth}
                                        selectedDate={selectedYear}
                                    />
                                }
                                {selectedDCRType === "Chemist" &&
                                    <MyExecutiveChemistDcr
                                        selectedUser={selectedOption}
                                        selectedMonth={selectedMonth}
                                        selectedDate={selectedYear}
                                    />
                                }
                                {selectedDCRType === "Stockist" &&
                                    <MyExecutiveStockistDcr
                                        selectedUser={selectedOption}
                                        selectedMonth={selectedMonth}
                                        selectedDate={selectedYear}
                                    />
                                }
                            </> :
                            <>
                                <MyHoDcr
                                    selectedUser={selectedOption}
                                    selectedMonth={selectedMonth}
                                    selectedDate={selectedYear}
                                />
                            </>
                    }

                </>
            </Card>
        </>
    )
}

export default React.memo(MyExecutivesDcr)