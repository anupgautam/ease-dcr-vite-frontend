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
    Pagination,
    Box,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
// mock
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
    useGetAllDoctorEventsQuery,
    useDeleteDoctorsEventsByIdMutation,
} from '@/api/MPOSlices/DoctorSlice';
import Scrollbar from '@/components/scrollbar/Scrollbar';

const TABLE_HEAD = [
    { id: 'event_title', label: 'Event', alignRight: false },
    { id: 'event_date', label: 'Date', alignRight: false },
    { id: 'doctor_name', label: 'Doctor Name', alignRight: false },
    { id: 'first_name', label: 'MPO Name', alignRight: false },
    { id: '' },
];

const DefaultDoctorEvents = () => {
    const { company_id, company_user_role_id } = useSelector((state) => state.cookie);

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [mpoId, setMPOId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [open, setOpen] = useState(false);


    const onEdit = useCallback((id, mpo_id) => {
        // 
        setSelectedUpdateId(id);
        setMPOId(mpo_id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

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

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !Get Doctor Events
    const { data } = useGetAllDoctorEventsQuery({ id: company_id, page: page, mpo_name: company_user_role_id }, {
        skip: !company_id || !page || !company_user_role_id
    });

    // !Delete Doctor Events
    const [deleteDoctorEvents] = useDeleteDoctorsEventsByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    //! Date format
    const [dateFormat, setDateFormat] = useState("");
    const [actualDate, setActualDate] = useState("");
    useEffect(() => {
        if (data && data.length > 0) {
            const { submission_date } = data[0].application_id;
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

    const handleDelete = async (id) => {
        try {
            const response = await deleteDoctorEvents(id);
            if (response?.data) {
                toast.success(`${response?.data?.message}`)
            } else if (response?.error) {
                toast.error(`Error: ${response.error.data?.message || "Failed to delete Doctor Events"}`);
            }
        } catch (error) {
            toast.error("An unexpected error occurred during deletion.");
        } finally {
            handleClose();
        }
    };

    return (
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
                                        data === undefined ? <>
                                            {
                                                eightArrays.map((key) => (
                                                    <TableRow key={key} >
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>{data.results && data.results.map((doctorevent, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={doctorevent.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {doctorevent.event_title}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">{doctorevent.event_date}</TableCell>
                                                    <TableCell align="left">{doctorevent.doctor_id.doctor_name.doctor_name}</TableCell>
                                                    <TableCell align="left">{doctorevent?.mpo_name?.user_name?.first_name + " " + doctorevent?.mpo_name?.user_name?.middle_name + " " + doctorevent?.mpo_name.user_name?.last_name}</TableCell>
                                                    {/*//! Delete  */}
                                                    <TableCell align="right">
                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(doctorevent?.id); handleClickOpen() }}>
                                                            <Badge>
                                                                <Iconify icon="eva:trash-2-outline" />
                                                            </Badge>
                                                        </IconButton>
                                                    </TableCell>

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
                        {data ?
                            <Pagination
                                count={parseInt(data.count / 30) + 1}
                                onChange={handleChangePage}
                            /> : <></>}
                    </Box>
                </Scrollbar>

                {/* //!pagination */}
            </Card>

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
                    <Button autoFocus onClick={() => { handleDelete(selectedId); handleClose() }}>
                        Yes
                    </Button>
                    <Button
                        onClick={handleClose}
                        autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default React.memo(DefaultDoctorEvents);