import React, { useState, useCallback } from 'react';
import {
    Card,
    Table,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    Pagination,
    Box,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { UserListHead } from '../../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Cookies from 'js-cookie'
import {
    useGetAllChemistsDCRQuery,
    useDeleteChemistsDCRByIdMutation,
} from '../../../../api/DCRs Api Slice/chemistDCR/ChemistDCRSlice';

import { addSelectedUser } from '@/reducers/dcrSelectData';
import { useDispatch } from 'react-redux';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import moment from 'moment';

const TABLE_HEAD = [
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'shift', label: 'Shift', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'visited_area', label: 'Visited Area', alignRight: false },
    { id: 'chemist_name', label: 'Chemist Name', alignRight: false },
    { id: '' },
];

const MyExecutiveChemistDcr = () => {

    const dispatch = useDispatch();

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [open, setOpen] = useState(false);


    const onEdit = useCallback((id, user_id) => {
        setSelectedUpdateId(id);
        dispatch(addSelectedUser(user_id));
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
    const { data } = useGetAllChemistsDCRQuery({ page: page, id: Cookies.get("company_id") });

    // !Delete TourPlan
    const [deleteTourPlan] = useDeleteChemistsDCRByIdMutation();
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
                                                        {/* <TableCell><Skeleton /></TableCell> */}
                                                        {/* <TableCell><Skeleton /></TableCell> */}
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>{data && data.results.map((tourplan, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={tourplan.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                        <Typography variant="subtitle2" noWrap>
                                                            {tourplan.mpo_name.user_name.first_name + " " + tourplan.mpo_name.user_name.last_name}
                                                        </Typography>
                                                        {/* </Stack> */}
                                                    </TableCell>
                                                    <TableCell align="left">{tourplan.dcr.shift.shift}</TableCell>
                                                    <TableCell align="left">{moment(tourplan.dcr.dcr.date).format('DD')}</TableCell>
                                                    {/* <TableCell align="left">{tourplan.dcr.dcr.year}</TableCell> */}
                                                    {/* <TableCell align="left">{tourplan.dcr.dcr.month}</TableCell> */}
                                                    <TableCell align="left">{tourplan.dcr.dcr.visited_area.area_name}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                        <Typography variant="subtitle2" noWrap>
                                                            {tourplan.dcr.dcr.visited_chemist.chemist_name.chemist_name}
                                                        </Typography>
                                                        {/* </Stack> */}
                                                    </TableCell>
                                                    {/*//! Edit  */}
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
                                            ))
                                            }
                                            </>}
                                </>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                {/* //!pagination */}
                <Box justifyContent={'center'} alignItems='center' display={'flex'}
                    sx={{ margin: "20px 0px" }} >
                    {data ?
                        <Pagination
                            count={parseInt(data.count / 8) + 1}
                            onChange={handleChangePage}
                        /> : <></>}
                </Box>
            </Card>
        </>
    )
}

export default React.memo(MyExecutiveChemistDcr);