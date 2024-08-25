import React, { useState, useCallback, useContext } from 'react';
import {
    Card,
    Badge,
    Table,
    Stack,
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
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import EditDCR from './EditDCRTry';

import {
    useGetTourPlansQuery,
    useDeleteTourPlansByIdMutation,
} from '../../../api/MPOSlices/TourPlanApiSlice';

const TABLE_HEAD = [
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'mpo_email', label: 'MPO Email', alignRight: false },
    { id: 'area_name', label: 'Area Name', alignRight: false },
    { id: 'shift', label: 'Shift', alignRight: false },
    { id: 'month', label: 'Month', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
];

const DefaultDCR = () => {

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [open, setOpen] = useState(false);


    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
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

    // !Get Tour Plans
    const { data } = useGetTourPlansQuery(page)
    // 

    // !Delete TourPlan
    const [deleteTourPlan] = useDeleteTourPlansByIdMutation()
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
                                                        <TableCell><Skeleton /></TableCell>
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>{data && data.results.map((tourplan, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={tourplan.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {tourplan.mpo_name.user_name.first_name + " " + tourplan.mpo_name.user_name.last_name}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">{tourplan.mpo_name.user_name.email}</TableCell>
                                                    <TableCell align="left">{tourplan.tour_plan.tour_plan.select_the_area.area_name}</TableCell>
                                                    <TableCell align="left">{tourplan.tour_plan.shift.shift}</TableCell>
                                                    <TableCell align="left">{tourplan.tour_plan.tour_plan.select_the_month}</TableCell>
                                                    <TableCell align="left">{tourplan.tour_plan.tour_plan.select_the_date_id}</TableCell>
                                                    {/*//! Edit  */}
                                                    <TableCell align="left">
                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan.id)}>
                                                            <Badge>
                                                                <Iconify icon="eva:edit-fill" />
                                                            </Badge>
                                                        </IconButton>
                                                        {/*//! Delete  */}
                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(tourplan.id); handleClickOpen() }}>
                                                            <Badge>
                                                                <Iconify icon="eva:trash-2-outline" />
                                                            </Badge>
                                                        </IconButton>
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
                    {isDrawerOpen && <EditDCR
                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                    />
                    }

                </Scrollbar>

                {/* //!pagination */}
                <TableRow>
                    <Box justifyContent={'center'} alignItems='center' display={'flex'}
                        sx={{ margin: "20px 0px" }} >
                        {data ?
                            <Pagination
                                count={parseInt(data.count / 8) + 1}
                                onChange={handleChangePage}
                            /> : <></>}
                    </Box>
                </TableRow>
            </Card>
        </>
    )
}

export default React.memo(DefaultDCR)