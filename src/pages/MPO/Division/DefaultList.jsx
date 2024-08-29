import React, { useState, useCallback } from 'react';
import {
    Card,
    Badge,
    Table,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
} from '@mui/material';
import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/scrollbar';
import { UserListHead } from '@/sections/@dashboard/user';
//mock 
import {
    useGetFilteredDivisionsQuery,
    useDeleteCompanyDivisionsByIdMutation,
} from "../../../api/DivisionSilces/companyDivisionSlice";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import EditDivision from './EditDivision';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useSelector } from 'react-redux';


const TABLE_HEAD = [
    { id: 'division_name', label: 'Division Name', alignRight: false },
    { id: '' },
];

const DefaultList = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

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

    //! Get Company Area
    const { data } = useGetFilteredDivisionsQuery(company_id);

    // !Delete companydivisionists
    const [deleteCompanyDivision] = useDeleteCompanyDivisionsByIdMutation()
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
                                {
                                    data === undefined ?
                                        <>
                                            {
                                                eightArrays.map((key) => (
                                                    <TableRow key={key} >
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                    </TableRow>
                                                ))}
                                        </>
                                        :
                                        <>
                                            {data && data.map((companydivision, index) => (
                                                <TableRow hover tabIndex={-1} key={companydivision.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {companydivision.division_name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(companydivision.id)}>
                                                            <Badge>
                                                                <Iconify icon="eva:edit-fill" />
                                                            </Badge>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                            }
                                        </>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>
            {isDrawerOpen && <EditDivision
                idharu={selectedUpdateId} onClose={onCloseDrawer}
            />
            }
        </>
    );
}

export default React.memo(DefaultList);