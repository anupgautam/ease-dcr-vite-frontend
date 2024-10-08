import React, { useState, useMemo } from 'react'
import {
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    TextField
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';

import {
    useGetAreaMPOByIdQuery,
    useGetTourplanOfMpoByDateMonthQuery,
} from '../../../api/MPOSlices/TourPlanSlice'
import {
    useGetAllcompanyUserRolesWithoutPaginationQuery,
    useGetcompanyUserRolesByIdQuery
} from '@/api/CompanySlices/companyUserRoleSlice';
import {
    useGetCompanyRolesByCompanyQuery
} from '@/api/MPOSlices/companyRolesSlice';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import ExportToExcel from '@/reusable/utils/exportSheet';
import { useGetHOTourPlansByUserIdQuery } from '@/api/HighOrderSlices/hoTourPlanSlice';
import { useSelector } from 'react-redux';

function useAreaData(areaId) {
    const { data } = useGetAreaMPOByIdQuery(areaId, {
        skip: !areaId
    }).unwrap()
}

function useVisitedWithData(visitedWithId) {
    const { data } = useGetcompanyUserRolesByIdQuery(visitedWithId, {
        skip: !visitedWithId
    }).unwrap()
}

const ExcelCSVTourPlan = () => {
    const { company_id, user_role } = useSelector((state) => state.cookie);

    //! Get Company Roles wala
    const Role = useGetCompanyRolesByCompanyQuery(company_id, {
        skip: !company_id
    })

    const rolesOptions = useMemo(() => {
        if (Role?.data) {
            return Role?.data?.map((key) => ({
                id: key.id,
                title: key.role_name_value
            }));
        } return [];
    }, [Role])

    const [selectedRole, setSelectedRole] = useState('');
    const handleRoleChange = (event, value) => {
        setCompanyId(company_id);
        setSelectedRole(value?.id);
    };

    //! Get users wala
    const User = useGetAllcompanyUserRolesWithoutPaginationQuery({ id: company_id }, {
        skip: !company_id
    })

    const userOptions = useMemo(() => {
        if (User?.data) {
            return User?.data?.map((key) => ({
                id: key.id,
                title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name,
                role: key.role_name.role_name.role_name,
            }));
        }
        return []
    }, [User])

    const [companyId, setCompanyId] = useState();
    const [selectedUser, setSelectedUser] = useState()
    const handleUserChange = (event, value) => {
        setCompanyId(company_id);
        setSelectedUser(value);
    };

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;

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
    const years = [
        { value: 2075, label: "2075" },
        { value: 2076, label: "2076" },
        { value: 2077, label: "2077" },
        { value: 2078, label: "2078" },
        { value: 2079, label: "2079" },
        { value: 2080, label: "2080" },
        { value: 2081, label: "2081" },
        { value: 2082, label: "2082" },
        { value: 2083, label: "2083" },
        { value: 2084, label: "2084" },
        { value: 2085, label: "2085" },
        { value: 2086, label: "2086" },
        { value: 2087, label: "2087" },
        { value: 2088, label: "2088" },
        { value: 2089, label: "2089" },
        { value: 2090, label: "2090" },
    ]
    const [selectedYear, setSelectedYear] = useState(yearData);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        setCompanyId(company_id);
    };

    const headers = [
        { label: 'S.No.', key: 'sno', fontSize: 13, fontColor: '#008000', fontWeight: 'bold' },
        { label: 'Date', key: 'date', fontSize: 13, fontColor: '#008000', fontWeight: 'bold' },
        { label: 'Area', key: 'area', fontSize: 13, fontColor: '#008000', fontWeight: 'bold' },
        { label: 'Visited With', key: 'visited_with', fontSize: 13, fontColor: '#008000', fontWeight: 'bold' },
        { label: 'Hulting Station', key: 'hulting_station', fontSize: 13, fontColor: '#008000', fontWeight: 'bold' },
    ];

    const headers1 = [
        { label: 'S.No.', key: 'sno', fontSize: 13, fontColor: '#008000', fontWeight: 'bold' },
        { label: 'Date', key: 'date', fontSize: 13, fontColor: '#008000', fontWeight: 'bold' },
        { label: 'Area', key: 'area', fontSize: 13, fontColor: '#008000', fontWeight: 'bold' },
        { label: 'Remark', key: 'remark', fontSize: 13, fontColor: '#008000', fontWeight: 'bold' },
        { label: 'Hulting Station', key: 'hulting_station', fontSize: 13, fontColor: '#008000', fontWeight: 'bold' },
    ];

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { data: TourPlanSearch } = useGetTourplanOfMpoByDateMonthQuery({ company_name: company_id, date: selectedYear, month: selectedMonth, mpo_name: selectedUser?.id, page: 1, role_data: user_role === 'admin' ? "" : '' }, {
        skip: !company_id || !selectedMonth || !selectedYear || !user_role || !selectedUser?.id
    })

    const templateData1 = TourPlanSearch?.results?.map((values, index) => ({
        sno: index + 1,
        date: values?.tour_plan?.tour_plan.select_the_date_id,
        area: values?.mpo_area_read?.map(key => key.company_mpo_area_id.area_name).join(', '),
        remark: values?.tour_plan?.tour_plan.purpose_of_visit,
        hulting_station: values?.tour_plan?.tour_plan.hulting_station,
    }))

    // const hoTourPlan = useGetHOTourPlansByUserIdQuery({ user_id: selectedUser?.id, month: selectedMonth, date: selectedYear, page: 1, company_name: company_id });
    // const hoTourPlanData = hoTourPlan.data;

    // const [templateData, setTemplateData] = useState([]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (hoTourPlanData) {
    //             const results = await Promise.all(hoTourPlanData.results.map(async (values) => {
    //                 const visitedData = await Promise.all(values?.visited_data?.map(async (visitedItem) => {
    //                     // Call Hooks at the top level
    //                     const areaData = await useAreaData(visitedItem?.area);
    //                     const visitedWithData = await useVisitedWithData(visitedItem?.visited_with);
    //                     return { areaData, visitedWithData };
    //                 }));
    //                 return visitedData;
    //             }));
    //             setTemplateData(results);
    //         }
    //     };

    //     fetchData();
    // }, [hoTourPlanData]);


    return (
        <>
            <Button color="success" variant="contained" startIcon={<Iconify icon="mdi:microsoft-excel" />} onClick={() => setIsDrawerOpen(true)} >
                Export Data
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
                        // width="400px"
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
                            Export Tour Plan
                        </Typography>

                    </Box>
                    <Box marginBottom={2}>
                        <Autocomplete
                            options={userOptions}
                            getOptionLabel={(option) => option.title}
                            onChange={handleUserChange}
                            renderInput={(params) => (
                                <TextField {...params} label="Users" />
                            )}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.title}
                                </li>
                            )}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <FormControl fullWidth>
                            <InputLabel>Months</InputLabel>
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
                    </Box>
                    <Box marginBottom={2}>
                        <FormControl fullWidth>
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={selectedYear}
                                onChange={handleYearChange}
                                label="Year"
                            >
                                {years.map((year) => (
                                    <MenuItem key={year.value} value={year.value}>
                                        {year.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Stack spacing={1} direction="row">
                        {TourPlanSearch &&
                            <>
                                {/* <Box marginTop={2}>
                                    <ExportToExcel
                                        headers={selectedUser?.role === "MPO" ? headers1 : headers}
                                        fileName={`${selectedUser?.role === "MPO" ? selectedUser.title + ' ' + 'Tour Plan' : 'All Tour Plan'}`}
                                        data={selectedUser?.role === "MPO" ? templateData1 : templateData} />
                                </Box> */}
                            </>
                        }
                    </Stack>
                </Box>
            </Drawer>
        </>
    )
}

export default React.memo(ExcelCSVTourPlan);