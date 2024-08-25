import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
//! @mui
import {
    Card,
    Badge,
    Table,
    Paper,
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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import 'react-datepicker/dist/react-datepicker.css';
import { NepaliDatePicker } from "nepali-datepicker-reactjs"
import "nepali-datepicker-reactjs/dist/index.css"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import { useGetCompanyRolesByCompanyQuery, } from '../../../api/MPOSlices/companyRolesSlice';
import {
    useSearchLeaveMutation
} from '../../../api/Leaves/LeavesApiSlice'
import EditLeaves from './EditLeaves'
import { CookieContext } from '@/App'

const TABLE_HEAD = [
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'phone', label: 'Phone', alignRight: false },
    { id: 'leave_type', label: 'Leave Type', alignRight: false },
    { id: 'leave_cause', label: 'Leave Cause', alignRight: false },
    { id: 'leave_from', label: 'Leave From', alignRight: false },
    { id: 'leave_to', label: 'Leave To', alignRight: false },
    { id: '' },
];

const FilteredLeaves = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, [])

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, [])

    //! Get User roles wala
    const { data, isLoading, isSuccess, isError, error } = useGetCompanyRolesByCompanyQuery(company_id)

    const rolesOptions = useMemo(() => {
        if (isSuccess) {
            return data.map(key => ({ id: key.id, title: key.role_name.role_name }))
        }
        return [];
    }, [isSuccess])

    //! Options
    const [companyId, setCompanyId] = useState(parseInt(company_id));
    const [selectedOption, setSelectedOption] = useState('');
    const [mpoName, setMPOName] = useState('');

    const handleOptionChange = useCallback((event, value) => {
        setSelectedOption(value?.id || "");
    }, [])

    //! Search results
    const [searchApplicationFilter, results] = useSearchLeaveMutation()

    //! Nepali Date
    const [dateData, setDateData] = useState()

    //! onSearch
    const FilteredData = { company_name: companyId, date: dateData, role_name: selectedOption }

    useEffect(() => {
        if (dateData || selectedOption) {
            searchApplicationFilter(FilteredData)
        }
    }, [dateData, selectedOption])


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
            const { submission_date } = data[0];
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
                            <Autocomplete
                                options={rolesOptions}
                                getOptionLabel={(option) => option.title}
                                onChange={handleOptionChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Roles" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                )}
                            />
                        </Grid>
                        <Grid item xs={2.85}>
                            <NepaliDatePicker
                                inputClassName="form-control-design"
                                // className=""
                                value={dateData}
                                onChange={(value) => setDateData(value)}
                                options={{ calenderLocale: "en", valueLocale: "en" }} />
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
                                                                                {application.mpo_name.user_name.first_name + " " + application.mpo_name.user_name.last_name}
                                                                            </Typography>
                                                                            {/* </Stack> */}
                                                                        </TableCell>
                                                                        <TableCell align="left">{application.mpo_name.user_name.phone_number}</TableCell>
                                                                        <TableCell align="left">{application.application_id.leave_type}</TableCell>
                                                                        <TableCell align="left">{application.application_id.leave_cause}</TableCell>
                                                                        <TableCell align="left">{application.application_id.leave_from}</TableCell>
                                                                        <TableCell align="left">{application.application_id.leave_to}</TableCell>
                                                                        {/* //! Edit  */}
                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(application.id)} >
                                                                            <Badge>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                    </TableRow>
                                                                ))
                                                            }
                                                        </>}
                                            </>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {isDrawerOpen && <EditLeaves
                                    id={selectedUpdateId} onClose={onCloseDrawer}
                                />
                                }
                            </Scrollbar>
                        </Card>
                    </> : <></>}
            </Card>
        </>
    )
}

export default React.memo(FilteredLeaves)