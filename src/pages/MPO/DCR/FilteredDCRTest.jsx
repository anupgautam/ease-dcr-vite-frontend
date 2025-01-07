import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    Grid,
    Autocomplete,
    TextField, Stack
} from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import ChemistDCR from './DCRLists/chemistDCR';
import DoctorDCR from './DCRLists/doctorDCR';
import StockistDCR from './DCRLists/stockistDCR';
import DefaultChemistDCR from './DefaultDCRLists/DefaultChemistDCR';
import DefaultDoctorDCR from './DefaultDCRLists/DefaultDoctorDCR';
import DefaultStockistDCR from './DefaultDCRLists/DefaultStockistDCR';
import { useGetCompanyRolesByCompanyQuery, } from '../../../api/MPOSlices/companyRolesSlice';
import { useGetUsersByCompanyRoleIdQuery } from '../../../api/MPOSlices/UserSlice';
import { addUserList } from '@/reducers/tourPlanReducer';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import DefaultHODCR from './DefaultDCRLists/DefautlHigherOrderDCR';
import HODCR from './DCRLists/hoDCR';

import SelectDataDCR from './SelectDataDCR';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ExportDoctorDCR from './ExportDoctorDCR';
import ExportChemistDCR from './ExportChemistDCR';
import ExportStockistDCR from './ExportStockistDCR';
import ExportHODCR from './ExportHODCR';

const FilteredDCRTest = () => {

    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const role = searchParams.get('role');
    const date = searchParams.get('date');
    const dateOnly = date?.split('T')[0];
    const dispatch = useDispatch();

    const [selectedId, setSelectedId] = useState(null);
    const roleList = useGetCompanyRolesByCompanyQuery(company_id, {
        skip: !company_id
    });

    const [companyUserList, setCompanyUserList] = useState([]);
    const userList = useGetUsersByCompanyRoleIdQuery({ id: company_id, page: '' }, {
        skip: !company_id
    })
    const [selectedDCRType, setSelectedDCRType] = useState("Doctor");

    const handleOptionDCRType = useCallback((e) => {
        setSelectedDCRType(e.target.value);
    }, [])

    useEffect(() => {
        let dataList = []
        if (roleList?.data) {
            roleList?.data.map((key) => {
                dataList.push({ id: key.id, title: key?.role_name?.role_name })
            })
        }
    }, [roleList])

    useEffect(() => {
        let dataList1 = []
        if (userList?.data) {
            userList?.data.map((key) => {
                dataList1.push({ id: key.id, title: key?.user_name?.first_name + " " + key?.user_name?.middle_name + " " + key?.user_name?.last_name, role: key?.role_name?.role_name?.role_name })
            })
        }
        setCompanyUserList(dataList1);
        dispatch(addUserList(dataList1))

    }, [userList])

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;

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
    const handleNepaliMonthChange = useCallback((event) => {
        setSelectedMonth(event.target.value);
        // 
    }, []);

    //! Date Format 
    const [startDate, setStartDate] = useState(null);
    const [dateData, setDateData] = useState('')

    const handleDateChange = useCallback((date) => {
        setStartDate(date)
        if (date) {
            const nextDate = new Date(date.getTime());
            nextDate.setDate(nextDate.getDate() + 1);
            const dateValue = nextDate.toISOString().split('T')[0];
            setDateData(dateValue);
        }
    }, [])

    const handleOptionUserId = useCallback((e, value) => {
        setSelectedId(value);
    }, [])

    const navigate = useNavigate();

    useEffect(() => {
        if (selectedId) {
            navigate(`/dashboard/admin/dcr?id=${selectedId?.id}&role=${selectedId?.role}`)
        }
    }, [selectedId])


    return (
        <>
            <SelectDataDCR />
            <Card>
                <div style={{ padding: "16px" }}>
                    {/* Year and Month Dropdown */}
                    <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "16px" }}>
                        {user_role !== "admin" && (
                            <Grid item xs={4} sm={2.5}>
                                <FormControl style={{ flex: 1 }}>
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
                        )}

                        {user_role !== "admin" && (
                            <Grid item xs={4} sm={2.5}>
                                <FormControl style={{ flex: 1 }}>
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
                        )}
                    </div>

                    {/* DCR Type Dropdown and Other Components */}
                    <div>
                        {user_role === "MPO" || role === "MPO" ? (
                            <Stack direction="column" spacing={2}>
                                <Grid item xs={4} sm={2.5}>
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
                                                Doctor
                                            </MenuItem>
                                            <MenuItem key={"chemist"} value={"Chemist"}>
                                                Chemist
                                            </MenuItem>
                                            <MenuItem key={"stockist"} value={"Stockist"}>
                                                Stockist
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Conditional Rendering Based on DCR Type */}
                                {/*//! Doctor  */}
                                {selectedDCRType === "Doctor" && selectedYear && selectedMonth && (
                                    <>
                                        <ExportDoctorDCR
                                            selectedUser={selectedId?.id || id}
                                            selectedMonth={selectedMonth}
                                            selectedDate={dateData}
                                            dateOnly={dateOnly}
                                        />
                                        <DefaultDoctorDCR />
                                    </>
                                )}

                                {/*//! Chemist  */}
                                {selectedDCRType === "Chemist" && selectedYear && selectedMonth && (
                                    <>
                                        <ExportChemistDCR
                                            selectedUser={selectedId ? selectedId?.id : id}
                                            selectedMonth={selectedMonth}
                                            selectedDate={dateData}
                                            dateOnly={dateOnly}
                                        />
                                        {/* <DefaultDoctorDCR /> */}
                                    </>
                                )}

                                {/*//! Stockist  */}
                                {selectedDCRType === "Stockist" && selectedYear && selectedMonth && (
                                    <>
                                        <ExportStockistDCR
                                            selectedUser={selectedId ? selectedId : id}
                                            selectedMonth={selectedMonth}
                                            selectedDate={selectedYear}
                                            dateOnly={dateOnly}
                                        />
                                        {/* <DefaultDoctorDCR /> */}
                                    </>
                                )}

                                {/*//! OtherRoles  */}
                                {selectedDCRType === "other-roles" && selectedYear && selectedMonth && (
                                    <>
                                        <ExportHODCR
                                            selectedUser={selectedId ? selectedId?.id : id}
                                            selectedMonth={selectedMonth}
                                            selectedDate={selectedYear}
                                        />
                                        {/* <DefaultDoctorDCR /> */}
                                    </>
                                )}


                            </Stack>
                        ) : user_role === "admin" ? (
                            <Stack direction="column" spacing={2} padding="20px" paddingBottom="0px">
                                <FormControl sx={{ minWidth: 200 }}>
                                    <InputLabel id="mpo-select-label">DCR Type</InputLabel>
                                    <Select
                                        labelId="mpo-select-label"
                                        id="mpo-select"
                                        value={selectedDCRType}
                                        onChange={handleOptionDCRType}
                                        label="DCR Type"
                                    >
                                        <MenuItem value="">None</MenuItem>
                                        <MenuItem key="doctor" value="Doctor">Doctor</MenuItem>
                                        <MenuItem key="chemist" value="Chemist">Chemist</MenuItem>
                                        <MenuItem key="stockist" value="Stockist">Stockist</MenuItem>
                                        <MenuItem key="other-roles" value="other-roles">Other Roles</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        ) : null}

                        {/* //! Export Wala Additional Components Based on Selected DCR Type */}
                        {/* {selectedDCRType && selectedYear && selectedMonth && (
                            <>
                                {selectedDCRType === "Doctor" && (
                                    <ExportDoctorDCR
                                        selectedUser={selectedId?.id || id}
                                        selectedMonth={selectedMonth}
                                        selectedDate={dateData}
                                        dateOnly={dateOnly}
                                    />
                                )}
                                {selectedDCRType === "Chemist" && (
                                    <ExportChemistDCR
                                        selectedUser={selectedId?.id || id}
                                        selectedMonth={selectedMonth}
                                        selectedDate={dateData}
                                        dateOnly={dateOnly}
                                    />
                                )}
                                {selectedDCRType === "Stockist" && (
                                    <ExportStockistDCR
                                        selectedUser={selectedId?.id || id}
                                        selectedMonth={selectedMonth}
                                        selectedDate={dateData}
                                        dateOnly={dateOnly}
                                    />
                                )}
                                {selectedDCRType === "other-roles" && (
                                    <ExportHODCR
                                        selectedUser={selectedId?.id || id}
                                        selectedMonth={selectedMonth}
                                        selectedDate={dateData}
                                    />
                                )}
                            </>
                        )} */}
                    </div>
                </div>
            </Card>

        </>
    )
}
export default FilteredDCRTest