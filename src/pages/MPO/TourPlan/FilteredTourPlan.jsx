import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Card,
    Badge,
    Table,
    Paper,
    Button,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    Box,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Pagination
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DefaultTourPlan from './DefaultTourPlan';
import EditTourPlan from './EditTourPlan'
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker.css';
import "nepali-datepicker-reactjs/dist/index.css"

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import SelectDataDCR from '../DCR/SelectDataDCR';

import {
    useDeleteTourPlansByIdMutation,
    useGetTourplanOfMpoByDateMonthQuery
} from '@/api/MPOSlices/TourPlanSlice';
import {
    useGetUsersMPOWalaQuery
} from '@/api/MPOSlices/UserSlice';
import { useGetCompanyRolesByCompanyQuery } from '@/api/CompanySlices/companyRolesSlice';
import { useGetUsersByCompanyRoleIdQuery } from '@/api/MPOSlices/UserSlice';

import { useDispatch } from 'react-redux';
import FilteredHOTourPlan from './higherOrderTourPlan/FilterHOTourPlan';
import { BSDate } from "nepali-datepicker-react";
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import moment from 'moment';
import ApprovedTP from '../dashboard/myExecutivesTp/approveTp';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TABLE_HEAD = [
    { id: 'mpo_name', label: 'Name', alignRight: false },
    { id: 'area_name', label: 'Area', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'is_approved', label: 'Approve TP', alignRight: false },
    { id: 'hulting_station', label: 'Hulting Station', alignRight: false },
    { id: "unplanned_tp", label: "Unplanned Tourplan", alignRight: false },
    { id: "approved_by", label: "Approved By", alignRight: false },
    { id: "" }
];

const FilteredTourPlan = () => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const localData = JSON.parse(localStorage.getItem('user_login'));
    useEffect(() => {
        if (localData) {
            sessionStorage.setItem('User_id', localData.user_id);
            sessionStorage.setItem('company_id', localData.company_id);
            sessionStorage.setItem('company_user_id', localData.company_user_id);
            sessionStorage.setItem('company_user_role_id', localData.company_user_role_id);
            sessionStorage.setItem('company_division_name', localData.company_division_name);
            sessionStorage.setItem('refresh', localData.token.refresh);
            sessionStorage.setItem('access', localData.token.access);
            sessionStorage.setItem('email', localStorage.getItem('email'));
            sessionStorage.setItem('is_highest_priority', localData.is_highest_priority)
            if (localData.role === "ASM") {
                sessionStorage.setItem('user_role', 'other-roles')
            } else if (localData.role === "RSM" || localData.role === "SM" || localData.role === "MM" || localData.role === "CH") {
                sessionStorage.setItem('user_role', 'other-roles')
                sessionStorage.setItem('role', 'other')
            }
            localStorage.removeItem('user_login');
            localStorage.removeItem('email');
        }
    }, [localData])

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const role = searchParams.get('role');

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

    const [companyRoleList, setCompanyRoleList] = useState([]);
    const [roleSelect, setRoleSelect] = useState('');

    useEffect(() => {
        let dataList = []
        if (roleList?.data) {
            roleList?.data?.map((key) => {
                dataList.push({ id: key.id, title: key.role_name.role_name })
            })
        }
        setCompanyRoleList(dataList);
    }, [roleList])

    //! Pagnation
    const [page, setPage] = useState(1);
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])


    // const [companyUserList, setCompanyUserList] = useState([]);
    const userList = useGetUsersByCompanyRoleIdQuery({ id: company_id, page: '' }, {
        skip: !company_id || !page
    });

    const companyUserList = [];

    if (userList !== undefined) {
        userList?.data?.map((key) => {
            const roleName = key.role_name && key.role_name.role_name && key.role_name.role_name.role_name;
            companyUserList.push({ id: key.id, title: `${key.user_name.first_name} ${key.user_name.middle_name} ${key.user_name.last_name}`, role: roleName });
        })
    }

    const [selectedOption, setSelectedOption] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedOption) {
            navigate(`/dashboard/admin/tourplan?id=${selectedOption?.id}&role=${selectedOption?.role}`)
        }
    }, [selectedOption])


    const handleOptionChange = useCallback((event, value) => {
        setSelectedOption(value);
    }, []);



    // useEffect(() => {
    //     let dataList1 = []
    //     if (userList?.data) {
    //         userList.data.forEach((key) => {
    //             // Perform null/undefined check for 'role_name' and 'role' properties
    //             const roleName = key.role_name && key.role_name.role_name && key.role_name.role_name.role_name;
    //             dataList1.push({ id: key.id, title: `${key.user_name.first_name} ${key.user_name.middle_name} ${key.user_name.last_name}`, role: roleName });
    //         });
    //     }
    //     setCompanyUserList(dataList1);
    //     dispatch(addUserList(dataList1));
    // }, [userList]);

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    //! Get User roles wala
    const { data, isLoading, isSuccess, isError, error } = useGetUsersMPOWalaQuery(company_id, {
        skip: !company_id
    })

    const rolesOptions = useMemo(() => {
        if (isSuccess) {
            return data?.results?.map((key) => ({
                id: key.id,
                title: key.user_name.email
            }));
        }
        return [];
    }, [data])


    //! Options


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


    // const dateOnly = dateString.split('T')[0];

    // const { data: TourPlanSearch } = useGetTourplanOfMpoByDateMonthQuery({ company_name: company_id, date: selectedYear, month: selectedMonth, mpo_name: user_role === 'admin' ? id : company_user_id, page: page, role_data: user_role === 'admin' ? "" : '' }, {
    //     skip: !company_id || !selectedMonth || !user_role || !id || !company_user_id || !page || !user_role
    // })

    const { data: TourPlanSearch } = user_role === "MPO" && useGetTourplanOfMpoByDateMonthQuery(
        {
            company_name: company_id,
            date: selectedYear,
            month: selectedMonth,
            mpo_name: user_role === 'admin' ? id : company_user_role_id,
            page: page,
            role_data: user_role === 'admin' ? "" : '',
        },
        // {
        //     skip: !company_id || !selectedMonth || !id || !company_user_role_id || !page,
        // }
    );


    //! Search results

    const [mpoName, setMPOName] = useState('');

    const handleInputMPOChange = (event) => {
        const { name, value } = event.target;

        setMPOName(event.target.value)
    }

    const handleRoleSelect = (e, value) => {
        setRoleSelect(value);
    }



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

    //! onSearch


    // useEffect(() => {
    //     if (selectedOption || selectedMonth || dateData) {
    //         searchMPOFilter(FilteredData)
    //     }
    // }, [selectedOption, selectedMonth, dateData])


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

    console.log('role', role);
    console.log('user_role', user_role);


    return (
        <>
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
                        <Grid item xs={5.5}>
                        </Grid>
                        {
                            user_role === 'admin' &&
                            <Grid item md={2.5} xs={6}>
                                <ApprovedTP mpoName={id} role={role} />
                            </Grid>
                        }
                    </Grid>
                </Box>
                <>
                    {
                        role === "MPO" || user_role === "MPO" ?
                            <>
                                {
                                    selectedMonth || selectedYear ?
                                        <Card>
                                            <Scrollbar>
                                                <TableContainer sx={{ minWidth: 1000 }}>
                                                    <Table>
                                                        <UserListHead
                                                            headLabel={TABLE_HEAD}
                                                        />
                                                        <TableBody>
                                                            <>
                                                                {

                                                                    TourPlanSearch === undefined ? <>
                                                                        {
                                                                            eightArrays.map((key) => {
                                                                                return (
                                                                                    <TableRow key={key} tabIndex={-1} role="checkbox" >
                                                                                        <TableCell padding="checkbox" >
                                                                                            <Skeleton />
                                                                                        </TableCell>
                                                                                        <TableCell><Skeleton /></TableCell>
                                                                                        <TableCell><Skeleton /></TableCell>
                                                                                        <TableCell><Skeleton /></TableCell>
                                                                                        <TableCell><Skeleton /></TableCell>
                                                                                        <TableCell><Skeleton /></TableCell>
                                                                                        <TableCell><Skeleton /></TableCell>
                                                                                        <TableCell><Skeleton /></TableCell>
                                                                                    </TableRow>
                                                                                )
                                                                            })}
                                                                    </> :
                                                                        <>
                                                                            {TourPlanSearch && TourPlanSearch.count == 0 ?
                                                                                <TableRow>
                                                                                    <TableCell align="center" colSpan={7.5} sx={{ py: 3 }}>
                                                                                        <Paper
                                                                                            sx={{
                                                                                                textAlign: 'center',
                                                                                            }}
                                                                                        >
                                                                                            <Typography variant="h6" paragraph>
                                                                                                Not found
                                                                                            </Typography>
                                                                                            <Typography variant="body2">
                                                                                                <strong>Requested Data Not found</strong>.
                                                                                                <br /> Try checking for typos or using complete words.
                                                                                                <br />
                                                                                                <br />
                                                                                                <br />
                                                                                                <br />
                                                                                                <br />
                                                                                            </Typography>
                                                                                        </Paper>
                                                                                    </TableCell>
                                                                                </TableRow>
                                                                                :
                                                                                TourPlanSearch.results.map((tourplan, index) => {
                                                                                    return (
                                                                                        <TableRow hover tabIndex={-1} role="checkbox" key={tourplan.id}
                                                                                        >
                                                                                            <TableCell>{index + 1}</TableCell>
                                                                                            <TableCell component="th" scope="row" align="left">
                                                                                                <Typography variant="subtitle2" noWrap>
                                                                                                    {tourplan.mpo_name.user_name.first_name + " " + tourplan.mpo_name.user_name.middle_name + " " + tourplan.mpo_name.user_name.last_name}
                                                                                                </Typography>
                                                                                            </TableCell>
                                                                                            <TableCell align="left">
                                                                                                {
                                                                                                    tourplan.mpo_area_read.map((key, index) => (
                                                                                                        <Typography style={{ fontSize: '12px', color: "black", fontWeight: '600' }} key={index}>{key.company_mpo_area_id.area_name},</Typography>
                                                                                                    ))

                                                                                                }
                                                                                            </TableCell>
                                                                                            <TableCell align="left">{moment(tourplan.tour_plan.tour_plan.select_the_date_id).format('DD')}</TableCell>
                                                                                            <TableCell align="left">{tourplan.is_approved === true ? "Approved" : "Not Approved"}</TableCell>
                                                                                            <TableCell align="left">{tourplan.tour_plan.tour_plan.hulting_station}</TableCell>
                                                                                            <TableCell align="left">{tourplan.tour_plan.tour_plan.is_unplanned === true ? "Unplanned" : "Not Unplanned"}</TableCell>
                                                                                            <TableCell align="left">{tourplan.approved_by.user_name.first_name + " " + tourplan.approved_by.user_name.middle_name + " " + tourplan.approved_by.user_name.last_name}</TableCell>
                                                                                            {/* //! Edit  */}
                                                                                            <TableCell align="left">
                                                                                                {
                                                                                                    user_role === 'admin' &&
                                                                                                    <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan.id)} >
                                                                                                        <Badge>
                                                                                                            <Iconify icon="eva:edit-fill" />
                                                                                                        </Badge>
                                                                                                    </IconButton>
                                                                                                }
                                                                                                {
                                                                                                    user_role === "MPO" &&
                                                                                                    <>
                                                                                                        {
                                                                                                            tourplan.is_approved === false ?
                                                                                                                <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan.id)} >
                                                                                                                    <Badge>
                                                                                                                        <Iconify icon="eva:edit-fill" />
                                                                                                                    </Badge>
                                                                                                                </IconButton> : null
                                                                                                        }
                                                                                                    </>
                                                                                                }
                                                                                                {/* //! Delete  */}
                                                                                                {
                                                                                                    user_role === 'admin' &&
                                                                                                    <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(tourplan.id); handleClickOpen() }}>
                                                                                                        <Badge>
                                                                                                            <Iconify icon="eva:trash-2-outline" />
                                                                                                        </Badge>
                                                                                                    </IconButton>
                                                                                                }
                                                                                            </TableCell>
                                                                                            <Dialog
                                                                                                fullScreen={fullScreen}
                                                                                                open={openDialogue}
                                                                                                onClose={handleClose}
                                                                                                aria-labelledby="responsive-dialog-title"
                                                                                            >
                                                                                                <DialogTitle id="responsive-dialog-title">
                                                                                                    {"Are you sure want to delete?"}
                                                                                                </DialogTitle>
                                                                                                <DialogActions>
                                                                                                    <Button autoFocus onClick={() => { deleteTourPlan(selectedId); handleClose() }}>
                                                                                                        Yes
                                                                                                    </Button>
                                                                                                    <Button
                                                                                                        onClick={handleClose}
                                                                                                        autoFocus>
                                                                                                        No
                                                                                                    </Button>
                                                                                                </DialogActions>
                                                                                            </Dialog>
                                                                                        </TableRow>
                                                                                    )
                                                                                })

                                                                            }
                                                                        </>}
                                                            </>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                {isDrawerOpen && <EditTourPlan
                                                    idharu={selectedUpdateId} onClose={onCloseDrawer}
                                                />
                                                }
                                            </Scrollbar>
                                            <Box justifyContent={'center'} alignItems='center' display={'flex'}
                                                sx={{ margin: "20px 0px" }} >
                                                {TourPlanSearch ?
                                                    <Pagination
                                                        count={parseInt(TourPlanSearch?.count / 200) + 1}
                                                        onChange={handleChangePage}
                                                    /> : <></>}
                                            </Box>
                                        </Card> : <DefaultTourPlan />
                                }
                            </> : <FilteredHOTourPlan
                                selectedUser={id}
                                selectedMonth={selectedMonth}
                                selectedDate={selectedYear}
                                role={''}
                            />
                    }
                </>
            </Card>
        </>
    )
}

export default React.memo(FilteredTourPlan)