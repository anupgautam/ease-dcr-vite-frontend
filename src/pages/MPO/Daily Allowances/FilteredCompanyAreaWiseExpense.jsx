import React, { useState, useEffect } from 'react';
//! @mui
import {
    Card,
    Badge,
    Table,
    Paper,
    Button,
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import 'react-datepicker/dist/react-datepicker.css';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';

import {
    useDeleteCompanyAreaWiseExpensesByIdMutation,
    useSearchCompanyAreaWiseExpensesMutation
} from '@/api/CompanySlices/companyAreaWiseExpenses';
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice'

import DefaultCompanyAreaWiseExpense from './DefaultCompanyAreaWiseExpense';
import EditCompanyAreaWiseExpenses from './EditCompanyAreaWiseExpenses';
import { useSelector } from 'react-redux';


const TABLE_HEAD = [
    { id: 'expenses_type', label: 'Expenses Type', alignRight: false },
    { id: 'expenses_rate', label: 'Expenses Rate', alignRight: false },
    { id: 'company_area', label: 'Company Area', alignRight: false },
    { id: '' },
];

const FilteredCompanyAreaWiseExpense = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);


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

    //! Options
    const [companyId, setCompanyId] = useState();
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = useCallback((event, value) => {
        setCompanyId(company_id);
        setSelectedOption(value?.id);
    }, []);

    //! Get all company area 
    const { data, isSuccess } = useGetAllCompanyAreasQuery(company_id);

    const companyareas = useMemo(() => {
        if (isSuccess) {
            data.map((key) => ({ id: key.id, title: key.company_area }));
        }
        return [];
    }, [isSuccess])


    //! Search results
    const [searchApplicationFilter, results] = useSearchCompanyAreaWiseExpensesMutation()

    //! onSearch
    const FilteredData = { area_name: selectedOption, company_name: companyId, }

    useEffect(() => {
        if (companyId || selectedOption) {
            searchApplicationFilter(FilteredData)
        }
    }, [companyId, selectedOption])


    // !Delete Application
    const [deleteApplication] = useDeleteCompanyAreaWiseExpensesByIdMutation()

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

    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Autocomplete
                                options={companyareas}
                                getOptionLabel={(option) => option.title}
                                onChange={handleOptionChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Company Areas" />
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

                {results.data ?
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
                                                    results.data === undefined ? <>
                                                        {
                                                            eightArrays.map((key) => (
                                                                <TableRow id={key} >
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
                                                        <>
                                                            {results?.data?.results && results?.data?.results?.length == 0 ?
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
                                                                            </Typography>
                                                                        </Paper>
                                                                    </TableCell>
                                                                </TableRow>
                                                                :
                                                                results?.data?.results && results?.data?.results?.map((companyAreaWiseExpenses, index) => (
                                                                    <TableRow hover tabIndex={-1} role="checkbox" key={companyAreaWiseExpenses.id}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell component="th" scope="row" align="left">
                                                                            {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                            <Typography variant="subtitle2" noWrap>
                                                                                {companyAreaWiseExpenses.expenses_rate}
                                                                            </Typography>
                                                                            {/* </Stack> */}
                                                                        </TableCell>
                                                                        {/* <TableCell align="left">{companyAreaWiseExpenses.expenses_rate}</TableCell> */}
                                                                        <TableCell align="left">{companyAreaWiseExpenses.area_name.company_area.area_name}</TableCell>

                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(companyAreaWiseExpenses.id)} >
                                                                            <Badge>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(companyAreaWiseExpenses.id); handleClickOpen() }}>
                                                                            <Badge>
                                                                                <Iconify icon="eva:trash-2-outline" />
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
                                                                                <Button autoFocus onClick={() => { deleteApplication(selectedId); handleClose() }}>
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
                                {isDrawerOpen && <EditCompanyAreaWiseExpenses
                                    idharu={selectedUpdateId} onClose={onCloseDrawer}
                                />
                                }
                            </Scrollbar>
                        </Card>
                    </> : <DefaultCompanyAreaWiseExpense />}
            </Card>
        </>
    )
}

export default React.memo(FilteredCompanyAreaWiseExpense)