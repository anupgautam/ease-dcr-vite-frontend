import React, { useState, useCallback, useMemo, useContext } from 'react';
import {
    Badge,
    Button,
    TableRow,
    TableCell,
    Typography,
    IconButton,
    Pagination,
    Box,
    Grid,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Iconify from '@/components/iconify/Iconify';
import {
    useGetAllcompanyUserRolesQuery,
    useDeletecompanyUserRolesByIdMutation
} from '@/api/CompanySlices/companyUserRoleSlice';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import EditUser from './EditUser';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Link } from 'react-router-dom';
import { useUnlockUsersMutation } from '../../../api/MPOSlices/UserSlice'
import { CookieContext } from '../../../App';

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'company', label: 'Company', alignRight: false },
    { id: 'role', label: 'Role', alignRight: false },
    { id: 'isVerified', label: 'Verified', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '' },
];

const DefaultList = ({ filterValue, handleChangeStatus }) => {

    const { company_id } = useContext(CookieContext);

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [openDialogues, setOpenDialogues] = useState({});

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

    const handleClickOpen = useCallback((userId) => {
        setOpenDialogues((prev) => ({ ...prev, [userId]: true }));
    }, []);

    const handleClose = useCallback((userId) => {
        setOpenDialogues((prev) => ({ ...prev, [userId]: false }));
    }, []);

    //!Pagination logic
    const [page, setPage] = useState(1)


    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    // ! Get all users wala
    const { data, refetch } = useGetAllcompanyUserRolesQuery({ company_name: company_id, page: page, is_active: filterValue });

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });
    const [unlockUser] = useUnlockUsersMutation()
    const [locks, setLocks] = useState();

    const UserLocks = useCallback(async ({ userId, isTpLocked }) => {
        const newLockStatus = !isTpLocked;
        setLocks(newLockStatus);

        try {
            const response = await unlockUser({ id: userId, is_tp_locked: newLockStatus }).unwrap();

            if (response.data) {
                setSuccessMessage({ show: true, message: 'User Unlocked' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            } else {
                setErrorMessage({ show: true, message: 'Data failed to add.' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred . Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
        handleClose()
    }, [unlockUser, handleClose]);

    const totalPages = useMemo(() => Math.ceil((data?.count || 0) / 30), [data]);
    return (
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
                                <TableCell><Skeleton /></TableCell>
                                <TableCell><Skeleton /></TableCell>
                                <TableCell><Skeleton /></TableCell>
                            </TableRow>
                        ))}
                </> :
                    <>{data && data.results.map((user, index) => (
                        <TableRow hover tabIndex={-1} role="checkbox" key={user.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell component="th" scope="row" align="left">
                                <Typography variant="subtitle2" noWrap>
                                    {user.user_name.first_name + ' ' + user.user_name.middle_name + ' ' + user.user_name.last_name}
                                </Typography>
                            </TableCell>
                            <TableCell align="left">{user.user_name.email}</TableCell>
                            <TableCell align="left">{user.user_name.phone_number}</TableCell>
                            <TableCell align="left">{user.role_name.role_name_value}</TableCell>
                            <TableCell align="left">{user.company_area.company_area}</TableCell>
                            <TableCell align="left">{user.executive_level.user_name === null ? "" : user?.executive_level?.user_name?.first_name + " " + user?.executive_level?.user_name?.middle_name + " " + user?.executive_level?.user_name?.last_name}</TableCell>
                            <TableCell align="left">{user.division_name.division_name === null ? "" : user.division_name.division_name}</TableCell>
                            <TableCell align="left">
                                {
                                    user?.role_name?.role_name?.role_name === "admin" ?
                                        "Active" :
                                        <select onChange={(e) => handleChangeStatus(e, user)} defaultValue={user.user_name.is_active} className='select-styles'>
                                            <option value={true}>Active</option>
                                            <option value={false}>Inactive</option>
                                        </select>
                                }
                            </TableCell>
                            <TableCell align="left">
                                {user?.is_tp_locked === false ? (
                                    <>
                                        <IconButton
                                            color={'primary'}
                                            sx={{ width: 40, height: 40, mt: 0.75 }}
                                            onClick={() => { setSelectedId(user?.id); handleClickOpen(user?.id); }}
                                        >
                                            <Badge>
                                                <Iconify icon="dashicons:unlock" />
                                            </Badge>
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <IconButton
                                            color={'error'}
                                            sx={{ width: 40, height: 40, mt: 0.75 }}
                                            onClick={() => { setSelectedId(user.id); handleClickOpen(user.id); }}
                                        >
                                            <Badge>
                                                <Iconify icon="material-symbols:lock" />
                                            </Badge>
                                        </IconButton>
                                        <Dialog
                                            fullScreen={fullScreen}
                                            open={openDialogues[user.id] || false}
                                            onClose={() => handleClose(user.id)}
                                            aria-labelledby="responsive-dialog-title"
                                        >
                                            <DialogTitle id="responsive-dialog-title">
                                                {"Do you want to unlock this user?"}
                                            </DialogTitle>
                                            <DialogActions>
                                                <Button
                                                    autoFocus
                                                    onClick={() => UserLocks({ userId: user?.id, isTpLocked: user?.is_tp_locked })}
                                                >
                                                    Yes
                                                </Button>
                                                <Button
                                                    onClick={() => handleClose(user.id)}
                                                    autoFocus
                                                >
                                                    No
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </>
                                )}

                            </TableCell>
                            <TableCell align="right">
                                {/* //!User Login */}
                                {user?.user_name?.is_admin === false ? <>
                                    <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }}>
                                        <Badge>
                                            <Iconify icon="ic:sharp-login" />
                                        </Badge>
                                    </IconButton>
                                </> : <></>}

                                {/* //!Edit */}
                                <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(user.id)} >
                                    <Badge>
                                        <Iconify icon="eva:edit-fill" />
                                    </Badge>
                                </IconButton>
                                {/* <Dialog
                                    fullScreen={fullScreen}
                                    open={openDialogue}
                                    onClose={handleClose}
                                    aria-labelledby="responsive-dialog-title"
                                >
                                    <DialogTitle id="responsive-dialog-title">
                                        {"Are you sure want to delete?"}
                                    </DialogTitle>
                                    <DialogActions>
                                        <Button autoFocus onClick={() => handleDelete(selectedId)}>
                                            Yes
                                        </Button>
                                        <Button
                                            onClick={handleClose}
                                            autoFocus>
                                            No
                                        </Button>
                                    </DialogActions>
                                </Dialog> */}
                                {isDrawerOpen && <EditUser
                                    idharu={selectedUpdateId} onClose={onCloseDrawer}
                                />
                                }
                            </TableCell>
                        </TableRow>
                    ))
                    }

                        {/* //!pagination */}
                        <TableRow>
                            <TableCell colSpan={6}>
                                <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                    {data ? (
                                        <Pagination
                                            count={totalPages}
                                            onChange={handleChangePage}
                                            page={page}
                                        />
                                    ) : (
                                        <Typography variant="body1">In Search</Typography>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    </>}
            {
                ErrorMessage.show === true ? (
                    <Grid>
                        <Box className="messageContainer errorMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
            {
                SuccessMessage.show === true ? (
                    <Grid>
                        <Box className="messageContainer successMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
        </>
    );
}

export default React.memo(DefaultList);