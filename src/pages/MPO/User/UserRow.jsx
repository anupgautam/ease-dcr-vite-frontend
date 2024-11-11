import React, { useState, useCallback } from 'react';
import { TableRow, TableCell, Typography, IconButton, Badge, Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import Iconify from '@/components/iconify/Iconify';
import Skeleton from 'react-loading-skeleton';
import { useUnlockUsersMutation } from '../../../api/MPOSlices/UserSlice';
import EditUserAdmin from './EditUserAdmin';

const UserRow = ({ user, index, handleChangeStatus, handleClickOpen, openDialogues, handleClose, UserLocks }) => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id) => {
        if (selectedUpdateId !== id) {
            setSelectedUpdateId(id);
            setIsDrawerOpen(true);
        }
    }, [selectedUpdateId]);

    const onCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedUpdateId(null);
    };




    const [locks, setLocks] = useState();
    const [unlockUser] = useUnlockUsersMutation();

    const onUnlockClick = async (userId, isTpLocked) => {
        const newLockStatus = !isTpLocked;
        setLocks(newLockStatus);

        try {
            const response = await unlockUser({ id: userId, is_tp_locked: newLockStatus }).unwrap();
            if (response.data) {
                UserLocks({ userId, isTpLocked: newLockStatus });
            }
        } catch (error) {
            console.error("Error unlocking user:", error);
        }
    };

    return (
        <TableRow hover tabIndex={-1} role="checkbox" key={user.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell component="th" scope="row" align="left">
                <Typography variant="subtitle2" noWrap>
                    {user?.user_name?.first_name + ' ' + user?.user_name?.middle_name + ' ' + user?.user_name?.last_name}
                </Typography>
            </TableCell>
            {/* Add other TableCell components as needed */}
            <TableCell align="left">{user?.user_name?.email}</TableCell>
            <TableCell align="left">{user?.user_name?.phone_number}</TableCell>
            <TableCell align="left">{user?.role_name?.role_name_value}</TableCell>
            <TableCell align="left">
                {user?.company_area?.map((area, index) => (
                    <div key={index}>
                        {area.company_area}
                    </div>
                ))}
            </TableCell>
            <TableCell align="left">
                {user?.division_name?.map((division, index) => (
                    <div key={index}>
                        {division.division_name}
                    </div>
                ))}
            </TableCell>
            <TableCell align="left">{user?.executive_level?.user_name === null ? "" : user?.executive_level?.user_name?.first_name + " " + user?.executive_level?.user_name?.middle_name + " " + user?.executive_level?.user_name?.last_name}</TableCell>
            <TableCell align="left">
                {
                    user?.role_name?.role_name?.role_name === "admin" ?
                        "Active" :
                        <select onChange={(e) => handleChangeStatus(e, user)} defaultValue={user?.user_name?.is_active} className='select-styles'>
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                        </select>
                }
            </TableCell>
            <TableCell align="left">
                {user?.is_tp_locked === false ? (
                    <IconButton
                        color={'primary'}
                        sx={{ width: 40, height: 40, mt: 0.75 }}
                        onClick={() => handleClickOpen(user?.id)}
                    >
                        <Badge>
                            <Iconify icon="dashicons:unlock" />
                        </Badge>
                    </IconButton>
                ) : (
                    <IconButton
                        color={'error'}
                        sx={{ width: 40, height: 40, mt: 0.75 }}
                        onClick={() => handleClickOpen(user.id)}
                    >
                        <Badge>
                            <Iconify icon="material-symbols:lock" />
                        </Badge>
                    </IconButton>
                )}
            </TableCell>
            <TableCell align="right">
                {/* //!User Login */}
                {user?.user_name?.is_admin === false ? <>
                    <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => UserLogin(user)}>
                        <Badge>
                            <Iconify icon="ic:sharp-login" />
                        </Badge>
                    </IconButton>
                </> : <></>}

                {/* //!Edit */}
                <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(user?.id)} >
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
                {isDrawerOpen && selectedUpdateId && (<EditUserAdmin
                    idharu={selectedUpdateId} onClose={onCloseDrawer}
                />
                )}
                {/* {isDrawerOpen && <EditUser
                                    idharu={selectedUpdateId} onClose={onCloseDrawer}
                                />
                                } */}
            </TableCell>

            <Dialog
                open={openDialogues[user.id] || false}
                onClose={() => handleClose(user.id)}
            >
                <DialogTitle>Do you want to unlock this user?</DialogTitle>
                <DialogActions>
                    <Button
                        onClick={() => onUnlockClick(user?.id, user?.is_tp_locked)}
                    >
                        Yes
                    </Button>
                    <Button onClick={() => handleClose(user.id)}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </TableRow>
    );
};

export default React.memo(UserRow);
