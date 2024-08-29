import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Card,
    Badge,
    Table,
    Paper,
    Button,
    TableRow,
    TextField,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    Box,
    Grid,
    Autocomplete
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DefaultDoctorEvent from './DefaultDoctorEvents';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';

import {
    useSearchDoctorEventsMutation,
    useDeleteDoctorsEventsByIdMutation,
    useGetAllDoctorsWithoutPaginateQuery,
    usePostAllMPONamesNoPageMutation,
    useGetFliterDoctorEventByMpoIdQuery,
} from '../../../api/MPOSlices/DoctorSlice';
import {
    useGetUsersMPOWalaQuery
} from '../../../api/MPOSlices/UserSlice';
import Scrollbar from '@/components/scrollbar/Scrollbar';

const TABLE_HEAD = [
    { id: 'event_title', label: 'Event', alignRight: false },
    { id: 'event_date', label: 'Date', alignRight: false },
    { id: 'doctor_name', label: 'Doctor Name', alignRight: false },
    { id: 'first_name', label: 'MPO Name', alignRight: false },
    { id: '' },
];

const FilteredDoctorEvent = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [mpoId, setMPOId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id, mpo_id) => {
        setSelectedUpdateId(id);
        setMPOId(mpo_id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    //! Get User roles wala
    const { data, isLoading, isSuccess, isError, error } = useGetUsersMPOWalaQuery(company_id)

    const rolesOptions = useMemo(() => {
        if (isSuccess) {
            return data?.results?.map((key) => ({
                id: key.id,
                title: key.user_name.first_name + " " + key.user_name.last_name + " " + key.user_name.email
            }));
        }
        return [];
    }, [isSuccess])

    //! Get All doctors 
    const Doctors = useGetAllDoctorsWithoutPaginateQuery({ id: company_id })

    const doctorOptions = [];
    if (Doctors?.isSuccess) {
        Doctors?.data?.results?.forEach((key) => {
            doctorOptions.push({
                id: key.id,
                title: key.doctor_name.doctor_name
            });
        });
    }

    //! Get MPO Names
    // const MPO_Name = useGetAllMPONamesNoPageQuery({ company_name: company_id })

    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [mpoName, setMPOName] = useState('');
    const [MpoList, setMpoList] = useState([]);

    const mpoNames = [];
    if (MpoList.length !== 0) {
        MpoList.map((key) => {
            mpoNames.push({
                id: key.id,
                title: key.user_name.first_name + ' ' + key.user_name.last_name
            })
        })
    }

    const { data: DoctorEventData } = useGetFliterDoctorEventByMpoIdQuery({ mpo_name: mpoName, company_name: company_id })

    useEffect(() => {
        if (company_id) {
            MpoData({ company_name: company_id })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [company_id])


    //! Options
    const [companyId, setCompanyId] = useState();
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');

    const handleMPONameChange = useCallback((event, value) => {
        setMPOName(value?.id || "")
        setCompanyId(company_id);
        // setSelectedOption(value?.id);
    }, []);

    const handleDoctorOptionChange = useCallback((event, value) => {
        // setCompanyId(company_id);
        setSelectedDoctor(value?.id || "");
    }, []);

    //! Search results
    const [searchDoctorEventFilter, results] = useSearchDoctorEventsMutation()

    const handleInputMPOChange = useCallback((event) => {
        const { name, value } = event.target;

        setMPOName(event.target.value)
    }, []);

    //! Date Format 
    const [startDate, setStartDate] = useState();
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

    //! onSearch
    // const FilteredData = { selectedOption: selectedOption, doctorOption: selectedDoctor, companyId: companyId, dateData: dateData }
    const FilteredData = { companyId: companyId, mpoName: mpoName }
    // 

    useEffect(() => {
        if (selectedOption || selectedDoctor) {

            searchDoctorEventFilter(FilteredData)
        }
    }, [selectedOption, selectedDoctor])


    // !Delete DoctorEvent
    const [deleteDoctorEvent] = useDeleteDoctorsEventsByIdMutation()

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

    //! Date format
    const [dateFormat, setDateFormat] = useState("");
    const [actualDate, setActualDate] = useState("");
    useEffect(() => {
        if (data && data.length > 0) {
            const { submission_date } = data[0].events_id;
            setDateFormat(submission_date);
        }
    }, [data]);

    useEffect(() => {
        if (dateFormat) {
            const date = new Date(dateFormat);
            const formattedDate = date.toISOString().split("T")[0];
            setActualDate(formattedDate)
        }
    }, [dateFormat]);

    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        {/* <Grid item xs={2}>
                            <Autocomplete
                                options={rolesOptions}
                                getOptionLabel={(option) => option.title}
                                onChange={handleOptionChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Users" />
                                )}
                                renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )} 
                            />
                        </Grid> */}
                        <Grid item xs={3}>
                            {
                                user_role === 'admin' &&
                                <Autocomplete
                                    options={mpoNames}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleMPONameChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="MPO Names" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            }
                        </Grid>
                        <Grid item xs={2}>
                            {/* <DatePicker
                                showIcon
                                selected={startDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select the Date"
                                className='my-datepicker'
                                sx={{ zIndex: 3000000 }}
                            /> */}
                        </Grid>
                    </Grid>
                </Box>


                {mpoName !== "" ?
                    <>
                        <Card>
                            <Scrollbar>
                                <TableContainer sx={{ minWidth: 800 }}>
                                    <Table>
                                        <UserListHead
                                            headLabel={TABLE_HEAD}
                                        />
                                        <TableBody>
                                            <>
                                                {
                                                    DoctorEventData === undefined ? <>
                                                        {
                                                            eightArrays.map((key) => (
                                                                <TableRow id={key} >
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
                                                            {DoctorEventData.count == 0 ?
                                                                <TableRow>
                                                                    <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
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
                                                                            </Typography>
                                                                        </Paper>
                                                                    </TableCell>
                                                                </TableRow>
                                                                :
                                                                DoctorEventData.results.map((events, index) => (
                                                                    <TableRow hover tabIndex={-1} role="checkbox" key={events.id}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell component="th" scope="row" align="left">
                                                                            <Typography variant="subtitle2" noWrap>
                                                                                {events.event_title}
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell align="left">{events.event_date}</TableCell>
                                                                        <TableCell align="left">{events.doctor_id.doctor_name.doctor_name}</TableCell>
                                                                        <TableCell align="left">{events.mpo_id.user_name.first_name + " " + events.mpo_id.user_name.last_name}</TableCell>
                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(events.id); handleClickOpen() }}>
                                                                            <Badge>
                                                                                <Iconify icon="eva:trash-2-outline" />
                                                                            </Badge>
                                                                        </IconButton>
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
                                                                                <Button autoFocus onClick={() => { deleteDoctorEvent(selectedId); handleClose() }}>
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
                                                                ))

                                                            }
                                                        </>}
                                            </>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </Scrollbar>
                        </Card>
                    </> : <DefaultDoctorEvent />}
            </Card>
        </>
    )
}

export default React.memo(FilteredDoctorEvent)