import { sentenceCase } from 'change-case';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    FormControl,
    Grid,
    Autocomplete
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Cookies from 'js-cookie'
import DefaultList from './DefaultList';
import EditLockedUser from './EditLockedUser'
import 'react-datepicker/dist/react-datepicker.css';
import "nepali-datepicker-reactjs/dist/index.css"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Iconify from '@/components/iconify/Iconify';
import Label from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import { useGetCompanyRolesByCompanyQuery } from '@/api/CompanySlices/companyRolesSlice';
import {
    useDeleteApplicationsByIdMutation
} from '@/api/ApplicationSlices/ApplicationSlices';
import {
    useGetAllcompanyUserRolesWithoutPaginationQuery,
} from '@/api/CompanySlices/companyUserRoleSlice';
import {
    useSearchLockedUsersMPOMutation,
    useSearchLockedUsersHigherOrderMutation
} from '@/api/MPOSlices/TourPlanSlice';

const TABLE_HEAD = [
    { id: 'select_the_date_id', label: 'Tour Plan Date', alignRight: false },
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'role_name', label: 'Role Name', alignRight: false },
    { id: '' },
];

const FilteredLockedUsers = () => {

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    //! Company Roles list
    const roleList = useGetCompanyRolesByCompanyQuery(Cookies.get('company_id'));

    const [companyRoleList, setCompanyRoleList] = useState([]);
    const [roleSelect, setRoleSelect] = useState('');

    useEffect(() => {
        let dataList = []
        if (roleList?.data) {
            roleList.data.map((key) => {
                dataList.push({ id: key.id, title: key.role_name.role_name })
            })
        }
        setCompanyRoleList(dataList);
    }, [roleList])

    const handleRoleSelect = useCallback((e, value) => {
        setRoleSelect(value?.id);
    }, [])

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
    const { data, isLoading, isSuccess, isError, error } = useGetAllcompanyUserRolesWithoutPaginationQuery({ id: Cookies.get('company_id') })

    const rolesOptions = useMemo(() => {
        if (isSuccess) {
            return data?.map((key) => ({
                id: key.id,
                title: key.user_name.first_name + " " + key.user_name.last_name + " " + key.user_name.email
            }));
        }
        return [];
    }, [isSuccess])

    //! Options
    const [companyId, setCompanyId] = useState();
    const [selectedOption, setSelectedOption] = useState('');
    const [mpoName, setMPOName] = useState('');
    const handleOptionChange = (event, value) => {
        setCompanyId(Cookies.get('company_id'));
        setSelectedOption(value?.id);
    };


    //! Search results
    const [searchLockedUserMPOFilter, results] = useSearchLockedUsersMPOMutation()
    const [searchLockedUserHigherOrder, results] = useSearchLockedUsersHigherOrderMutation()

    const handleInputMPOChange = useCallback((event) => {
        const { name, value } = event.target;

        setMPOName(event.target.value)
    }, []);

    //! Nepali Date Format
    const [dateData, setDateData] = useState()

    //! Date Format 
    // const [startDate, setStartDate] = useState();
    // const [dateData, setDateData] = useState('')

    // const handleDateChange = (date) => {
    //     setStartDate(date)
    //     if (date) {
    //         const nextDate = new Date(date.getTime());
    //         nextDate.setDate(nextDate.getDate() + 1);
    //         const dateValue = nextDate.toISOString().split('T')[0];
    //         setDateData(dateValue);
    //     }
    // }

    //! onSearch
    const FilteredData = { selectedOption: selectedOption, companyId: companyId, roleSelect: roleSelect }

    useEffect(() => {
        if (companyId || selectedOption) {

            searchLockedUserFilter(FilteredData)
        }
    }, [companyId, selectedOption])


    // !Delete Application
    const [deleteApplication] = useDeleteApplicationsByIdMutation()

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
            // const { submission_date } = data[0].application_id;
            // setDateFormat(submission_date);
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
                            <FormControl>
                                <Autocomplete
                                    options={companyRoleList}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleRoleSelect}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Company Roles" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={2.5}>
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
                            {/* <NepaliDatePicker
                                inputClassName="form-control-design"
                                // className=""
                                value={dateData}
                                onChange={(value) => setDateData(value)}
                                options={{ calenderLocale: "en", valueLocale: "en" }} /> */}
                        </Grid>
                    </Grid>
                </Box>

                {results.data ?
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
                                                    results.data === undefined ? <>
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
                                                            {results?.data && results?.data?.length == 0 ?
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
                                                                results?.data && results?.data?.map((application, index) => (
                                                                    <TableRow hover tabIndex={-1} role="checkbox" key={application.id}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell component="th" scope="row" align="left">
                                                                            {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                            <Typography variant="subtitle2" noWrap>
                                                                                {application.application_id.leave_type}
                                                                            </Typography>
                                                                            {/* </Stack> */}
                                                                        </TableCell>
                                                                        <TableCell align="left">{application.application_id.leave_cause}</TableCell>
                                                                        <TableCell align="left">{application.application_id.leave_from}</TableCell>
                                                                        <TableCell align="left">{application.application_id.leave_to}</TableCell>
                                                                        <TableCell align="left">{application.application_id.leave_status}</TableCell>
                                                                        {/* <TableCell align="left">{application.application_id.is_submitted}</TableCell> */}
                                                                        <TableCell align="left">
                                                                            <Label color={(application.application_id.is_submitted === true ? 'green' : 'red')}>
                                                                                {sentenceCase(application.application_id.is_submitted.toString())}</Label>
                                                                        </TableCell>
                                                                        <TableCell align="left">{actualDate}</TableCell>
                                                                        {/* <TableCell align="left">{application.application_id.is_approved}</TableCell> */}
                                                                        <TableCell align="left">
                                                                            <Label color={(application.application_id.is_approved === true ? 'green' : 'red')}>
                                                                                {sentenceCase(application.application_id.is_approved.toString())}</Label>
                                                                        </TableCell>
                                                                        <TableCell align="left">{application.application_id.company_name}</TableCell>
                                                                        <TableCell align="left">{application.application_id.approved_by}</TableCell>
                                                                        <TableCell align="left">{application.application_id.submit_to}</TableCell>

                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(application.id, application.mpo_name.id)} >
                                                                            <Badge>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(application.id); handleClickOpen() }}>
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
                                                                                <Button autoFocus onClick={() => { deleteApplication(selectedId); handleClose() }}>
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
                                                        </>}
                                            </>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {isDrawerOpen && <EditLockedUser
                                    idharu={selectedUpdateId} onClose={onCloseDrawer} mpoId={mpoId}
                                />
                                }
                            </Scrollbar>
                        </Card>
                    </> : <DefaultList />}
            </Card>
        </>
    )
}

export default React.memo(FilteredLockedUsers)