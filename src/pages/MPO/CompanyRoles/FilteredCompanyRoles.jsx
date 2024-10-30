import React, { useMemo, useState, useEffect, useCallback } from 'react';
//! @mui
import {
    Card,
    Badge,
    Table,
    Paper,
    TableRow,
    TextField,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    Box,
    Grid,
    Autocomplete
} from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DefaultList from './DefaultList';
import EditCompanyRoles from './EditCompanyRoles'
import 'react-datepicker/dist/react-datepicker.css';
import "nepali-datepicker-reactjs/dist/index.css"

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';

import Scrollbar from '@/components/scrollbar/Scrollbar';
import { useGetAllCompanyQuery, useFilterCompanyRolesMutation } from '../../../api/MPOSlices/SuperAdminSlice';


const TABLE_HEAD = [
    { id: 'role_name', label: 'Role Name', alignRight: false },
    { id: 'role_name_value', label: 'Role Name Value', alignRight: false },
    { id: '' },
];

const FilteredCompanyRoles = () => {

    //! For drawer 

    const [selectedId, setSelectedId] = useState(null);
    const [mpoId, setMPOId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id, mpo_id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, [])

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, [])

    //! Get User roles wala
    // const { data, isSuccess } = useGetAllcompanyUserRolesWithoutPaginationQuery({ id: company_id })

    const { data, isSuccess } = useGetAllCompanyQuery()

    const rolesOptions = useMemo(() => {
        if (isSuccess) {
            return data.map(key => ({ id: key.id, title: key.company_name }))
        }
        return [];
    }, [isSuccess])

    //! Options
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = useCallback((event, value) => {
        setSelectedOption(value?.id || "");
    }, [])


    //! Search results
    const [searchCompanyRolesFilter, results] = useFilterCompanyRolesMutation()

    //! onSearch
    const FilteredData = { selectedOption: selectedOption }

    useEffect(() => {
        if (selectedOption) {

            searchCompanyRolesFilter(FilteredData)
        }
    }, [selectedOption])


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

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);


    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <Autocomplete
                                options={rolesOptions}
                                getOptionLabel={(option) => option.title}
                                onChange={handleOptionChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Company" />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 600 }}>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            <TableBody>
                                {results.data ?
                                    <>

                                        <>
                                            {
                                                results.data === undefined ? <>
                                                    {
                                                        eightArrays.map((key) => (
                                                            <TableRow key={key} >
                                                                <TableCell><Skeleton /></TableCell>
                                                                <TableCell><Skeleton /></TableCell>
                                                            </TableRow>
                                                        ))}
                                                </> :
                                                    <>
                                                        {results?.data && results?.data?.length == 0 ?
                                                            <TableRow>
                                                                <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                                                                    <Paper
                                                                        sx={{
                                                                            textAlign: 'center',
                                                                        }}
                                                                    >
                                                                        <Typography variant="h6" paragraph>
                                                                            Not found
                                                                        </Typography>
                                                                        <Typography variant="body2">
                                                                            <strong>Requested Data Not found</strong>.
                                                                            <br /> Try checking for typos or using complete words.
                                                                            <br />
                                                                            <br />
                                                                            <br />
                                                                            <br />
                                                                            <br />
                                                                        </Typography>
                                                                    </Paper>
                                                                </TableCell>
                                                            </TableRow>
                                                            :
                                                            results?.data && results?.data?.map((application, index) => (
                                                                <TableRow hover tabIndex={-1} role="checkbox" key={application.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell component="th" scope="row" align="left">
                                                                        <Typography variant="subtitle2" noWrap>
                                                                            {application.role_name.role_name}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align="left">{application.role_name_value}</TableCell>
                                                                    <TableCell align="left">
                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(application.id)}>
                                                                            <Badge>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))

                                                        }
                                                    </>}
                                        </>

                                        {isDrawerOpen && <EditCompanyRoles
                                            idharu={selectedUpdateId} onClose={onCloseDrawer}
                                        />
                                        }
                                    </>

                                    :
                                    <DefaultList />
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>
        </>
    )
}

export default React.memo(FilteredCompanyRoles)