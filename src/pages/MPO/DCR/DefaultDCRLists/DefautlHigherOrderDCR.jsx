import React, { useState, useCallback } from 'react';
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
import { UserListHead } from '../../../../sections/@dashboard/user';
import 'react-loading-skeleton/dist/skeleton.css'
import EditHoDCR from '../EditDCRs/EditHoDCR';

import {
    useGetHODCRsQuery,
    useDeleteHODCRsByIdMutation,
} from '@/api/HighOrderSlices/hoDCRSlice';
import { addSelectedUser } from '@/reducers/dcrSelectData';
import { useSelector, useDispatch } from 'react-redux';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import moment from 'moment';


const TABLE_HEAD = [
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'shift', label: 'Shift', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'visited_with', label: 'Visited With', alignRight: false },
    { id: '' },
];

const DefaultHODCR = () => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const dispatch = useDispatch();
    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [open, setOpen] = useState(false);


    const onEdit = (id, user_id) => {
        setSelectedUpdateId(id);
        dispatch(addSelectedUser(user_id))
        setIsDrawerOpen(true);
    }

    const onCloseDrawer = () => {
        setIsDrawerOpen(false);
    }

    //! Dialogue 
    const [openDialogue, setOpenDialogue] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = () => {
        setOpenDialogue(true)
    }

    const handleClose = () => {
        setOpenDialogue(false)
    }

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = (e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }

    // !Get Tour Plans
    const { data } = useGetHODCRsQuery({ page: page, id: company_user_role_id });

    // !Delete TourPlan
    const [deleteTourPlan] = useDeleteHODCRsByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

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
                                            <>{data && data.results.map((tourplan, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={tourplan.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                        <Typography variant="subtitle2" noWrap>
                                                            {tourplan.user_id.user_name.first_name + " " + tourplan.user_id.user_name.last_name}
                                                        </Typography>
                                                        {/* </Stack> */}
                                                    </TableCell>
                                                    <TableCell align="left">{tourplan.shift.shift}</TableCell>
                                                    <TableCell align="left">{moment(tourplan.date).format('DD')}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {tourplan.visited_with.user_name.first_name + " " + tourplan.visited_with.user_name.last_name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        {
                                                            user_role === 'admin' &&
                                                            <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan.id, tourplan.user_id.id)}>
                                                                <Badge>
                                                                    <Iconify icon="eva:edit-fill" />
                                                                </Badge>
                                                            </IconButton>
                                                        }
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
                                            </>}
                                </>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {isDrawerOpen && <EditHoDCR
                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                    />
                    }

                </Scrollbar>

                {/* //!pagination */}
                <Box justifyContent={'center'} alignItems='center' display={'flex'}
                    sx={{ margin: "20px 0px" }} >
                    {data ?
                        <Pagination
                            count={parseInt(data.count / 200) + 1}
                            onChange={handleChangePage}
                        /> : <></>}
                </Box>
            </Card>
        </>
    )
}

export default React.memo(DefaultHODCR);