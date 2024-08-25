import React, { useState, useCallback, useContext } from 'react';
//! @mui
import {
    Card,
    Badge,
    Table,
    Stack,
    Paper,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    Box,
    Pagination,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DefaultHOTourPlan from './DefaultHigherOrderTourPlan';
import EditHOTourPlan from './EditHigherOrderTourPlan';
import 'react-datepicker/dist/react-datepicker.css';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import {
    useDeleteHOTourPlansByIdMutation,
    useGetHOTourPlansByUserIdQuery
} from '../../../../api/HighOrderSlices/hoTourPlanSlice';

import Scrollbar from '@/components/scrollbar/Scrollbar';
import moment from 'moment';
import { useGetAreaMPOByIdQuery } from '@/api/MPOSlices/TourPlanSlice';
import { useGetcompanyUserRolesByIdQuery } from '@/api/CompanySlices/companyUserRoleSlice';
import { CookieContext } from '@/App'


const TABLE_HEAD = [
    { id: 'user_id', label: 'Name', alignRight: false },
    { id: 'visited_area', label: 'Area', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'visited_with', label: 'Visited With', alignRight: false },
    { id: 'approved', label: 'Approve TP', alignRight: false },
    { id: 'hulting_station', label: 'Hulting Station', alignRight: false },
    { id: '' },
];

const FilteredHOTourPlan = ({ selectedUser, selectedMonth, selectedDate, role }) => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [isEdited, setEdited] = useState(false);
    const [page, setPage] = useState(1);

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    //! Search results

    const hoTourPlan = useGetHOTourPlansByUserIdQuery({ user_id: user_role !== "admin" ? company_user_id : selectedUser, month: selectedMonth, date: selectedDate, page: page, company_name: company_id });

    const [deleteTourPlan] = useDeleteHOTourPlansByIdMutation()

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

    return (
        <>
            <Card>

                {selectedMonth || selectedDate ?
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
                                                                                <br /> Try checking for typos or using complete words.
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
                                                                                    {tourplan?.user_id?.user_name?.first_name + tourplan?.user_id?.user_name?.middle_name + " " + tourplan?.user_id?.user_name?.last_name}
                                                                                </Typography>
                                                                            </Stack>
                                                                        </TableCell>
                                                                        <TableCell align="left">
                                                                            {
                                                                                tourplan.visited_data.map((key, index) => (
                                                                                    <HigherAreaData id={key.area} key={index} />
                                                                                ))
                                                                            }
                                                                        </TableCell>
                                                                        {/* <MpoAreaData mpoId={tourplan?.visited_with?.id} shiftId={tourplan?.shift?.id} dateId={tourplan.date} /> */}
                                                                        <TableCell align="left">{moment(tourplan.date).format('DD')}</TableCell>
                                                                        <TableCell component="th" scope="row" padding="none">
                                                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                                                <TableCell align="left">
                                                                                    {
                                                                                        tourplan.visited_data.map((key, index) => (
                                                                                            <HigherVisitedWith key={index} id={key.visited_with} />
                                                                                        ))
                                                                                    }
                                                                                </TableCell>
                                                                            </Stack>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                                                <Typography variant="subtitle2" noWrap>
                                                                                    {tourplan.is_approved === true ? 'Approved' : 'Not Approved'}
                                                                                </Typography>
                                                                            </Stack>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                                                <Typography variant="subtitle2" noWrap>
                                                                                    {tourplan.hulting_station ? tourplan.hulting_station : 'No Hulting Station'}
                                                                                </Typography>
                                                                            </Stack>
                                                                        </TableCell>
                                                                        <TableCell align="left">
                                                                            {/* //! Edit  */}
                                                                            {
                                                                                user_role === 'admin' &&
                                                                                <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan.id)} >
                                                                                    <Badge>
                                                                                        <Iconify icon="eva:edit-fill" />
                                                                                    </Badge>
                                                                                </IconButton>
                                                                            }
                                                                            {
                                                                                user_role === 'other_roles' &&
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
                                {isDrawerOpen &&
                                    <EditHOTourPlan
                                        idharu={selectedUpdateId}
                                        onClose={onCloseDrawer}
                                        setEdited={setEdited}
                                    />
                                }
                            </Scrollbar>
                            <Box justifyContent={'center'} alignItems='center' display={'flex'}
                                sx={{ margin: "20px 0px" }} >
                                {hoTourPlan && typeof hoTourPlan?.count === 'number' ?
                                    <Pagination
                                        count={parseInt(hoTourPlan?.data?.count / 200) + 1}
                                        onChange={handleChangePage}
                                    /> : null}
                            </Box>
                        </Card>
                    </> : <DefaultHOTourPlan />}
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

export default React.memo(FilteredHOTourPlan)