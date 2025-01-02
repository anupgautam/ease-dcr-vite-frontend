
import { sentenceCase } from 'change-case';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Badge,
    Table,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    Box,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Iconify from '@/components/iconify/Iconify';
import Label from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux';

import {
    useGetApplicationsQuery,
    useDeleteApplicationsByIdMutation,
} from '@/api/ApplicationSlices/ApplicationSlices';
import EditApplication from './EditApplication';
import moment from 'moment';
import { toast } from 'react-toastify';


const TABLE_HEAD = [
    { id: 'user_id', label: 'User Name', alignRight: false },
    { id: 'leave_type', label: 'Leave Type', alignRight: false },
    { id: 'leave_cause', label: 'Leave Cause', alignRight: false },
    { id: 'leave_from', label: 'Leave From', alignRight: false },
    { id: 'leave_to', label: 'Leave To', alignRight: false },
    { id: 'leave_status', label: 'Leave Status', alignRight: false },
    { id: 'submission_date', label: 'Submission Date', alignRight: false },
    { id: 'is_approved', label: 'Is Approved', alignRight: false },
    { id: '' }
];

const DefaultApplication = () => {
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
    }, [])

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, [])

    //! Dialogue 
    const [openDialogue, setOpenDialogue] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDialogue(false);
    }, []);


    // !Get Tour Plans
    const { data } = useGetApplicationsQuery({ company_name: company_id, mpo_name: user_role === "admin" ? "" : company_user_id });


    // !Delete TourPlan
    const [deleteApplication] = useDeleteApplicationsByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    const handleDelete = async (id) => {
        try {
            const response = await deleteApplication(id);
            if (response?.data) {
                toast.success(`${response?.data?.message}`)
            } else if (response?.error) {
                toast.error(`Error: ${response.error.data?.message || "Failed to delete Application"}`);
            }
        } catch (error) {
            toast.error("An unexpected error occurred during deletion.");
        } finally {
            handleClose();
        }
    };

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

    // 

    //! True false 
    let labelColor = '';
    let labelText = '';

    if (data && data.length > 0) {
        labelColor = 'success';
        labelText = 'True';
    } else {
        labelColor = 'error';
        labelText = 'False';
    }

    return (
        <>
            <>
                {
                    data === undefined ? (
                        <>
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
                                        <TableCell><Skeleton /></TableCell>
                                    </TableRow>
                                ))}
                        </>
                    ) : (
                        <>{data && data.map((application, index) => (
                            <TableRow hover tabIndex={-1} role="checkbox" key={application.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell component="th" scope="row" align="left">
                                    <Typography variant="subtitle2" noWrap>
                                        {application?.user_id?.user_name?.first_name + " " + application?.user_id?.user_name?.middle_name + " " + application?.user_id?.user_name?.last_name}
                                    </Typography>
                                </TableCell>
                                <TableCell component="th" scope="row" align="left">
                                    <Typography variant="subtitle2" noWrap>
                                        {application?.leave_type}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">{application?.leave_cause}</TableCell>
                                <TableCell align="left">{application?.leave_from}</TableCell>
                                <TableCell align="left">{application?.leave_to}</TableCell>
                                <TableCell align="left">{application?.is_approved === true ? "Approved" : "Pending"}</TableCell>
                                <TableCell align="left">{moment(application.created_at).format('DD MMM YYYY')}</TableCell>
                                <TableCell align="left">
                                    <Label color={(application?.is_approved === true ? 'green' : 'red')}>
                                        {sentenceCase(application?.is_approved.toString())}</Label>
                                </TableCell>
                                <TableCell align="left">
                                    {/*//! Edit  */}
                                    {
                                        user_role === 'admin' &&
                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(application?.id, application?.mpo_name?.id)}>
                                            <Badge>
                                                <Iconify icon="eva:edit-fill" />
                                            </Badge>
                                        </IconButton>
                                    }
                                    {/*//! Delete  */}
                                    {
                                        user_role === 'admin' &&
                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(application?.id); handleClickOpen() }}>
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
                                        <Button autoFocus onClick={() => {
                                            handleDelete(selectedId)
                                                .then((res) => {
                                                    handleClose()
                                                })
                                        }}>
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
                        </>)}
            </>
            {isDrawerOpen && <EditApplication
                idharu={selectedUpdateId} onClose={onCloseDrawer} mpoId={mpoId}
            />
            }


            {/* //!pagination */}
            <Box justifyContent={'center'} alignItems='center' display={'flex'}
                sx={{ margin: "20px 0px" }} >
                {/* {data ?
                        <Pagination
                            count={parseInt(data.count / 8) + 1}
                            onChange={handleChangePage}
                        /> : <></>} */}
            </Box>
        </>
    )
}

export default React.memo(DefaultApplication);