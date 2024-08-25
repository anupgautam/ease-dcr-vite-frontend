import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
//! @mui
import {
    Card,
    TextField,
    Box,
    Grid,
    Autocomplete
} from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DefaultList from './DefaultList';
import 'react-datepicker/dist/react-datepicker.css';
import "nepali-datepicker-reactjs/dist/index.css"

import 'react-loading-skeleton/dist/skeleton.css'

import { useGetCompanyRolesByCompanyQuery } from '@/api/CompanySlices/companyRolesSlice';
import {
    useDeleteApplicationsByIdMutation
} from '@/api/ApplicationSlices/ApplicationSlices';
import {
    useGetAllcompanyUserRolesWithoutPaginationQuery,
} from '@/api/CompanySlices/companyUserRoleSlice';
import {
    useSearchLockedUsersMPOMutation,
} from '@/api/MPOSlices/TourPlanSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { CookieContext } from '@/App'


const TABLE_HEAD = [
    { id: 'select_the_date_id', label: 'Tour Plan Date', alignRight: false },
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'role_name', label: 'Role Name', alignRight: false },
    { id: '' },
];

const FilteredLockedUsers = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');
    const role = searchParams.get('role');

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    //! Company Roles list
    const roleList = useGetCompanyRolesByCompanyQuery(company_id);

    const [companyRoleList, setCompanyRoleList] = useState([]);
    const [roleSelect, setRoleSelect] = useState('');

    useEffect(() => {
        let dataList = []
        if (roleList?.data) {
            roleList.data.map((key) => {
                dataList.push({ id: key.id, title: key.role_name_value })
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
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    //! Get User roles wala
    const { data, isLoading, isSuccess, isError, error } = useGetAllcompanyUserRolesWithoutPaginationQuery({ id: company_id })

    const rolesOptions = useMemo(() => {
        if (isSuccess) {
            return data?.map((key) => ({
                id: key.id,
                title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name,
                role: key.role_name.role_name.role_name
            }));
        }
        return [];
    }, [data])

    //! Options
    const [companyId, setCompanyId] = useState();
    const [selectedOption, setSelectedOption] = useState();
    const [mpoName, setMPOName] = useState('');
    const handleOptionChange = useCallback((event, value) => {
        setCompanyId(company_id);
        setSelectedOption(value);
    }, []);

    const navigate = useNavigate();

    useEffect(() => {
        if (selectedOption) {
            navigate(`/dashboard/admin/locked/user?id=${selectedOption?.id}&role=${selectedOption?.role}`)
        }
    }, [selectedOption])

    //! Search results
    const [searchLockedUserMPOFilter, results] = useSearchLockedUsersMPOMutation()

    const handleInputMPOChange = useCallback((event) => {
        const { name, value } = event.target;

        setMPOName(event.target.value)
    }, []);

    //! Nepali Date Format
    const [dateData, setDateData] = useState()

    //! Date Format 
    // const [startDate, setStartDate] = useState();
    // const [dateData, setDateData] = useState('')

    // const handleDateChange = (date) => {
    //     setStartDate(date)
    //     if (date) {
    //         const nextDate = new Date(date.getTime());
    //         nextDate.setDate(nextDate.getDate() + 1);
    //         const dateValue = nextDate.toISOString().split('T')[0];
    //         setDateData(dateValue);
    //     }
    // }

    //! onSearch
    const FilteredData = { selectedOption: selectedOption, companyId: companyId, roleSelect: roleSelect }

    useEffect(() => {
        if (companyId || roleSelect || selectedOption) {

            searchLockedUserMPOFilter(FilteredData)
        }
    }, [companyId, selectedOption, roleSelect])


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

    //! Date format
    const [dateFormat, setDateFormat] = useState("");
    const [actualDate, setActualDate] = useState("");
    useEffect(() => {
        if (data && data.length > 0) {
            // const { submission_date } = data[0].application_id;
            // setDateFormat(submission_date);
        }
    }, [data]);

    useEffect(() => {
        if (dateFormat) {
            const date = new Date(dateFormat);
            const formattedDate = date.toISOString().split("T")[0];
            setActualDate(formattedDate)
        }
    }, [dateFormat]);

    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={2.5}>
                            <Autocomplete
                                options={rolesOptions}
                                getOptionLabel={(option) => option.title}
                                onChange={handleOptionChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Users" />
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
                <DefaultList mpo_name={selectedOption ? selectedOption : { id: id, role: role }} />
            </Card>
        </>
    )
}

export default React.memo(FilteredLockedUsers)