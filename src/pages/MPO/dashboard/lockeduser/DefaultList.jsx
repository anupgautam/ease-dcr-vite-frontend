import React, { useState, useCallback } from 'react';
// @mui
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
import { UserListHead } from '../../../../sections/@dashboard/user';
import 'react-loading-skeleton/dist/skeleton.css'
import Cookies from 'js-cookie'

import {
    useGetLockedTourPlanForHigherQuery,
    useGetLockedTourPlanQuery,
    useGetLockedUsersQuery,
    useUnlockLockedUserMutation
} from '@/api/MPOSlices/TourPlanSlice.js';


const TABLE_HEAD = [
    { id: 'select_the_date_id', label: 'Tour Plan Date', alignRight: false },
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'role_name', label: 'Role Name', alignRight: false },
    { id: '' },
];

const DefaultList = ({ mpo_name }) => {

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [mpoId, setMPOId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [open, setOpen] = useState(false);


    const onEdit = useCallback((id, mpo_id) => {
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

    // !Get Tour Plans
    const { data } = useGetLockedUsersQuery(Cookies.get('company_id'));

    const { data: LockedTourPlan } = useGetLockedTourPlanQuery(mpo_name.id);
    const { data: HoTourPlanData } = useGetLockedTourPlanForHigherQuery(mpo_name.id);

    //! Unlock Locked Users
    const [unlockUsers] = useUnlockLockedUserMutation()

    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

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
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800 }}>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            <TableBody>
                                {
                                    mpo_name ?

                                        <>
                                            {
                                                mpo_name.role === 'MPO' ?
                                                    <>
                                                        {LockedTourPlan?.map((lockeduser, index) => (
                                                            <TableRow hover tabIndex={-1} role="checkbox" key={lockeduser.id}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell component="th" scope="row" align="left">
                                                                    {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {lockeduser.tour_plan.tour_plan.select_the_date_id}
                                                                    </Typography>
                                                                    {/* </Stack> */}
                                                                </TableCell>
                                                                <TableCell align="left">{lockeduser?.mpo_name?.user_name?.first_name} {lockeduser?.mpo_name?.user_name?.middle_name} {lockeduser?.mpo_name?.user_name?.last_name}</TableCell>
                                                                {/* <TableCell align="left">{lockeduser?.mpo_name?.user_name?.email}</TableCell> */}
                                                                <TableCell align="left">{lockeduser?.mpo_name?.role_name?.role_name_value}</TableCell>
                                                                <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => { setSelectedId(lockeduser.id); handleClickOpen() }}>
                                                                    <Badge>
                                                                        <Iconify icon="dashicons:lock" />
                                                                    </Badge>
                                                                </IconButton>
                                                                <Dialog
                                                                    fullScreen={fullScreen}
                                                                    open={openDialogue}
                                                                    onClose={handleClose}
                                                                    aria-labelledby="responsive-dialog-title"
                                                                >
                                                                    <DialogTitle id="responsive-dialog-title">
                                                                        {"Are you sure want to Unlock User?"}
                                                                    </DialogTitle>
                                                                    <DialogActions>
                                                                        <Button autoFocus onClick={() => { unlockUsers({ id: selectedId, data: { is_admin_opened: "true" } }); handleClose() }}>
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
                                                    </> : <>
                                                        {HoTourPlanData?.map((lockeduser, index) => (
                                                            <TableRow hover tabIndex={-1} role="checkbox" key={lockeduser.id}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell component="th" scope="row" align="left">
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {lockeduser.date}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="left">{lockeduser?.user_id?.user_name?.first_name} {lockeduser?.user_id?.user_name?.middle_name} {lockeduser?.user_id?.user_name?.last_name}</TableCell>
                                                                <TableCell align="left">{lockeduser?.user_id?.role_name?.role_name_value}</TableCell>
                                                                <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => { setSelectedId(lockeduser.id); handleClickOpen() }}>
                                                                    <Badge>
                                                                        <Iconify icon="dashicons:lock" />
                                                                    </Badge>
                                                                </IconButton>
                                                                <Dialog
                                                                    fullScreen={fullScreen}
                                                                    open={openDialogue}
                                                                    onClose={handleClose}
                                                                    aria-labelledby="responsive-dialog-title"
                                                                >
                                                                    <DialogTitle id="responsive-dialog-title">
                                                                        {"Are you sure want to Unlock User?"}
                                                                    </DialogTitle>
                                                                    <DialogActions>
                                                                        <Button autoFocus onClick={() => { unlockUsers({ id: selectedId, data: { is_admin_opened: "true" } }); handleClose() }}>
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
                                                    </>
                                            }
                                        </> : null
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                {/* //!pagination */}
                <Box justifyContent={'center'} alignItems='center' display={'flex'}
                    sx={{ margin: "20px 0px" }} >
                    {data ?
                        <Pagination
                            count={parseInt(data.count / 30) + 1}
                            onChange={handleChangePage}
                        /> : <></>}
                </Box>
            </Card >
        </>
    )
}

export default React.memo(DefaultList);