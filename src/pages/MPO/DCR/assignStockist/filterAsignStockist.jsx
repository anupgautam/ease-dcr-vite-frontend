import React, { useState, useEffect, useMemo, useCallback } from 'react';
//! @mui
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
    Autocomplete,
    Pagination
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Cookies from 'js-cookie'
import 'react-datepicker/dist/react-datepicker.css';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import {
    useSearchDoctorEventsMutation,
    useGetAllDoctorsWithoutPaginateQuery,
    usePostAllMPONamesNoPageMutation,
} from '../../../../api/MPOSlices/DoctorSlice';
import {
    useGetUsersMPOWalaQuery
} from '../../../../api/MPOSlices/UserSlice';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import DefaultAsignStockist from './defaultAsignStockist';
import { useDeleteStockistsAssignByIdMutation, useGetAllAssignStockistsQuery } from '@/api/MPOSlices/StockistSlice';

const TABLE_HEAD = [
    { id: 'stockist_name', label: 'Stockist Name', alignRight: false },
    { id: 'stockist_number', label: 'Stockist Number', alignRight: false },
    { id: 'stockist_address', label: 'Stockist Address', alignRight: false },
    { id: '' },
];

const FilteredAsignStockist = () => {

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
    const { data, isLoading, isSuccess, isError, error } = useGetUsersMPOWalaQuery(Cookies.get("company_id"))

    const rolesOptions = useMemo(() => {
        if (isSuccess) {
            return data?.results?.map((key) => ({
                id: key.id,
                title: key.user_name.first_name + " " + key.user_name.last_name + " " + key.user_name.email
            }));
        } return [];
    }, [isSuccess])

    //! Get All doctors 
    const Doctors = useGetAllDoctorsWithoutPaginateQuery({ id: Cookies.get("company_id") })

    const doctorOptions = useMemo(() => {
        if (Doctors?.isSuccess) {
            return Doctors?.data?.results?.map((key) => ({
                id: key.id,
                title: key.doctor_name.doctor_name
            }));
        } return [];
    }, [Doctors])

    const [page, setPage] = useState(1);

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])


    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [mpoName, setMPOName] = useState('');
    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList.length !== 0) {
            return MpoList.map((key) => ({
                id: key.id,
                title: key.user_name.first_name + ' ' + key.user_name.last_name
            }))
        }
        return [];
    }, [MpoList])

    const { data: StokistData } = useGetAllAssignStockistsQuery({ id: Cookies.get("company_id"), page: page, company_area: " ", mpo_name: mpoName });


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


    //! Options
    const [companyId, setCompanyId] = useState();
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');

    const handleMPONameChange = useCallback((event, value) => {
        setMPOName(value?.id)
        setCompanyId(Cookies.get('company_id'));
        // setSelectedOption(value?.id);
    }, []);

    const handleDoctorOptionChange = useCallback((event, value) => {
        // setCompanyId(Cookies.get('company_id'));
        setSelectedDoctor(value?.id);
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
    const FilteredData = { companyId: companyId, mpoName: mpoName }

    useEffect(() => {
        if (selectedOption || selectedDoctor) {

            searchDoctorEventFilter(FilteredData)
        }
    }, [selectedOption, selectedDoctor])


    // !Delete DoctorEvent
    const [deleteDoctorEvent] = useDeleteStockistsAssignByIdMutation()

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
                        <Grid item xs={2}>
                            {
                                Cookies.get('user_role') === 'admin' &&
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
                                                    StokistData === undefined ? <>
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
                                                            {StokistData.count == 0 ?
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
                                                                StokistData.results.map((events, index) => (
                                                                    <TableRow hover tabIndex={-1} role="checkbox" key={events.id}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell component="th" scope="row" align="left">
                                                                            {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                            <Typography variant="subtitle2" noWrap>
                                                                                {events.stockist_name.stockist_name.stockist_name}
                                                                            </Typography>
                                                                            {/* </Stack> */}
                                                                        </TableCell>
                                                                        <TableCell align="left">{events.stockist_name.stockist_name.stockist_contact_number}</TableCell>
                                                                        <TableCell align="left">{events.stockist_name.stockist_name.stockist_address}</TableCell>
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
                                <Box justifyContent={'center'} alignItems='center' display={'flex'}
                                    sx={{ margin: "20px 0px" }} >
                                    {StokistData ?
                                        <Pagination
                                            count={parseInt(StokistData.count / 30) + 1}
                                            onChange={handleChangePage}
                                        /> : <></>}
                                </Box>
                            </Scrollbar>
                        </Card>
                    </> :
                    <DefaultAsignStockist />
                }
            </Card>
        </>
    )
}

export default React.memo(FilteredAsignStockist)