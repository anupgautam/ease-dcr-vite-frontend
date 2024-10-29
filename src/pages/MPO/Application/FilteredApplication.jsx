import { sentenceCase } from 'change-case';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
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
    Autocomplete
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DefaultApplication from './DefaultApplication';
import EditApplication from './EditApplication'
import 'react-datepicker/dist/react-datepicker.css';
import { NepaliDatePicker } from "nepali-datepicker-reactjs"
import "nepali-datepicker-reactjs/dist/index.css"

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Iconify from '@/components/iconify/Iconify';
import Label from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';

import {
    useSearchApplicationMutation,
    useDeleteApplicationsByIdMutation
} from '../../../api/ApplicationSlices/ApplicationSlices';
import {
    useGetAllcompanyUserRolesWithoutPaginationQuery,
} from '@/api/CompanySlices/companyUserRoleSlice';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import { useSelector } from 'react-redux';


const TABLE_HEAD = [
    { id: 'user_id', label: 'User Name', alignRight: false },
    { id: 'leave_type', label: 'Leave Type', alignRight: false },
    { id: 'leave_cause', label: 'Leave Cause', alignRight: false },
    { id: 'leave_from', label: 'Leave From', alignRight: false },
    { id: 'leave_to', label: 'Leave To', alignRight: false },
    { id: 'leave_status', label: 'Leave Status', alignRight: false },
    { id: 'submission_date', label: 'Submission Date', alignRight: false },
    { id: 'is_approved', label: 'Is Approved', alignRight: false },
    { id: '' },
];

const FilteredApplication = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! For drawer 

    const [selectedId, setSelectedId] = useState(null);
    const [mpoId, setMPOId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id, mpo_id) => {
        setSelectedUpdateId(id);
        setMPOId(mpo_id);
        setIsDrawerOpen(true);
    }, [])

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, [])

    //! Get User roles wala
    const { data, isSuccess } = useGetAllcompanyUserRolesWithoutPaginationQuery({ id: company_id })

    const rolesOptions = useMemo(() => {
        if (isSuccess) {
            return data.map(key => ({ id: key.id, title: key.user_name.first_name + " " + "" + key.user_name.middle_name + key.user_name.last_name }))
        }
        return [];
    }, [isSuccess])

    //! Options
    const [companyId, setCompanyId] = useState();
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = useCallback((value) => {
        setCompanyId(company_id);
        setSelectedOption(value?.id || "");
    }, [])


    //! Search results
    const [searchApplicationFilter, results] = useSearchApplicationMutation()


    //! Nepali Date Format
    const [dateData, setDateData] = useState()

    //! onSearch
    const FilteredData = { selectedOption: selectedOption, companyId: companyId, dateData: dateData }

    useEffect(() => {
        if (companyId || selectedOption || dateData) {

            searchApplicationFilter(FilteredData)
        }
    }, [companyId, selectedOption, dateData])


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
    const [actualDate, setActualDate] = useState("");
    useEffect(() => {
        if (data && data.length > 0) {
            // const { submission_date } = data[0].application_id;
            // setDateFormat(submission_date);
        }
    }, [data]);

    useEffect(() => {
        if (actualDate) {
            const date = new Date(actualDate);
            const formattedDate = date.toISOString().split("T")[0];
            setActualDate(formattedDate)
        }
    }, [actualDate]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);


    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            {
                                user_role === 'admin' &&
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
                            }
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

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 1200 }}>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            <TableBody>
                                {results.data ?
                                    <>

                                        <>
                                            {
                                                results.data === undefined ? <>
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
                                                                        <Typography variant="subtitle2" noWrap>
                                                                            {application.application_id.leave_type}
                                                                        </Typography>
                                                                        {/* </Stack> */}
                                                                    </TableCell>
                                                                    <TableCell align="left">{application.application_id.leave_cause}</TableCell>
                                                                    <TableCell align="left">{application.application_id.leave_from}</TableCell>
                                                                    <TableCell align="left">{application.application_id.leave_to}</TableCell>
                                                                    <TableCell align="left">{application.application_id.is_approved === true ? "Approved" : "Pending"}</TableCell>
                                                                    <TableCell align="left">{actualDate}</TableCell>
                                                                    <TableCell align="left">
                                                                        <Label color={(application.application_id.is_approved === true ? 'green' : 'red')}>
                                                                            {sentenceCase(application.application_id.is_approved.toString())}</Label>
                                                                    </TableCell>
                                                                    <TableCell align="left">
                                                                        {
                                                                            user_role === 'admin' &&
                                                                            <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(application.id, application.mpo_name.id)} >
                                                                                <Badge>
                                                                                    <Iconify icon="eva:edit-fill" />
                                                                                </Badge>
                                                                            </IconButton>
                                                                        }
                                                                        {
                                                                            user_role === 'admin' &&
                                                                            <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(application.id); handleClickOpen() }}>
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

                                        {isDrawerOpen && <EditApplication
                                            idharu={selectedUpdateId} onClose={onCloseDrawer} mpoId={mpoId}
                                        />
                                        }
                                    </>

                                    :
                                    <DefaultApplication />
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>
        </>
    )
}

export default React.memo(FilteredApplication)