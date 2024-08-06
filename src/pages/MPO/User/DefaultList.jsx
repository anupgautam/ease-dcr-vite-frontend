import React,{ useState, useCallback, useMemo } from 'react';
import {
    Badge,
    Button,
    TableRow,
    TableCell,
    Typography,
    IconButton,
    Pagination,
    Box,
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
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'company', label: 'Company', alignRight: false },
    { id: 'role', label: 'Role', alignRight: false },
    { id: 'isVerified', label: 'Verified', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '' },
];

const DefaultList = ({ filterValue, handleChangeStatus }) => {

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

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
        setOpenDialogue(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDialogue(false);
    }, []);

    //!Pagination logic
    const [page, setPage] = useState(1)


    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // ! Get all users wala
    const { data, refetch } = useGetAllcompanyUserRolesQuery({ company_name: Cookies.get('company_id'), page: page, is_active: filterValue });

    // !Delete chemists
    const [deleteUser] = useDeletecompanyUserRolesByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    const handleDelete = useCallback(
        (id) => {
            deleteUser(id);
            handleClose();
        },
        [deleteUser, handleClose]
    );

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
                                    user.role_name.role_name.role_name === "admin" ?
                                        "Active" :
                                        <select onChange={(e) => handleChangeStatus(e, user)} defaultValue={user.user_name.is_active} className='select-styles'>
                                            <option value={true}>Active</option>
                                            <option value={false}>Inactive</option>
                                        </select>
                                }
                            </TableCell>
                            <TableCell align="left">
                                <Link to={`/dashboard/admin/locked/user?id=${user.id}&role=${user.role_name.role_name.role_name}`}>
                                    <Button>Locked</Button>
                                </Link>
                            </TableCell>
                            <TableCell align="right">
                                {/* //!Edit */}
                                <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(user.id)} >
                                    <Badge>
                                        <Iconify icon="eva:edit-fill" />
                                    </Badge>
                                </IconButton>
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
                                        <Button autoFocus onClick={() => handleDelete(selectedId)}>
                                            Yes
                                        </Button>
                                        <Button
                                            onClick={handleClose}
                                            autoFocus>
                                            No
                                        </Button>
                                    </DialogActions>
                                </Dialog>
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
        </>
    );
}

export default React.memo(DefaultList);