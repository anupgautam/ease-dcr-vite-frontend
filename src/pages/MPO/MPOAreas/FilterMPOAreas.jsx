import { debounce } from 'lodash';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    Autocomplete,
    Pagination
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import DefaultList from './DefaultList';
import 'react-datepicker/dist/react-datepicker.css';
import "nepali-datepicker-reactjs/dist/index.css"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { UserListHead } from '../../../sections/@dashboard/user';
import { useGetCompanyRolesByCompanyQuery } from '@/api/CompanySlices/companyRolesSlice';
import {
    useDeleteApplicationsByIdMutation
} from '@/api/ApplicationSlices/ApplicationSlices';
import {
    useSearchMPOAreaMutation
} from '@/api/MPOSlices/TourPlanSlice';
import {
    usePostAllMPONamesNoPageMutation
} from '@/api/MPOSlices/DoctorSlice';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice';
import EditMpoArea from './editMpoArea';
import Iconify from '@/components/iconify/Iconify';
import { useSelector } from 'react-redux';

const TABLE_HEAD = [
    { id: 'area_name"', label: 'Tour Plan Date', alignRight: false },
    { id: 'station_type', label: 'User Name', alignRight: false },
    { id: '' },
];

const FilterMPOAreas = () => {
    const { company_id, user_role } = useSelector((state) => state.cookie);
    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    //! Company Roles list
    const roleList = useGetCompanyRolesByCompanyQuery(company_id, {
        skip: !company_id
    });

    const [companyRoleList, setCompanyRoleList] = useState([]);
    const [roleSelect, setRoleSelect] = useState('');
    useEffect(() => {
        let dataList = []
        if (roleList?.data) {
            roleList.data.map((key) => {
                dataList.push({ id: key.id, title: key.role_name.role_name })
            })
        }
        setCompanyRoleList(dataList);
    }, [roleList])

    const handleRoleSelect = useCallback((e, value) => {
        setRoleSelect(value?.id);
    }, [])

    const [selectedId, setSelectedId] = useState(null);
    const [mpoId, setMPOId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id, mpo_id) => {
        setSelectedUpdateId(id);
        setMPOId(mpo_id);
        setIsDrawerOpen(true);
    }, [])

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);


    const { data: CompanyArea } = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });

    const companyAreaData = useMemo(() => {
        if (CompanyArea !== undefined) {
            return CompanyArea.map(key => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [CompanyArea])

    const [CompanyAreaId, setCompanyAreaId] = useState('');

    const handleCompanyChange = useCallback((event, value) => {
        setCompanyAreaId(value?.id);
    }, [])


    //! Get MPO Names
    const [MpoData] = usePostAllMPONamesNoPageMutation()
    //! Get User roles wala
    const [mpoName, setMPOName] = useState('');
    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList.map(key => ({
                id: key.id,
                title: key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name
            }))
        }
        return [];
    }, [MpoList])

    useEffect(() => {
        if (company_id) {
            MpoData({ company_name: company_id })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [company_id])

    //! Options
    const [companyId, setCompanyId] = useState();
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = useCallback((event, value) => {
        setCompanyId(company_id);
        setSelectedOption(value?.id || "");
    }, [])

    //!Pagination logic
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    //! Search results
    const [searchMPOArea, results] = useSearchMPOAreaMutation()

    const handleInputMPOChange = useCallback((event) => {
        const { name, value } = event.target;

        setMPOName(event.target.value)
    }, [])

    //! Nepali Date Format
    const [dateData, setDateData] = useState()

    //! onSearch
    const FilteredData = { selectedOption: selectedOption, companyId: company_id, companyArea: CompanyAreaId }

    useEffect(() => {
        if (companyId || selectedOption || CompanyAreaId) {

            searchMPOArea(FilteredData, {
                skip: !companyId || !selectedOption || !CompanyAreaId
            })
        }
    }, [companyId, selectedOption, CompanyAreaId])


    // !Delete Application
    const [deleteApplication] = useDeleteApplicationsByIdMutation()

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

    // const debouncedSearch = debounce(onSearch, 300);

    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            {
                                user_role === 'admin' &&
                                <Autocomplete
                                    options={mpoNames}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleOptionChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="MPO Names" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            }
                        </Grid>
                        <Grid item xs={3}>
                            {
                                user_role === 'admin' &&
                                <Autocomplete
                                    options={companyAreaData}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleCompanyChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Head Quarter" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            }
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
                                                                results?.data && results?.data?.map((mpoareas, index) => (
                                                                    <TableRow hover tabIndex={-1} role="checkbox" key={mpoareas.id}>
                                                                        <TableCell>{index + 1}</TableCell>
                                                                        <TableCell component="th" scope="row" align="left">
                                                                            <Typography variant="subtitle2" noWrap>
                                                                                {mpoareas.area_name}
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell align="left">{mpoareas.station_type}</TableCell>

                                                                        <TableCell align="left">
                                                                            {
                                                                                user_role === 'admin' &&
                                                                                <>
                                                                                    <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(mpoareas.id)}>
                                                                                        <Badge>
                                                                                            <Iconify icon="eva:edit-fill" />
                                                                                        </Badge>
                                                                                    </IconButton>
                                                                                    <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(mpoareas.id); handleClickOpen() }}>
                                                                                        <Badge>
                                                                                            <Iconify icon="eva:trash-2-outline" />
                                                                                        </Badge>
                                                                                    </IconButton>
                                                                                </>
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
                                                                                <Button autoFocus onClick={() => { deleteApplication(selectedId); handleClose() }}>
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
                                                            {/* //!pagination */}
                                                            <TableRow>
                                                                <TableCell colSpan={6}>
                                                                    <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                                                        {results?.data ? (
                                                                            <Pagination count={parseInt(results?.data?.count / 8) + 1} onChange={handleChangePage} />
                                                                        ) : (
                                                                            <Typography variant="body1">In Search</Typography>
                                                                        )}
                                                                    </Box>
                                                                </TableCell>
                                                            </TableRow>
                                                        </>}
                                            </>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                {isDrawerOpen && <EditMpoArea
                                    idharu={selectedUpdateId} onClose={onCloseDrawer} mpoId={mpoId}
                                />
                                }
                            </Scrollbar>
                        </Card>
                    </> : <DefaultList />}
            </Card>
        </>
    )
}

export default React.memo(FilterMPOAreas)