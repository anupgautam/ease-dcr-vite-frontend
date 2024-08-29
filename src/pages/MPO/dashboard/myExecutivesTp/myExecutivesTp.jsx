import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
//! @mui
import {
    Card,
    Badge,
    Table,
    Stack,
    Paper,
    Button,
    TableRow,
    MenuItem,
    TextField,
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
    Autocomplete,
    Pagination
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker.css';
import "nepali-datepicker-reactjs/dist/index.css"

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import SelectDataDCR from '../../DCR/SelectDataDCR';

import {
    useDeleteTourPlansByIdMutation,
    useGetAreaMPOByIdQuery,
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
import Scrollbar from '@/components/scrollbar/Scrollbar';
import EditTourPlan from '../../TourPlan/EditTourPlan';
import ApprovedTP from './approveTp';
import { useGetUsersByIdQuery } from '@/api/DemoUserSlice';
import { useGetHOTourPlansByUserIdQuery } from '@/api/HighOrderSlices/hoTourPlanSlice';
import moment from 'moment';
import { useGetcompanyUserRolesByIdQuery } from '@/api/CompanySlices/companyUserRoleSlice';
import { useSelector } from 'react-redux';


const TABLE_HEAD = [
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'area_name', label: 'Area', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'is_approved', label: 'Approved', alignRight: false },
    { id: '' },
];

const TABLE_HEAD1 = [
    { id: 'user_id', label: 'User Name', alignRight: false },
    { id: 'area', label: 'Area', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'visited_with', label: 'Visited With', alignRight: false },
    { id: '' },
];

const MyExecutiveTp = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const dispatch = useDispatch();

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const roleList = useGetCompanyRolesByCompanyQuery(company_id);
    const { data: myHigherData } = useGetUsersByHigherLevelUserQuery(company_user_id);

    const lowerList = useMemo(() => {
        if (myHigherData !== undefined) {
            return myHigherData?.map((key, index) => ({
                id: key.id,
                title: key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name,
                role: key.role_name.role_name.role_name
            }));
        }
        return [];
    }, [myHigherData])

    const [selectedOption, setSelectedOption] = useState(() => {
        if (lowerList && lowerList.length > 0) {
            return lowerList[0];
        }
        return null;
    });


    const handleOptionChange = useCallback((event, value) => {
        setSelectedOption(value);
    }, []);

    const [companyRoleList, setCompanyRoleList] = useState([]);
    const [companyUserList, setCompanyUserList] = useState([]);
    const [roleSelect, setRoleSelect] = useState('');
    const userList = useGetUsersByCompanyRoleIdQuery({ id: company_id, page: '' });

    useEffect(() => {
        let dataList = []
        if (roleList?.data) {
            roleList?.data?.map((key) => {
                dataList?.push({ id: key.id, title: key?.role_name_value })
            })
        }
        setCompanyRoleList(dataList);
    }, [roleList])

    useEffect(() => {
        let dataList1 = []
        if (userList?.data) {
            userList?.data?.map((key) => {
                dataList1.push({ id: key.id, title: key?.user_name?.first_name + " " + key?.user_name?.middle_name + " " + key?.user_name?.last_name })
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

    const { data: TourPlanSearch } = useGetTourplanOfMpoByDateMonthQuery({ company_name: company_id, date: selectedYear, month: selectedMonth, mpo_name: selectedOption !== null ? selectedOption?.id : "", page: page, role_data: '' })

    const userData = useGetUsersByIdQuery(company_user_id);

    const hoTourPlan = useGetHOTourPlansByUserIdQuery({ user_id: selectedOption !== null ? selectedOption?.id : "", month: selectedMonth, date: selectedYear, page: page, company_name: company_id })
    return (
        <>
            <Grid item xs={10}>
                <Typography style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Executives TP</Typography>
            </Grid>
            <SelectDataDCR />
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item md={2} xs={4}>
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
                        <Grid item md={2} xs={4}>
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
                        <Grid item md={2} xs={4}>
                            <FormControl>
                                <Autocomplete
                                    options={lowerList}
                                    value={selectedOption}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleOptionChange}
                                    renderInput={(params) => (
                                        <TextField value={selectedOption} {...params} label="User" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            </FormControl>
                            {/* <FormControl fullWidth>
                                <InputLabel>User</InputLabel>
                                <Select
                                    value={selectedOption.id}
                                    onChange={handleOptionChange}
                                    label="Month"
                                >
                                    {lowerList.map((month) => (
                                        <MenuItem key={month.id} value={month.id}>
                                            {month.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                        </Grid>
                        <Grid item md={3.5}></Grid>
                        <Grid item md={2.5} xs={6}>
                            <ApprovedTP mpoName={selectedOption?.id} role={selectedOption?.role} />
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
                    <>
                        <Card>
                            <Scrollbar>
                                {userData?.data?.role_name.role_name.role_name === "ASM" ?
                                    <TableContainer sx={{ minWidth: 800 }}>
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
                                                                        <TableRow id={key} tabIndex={-1} role="checkbox" >
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
                                                                                    {/* No results found for &nbsp; */}
                                                                                    {/* <strong>&quot;{selectedOption}&quot;</strong>. */}
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
                                                                                    {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                                    <Typography variant="subtitle2" noWrap>
                                                                                        {tourplan?.mpo_name?.user_name?.first_name + " " + tourplan?.mpo_name?.user_name?.middle_name + " " + tourplan?.mpo_name?.user_name?.last_name}
                                                                                    </Typography>
                                                                                    {/* </Stack> */}
                                                                                </TableCell>
                                                                                {/* <TableCell align="left">{tourplan.mpo_name.user_name.email}</TableCell> */}
                                                                                <TableCell align="left">
                                                                                    {
                                                                                        tourplan.mpo_area_read.map((key, index) => (
                                                                                            <Typography style={{ fontSize: '12px', color: "black", fontWeight: '600' }} key={index}>{key.company_mpo_area_id.area_name},</Typography>
                                                                                        ))

                                                                                    }
                                                                                </TableCell>
                                                                                {/* <TableCell align="left">{tourplan.tour_plan.tour_plan.select_the_month}</TableCell> */}
                                                                                <TableCell align="left">{moment(tourplan.tour_plan.tour_plan.select_the_date_id).format('DD')}</TableCell>
                                                                                <TableCell align="left">{tourplan.is_approved === true ? "Approved" : "Not Approved"}</TableCell>
                                                                                {
                                                                                    tourplan.is_approved === false &&
                                                                                    <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan.id)} >
                                                                                        <Badge>
                                                                                            <Iconify icon="eva:edit-fill" />
                                                                                        </Badge>
                                                                                    </IconButton>
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
                                    </TableContainer> :
                                    <TableContainer sx={{ minWidth: 800 }}>
                                        <Table>
                                            <UserListHead
                                                headLabel={TABLE_HEAD1}
                                            />
                                            <TableBody>
                                                <>
                                                    {
                                                        hoTourPlan === undefined ? <>
                                                            {
                                                                eightArrays.map((key) => (
                                                                    <TableRow key={key} >
                                                                        <TableCell><Skeleton /></TableCell>
                                                                        <TableCell><Skeleton /></TableCell>
                                                                        <TableCell><Skeleton /></TableCell>
                                                                        <TableCell><Skeleton /></TableCell>
                                                                        <TableCell><Skeleton /></TableCell>
                                                                        <TableCell><Skeleton /></TableCell>
                                                                        <TableCell><Skeleton /></TableCell>
                                                                    </TableRow>
                                                                ))}
                                                        </> :
                                                            <>
                                                                {hoTourPlan?.data?.count == 0 ?
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
                                                                                    {/* No results found for &nbsp; */}
                                                                                    {/* <strong>&quot;{selectedOption}&quot;</strong>. */}
                                                                                    <strong>Requested Data Not found</strong>.
                                                                                    <br /> Try checking for types or using complete words.
                                                                                </Typography>
                                                                            </Paper>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    :
                                                                    hoTourPlan?.data && hoTourPlan?.data?.results?.map((tourplan, index) => (
                                                                        <TableRow hover tabIndex={-1} role="checkbox" key={tourplan.id}>
                                                                            <TableCell>{index + 1}</TableCell>
                                                                            <TableCell component="th" scope="row" padding="none">
                                                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                                                    <Typography variant="subtitle2" noWrap>
                                                                                        {tourplan?.user_id?.user_name?.first_name + tourplan?.user_id?.user_name?.middle_name + " " + " " + tourplan?.user_id?.user_name?.last_name}
                                                                                    </Typography>
                                                                                </Stack>
                                                                            </TableCell>
                                                                            <TableCell component="th" scope="row" padding="none">
                                                                                <Stack direction="row" alignItems="center" spacing={2}>
                                                                                    {
                                                                                        tourplan.visited_data.map((key, index) => (
                                                                                            <HigherAreaData id={key.area} key={index} />
                                                                                        ))
                                                                                    }
                                                                                </Stack>
                                                                            </TableCell>
                                                                            <TableCell align="left">{moment(tourplan.date).format('DD')}</TableCell>
                                                                            <TableCell align="left">
                                                                                {
                                                                                    tourplan.visited_data.map((key, index) => (
                                                                                        <HigherVisitedWith key={index} id={key.visited_with} />
                                                                                    ))
                                                                                }
                                                                            </TableCell>

                                                                            {/* //! Edit  */}
                                                                            {
                                                                                tourplan.is_approved === false &&
                                                                                <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan.id)} >
                                                                                    <Badge>
                                                                                        <Iconify icon="eva:edit-fill" />
                                                                                    </Badge>
                                                                                </IconButton>
                                                                            }
                                                                            {/* //! Delete  */}
                                                                            {/* <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(tourplan.id); handleClickOpen() }}>
                                                                                <Badge>
                                                                                    <Iconify icon="eva:trash-2-outline" />
                                                                                </Badge>
                                                                            </IconButton> */}
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
                                                                                        Yes{selectedId}
                                                                                    </Button>
                                                                                    <Button
                                                                                        onClick={handleClose}
                                                                                        autoFocus>
                                                                                        No
                                                                                    </Button>
                                                                                </DialogActions>
                                                                            </Dialog>
                                                                        </TableRow>
                                                                    ))

                                                                }
                                                            </>
                                                    }
                                                </>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                }
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
                        </Card>
                    </>
                </>
            </Card>
        </>
    )
}

const HigherAreaData = ({ id }) => {
    const { data } = useGetAreaMPOByIdQuery(id);
    return (
        <>
            <Typography style={{ fontSize: '12px', color: "black", fontWeight: '600' }}>{data?.area_name},</Typography>
        </>
    )
}

const HigherVisitedWith = ({ id }) => {
    const { data } = useGetcompanyUserRolesByIdQuery(id);
    return (
        <>
            <Typography style={{ fontSize: '12px', color: "black", fontWeight: '600' }}>{data?.user_name?.first_name + " " + data?.user_name?.middle_name + " " + data?.user_name?.last_name},</Typography>
        </>
    )
}

export default React.memo(MyExecutiveTp)