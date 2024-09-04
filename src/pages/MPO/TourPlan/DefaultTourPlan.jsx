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
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import EditTourPlan from './EditTourPlan';
import { useSelector } from 'react-redux';

import {
    useGetTourPlansQuery,
    useDeleteTourPlansByIdMutation,
} from '@/api/MPOSlices/TourPlanSlice';

const TABLE_HEAD = [
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'area_name', label: 'Area Name', alignRight: false },
    { id: 'shift', label: 'Shift', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: '' },
];

const DefaultList = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Get Tour Plan
    const { data, refetch } = useGetTourPlansQuery({
        id: company_id,
        page: page
    }, {
        skip: !company_id
    });

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
    const [page, setPage] = useState(1);

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel;
        let thisArray = data.split(" ");
        setPage(thisArray[3]);
    }, [])

    const id = company_id;


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
                                                        <TableCell><Skeleton /></TableCell>
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>{data && data.results.map((tourplan, index) => {
                                                const { id, name, role, status, company, avatarUrl, isVerified } = data?.results;
                                                const selectedUser = selected.indexOf(id) !== -1;
                                                return (
                                                    <TableRow hover tabIndex={-1} role="checkbox" key={tourplan.id}>
                                                        <TableCell>
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell component="th" scope="row" align="left">
                                                            <Typography variant="subtitle2" noWrap>
                                                                {tourplan.mpo_name.user_name.first_name + " " + tourplan.mpo_name.user_name.last_name}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell align="left">{tourplan.tour_plan.tour_plan.select_the_area.area_name}</TableCell>
                                                        <TableCell align="left">{tourplan.tour_plan.tour_plan.select_the_date_id}</TableCell>
                                                        <TableCell align="left">{tourplan.tour_plan.tour_plan.is_unplanned === true ? "Unplanned" : "Not Unplanned"}</TableCell>
                                                        <TableCell align="left">{tourplan.approved_by.user_name.first_name + " " + tourplan.approved_by.user_name.middle_name + " " + tourplan.approved_by.user_name.last_name}</TableCell>
                                                        <TableCell align="left">
                                                            {/*//! Edit  */}
                                                            {
                                                                user_role === 'admin' &&
                                                                <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan.id)}>
                                                                    <Badge>
                                                                        <Iconify icon="eva:edit-fill" />
                                                                    </Badge>
                                                                </IconButton>
                                                            }
                                                            {/*//! Delete  */}
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
                                                )
                                            })
                                            }
                                            </>}
                                </>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {isDrawerOpen && <EditTourPlan
                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                    />
                    }

                </Scrollbar>

                {/* //!pagination */}
                <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                    {data ? (
                        <Pagination count={parseInt(data.count / 200) + 1} onChange={handleChangePage} />
                    ) : (
                        <Typography variant="body1">In Search</Typography>
                    )}
                </Box>
            </Card>
        </>
    )
}

export default DefaultList;