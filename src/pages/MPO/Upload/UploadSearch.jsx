import React, { useState, useCallback, useMemo } from 'react';
import {
    TextField,
    InputAdornment,
    Container,
    Card,
    Grid,
    Box,
    Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useForm1 } from '../../../reusable/components/forms/useForm';

import {
    useGetUploadQuery,
    useSearchUploadMutation,
} from '../../../api/Uploads/uploadApiSlice';
import {
    useGetUsersByCompanyRoleWithOutPageQuery
} from '../../../api/MPOSlices/UserSlice';
import DefaultList from './DefaultList'
import { SearchUploadList } from '../../../sections/@dashboard/uploads';
import { useSelector } from 'react-redux';

const UploadSearch = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //!Pagination logic
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const pageData = e.target.ariaLabel
        let thisArray = pageData.split(" ")
        setPage(thisArray[3]);
    }, [])

    //! Get User roles wala
    const { data, isSuccess } = useGetUsersByCompanyRoleWithOutPageQuery(company_id)

    const rolesOptions = useMemo(() => {
        if (isSuccess) {
            return data.map(key => ({
                id: key.id,
                title: key.user_name.first_name + " " + key.user_name.last_name
            }))
        }
        return [];
    }, [isSuccess])

    //! Options
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = useCallback((event, value) => {
        setSelectedOption(value?.id || "");
    }, [])


    // ! Get all uploads wala
    const UploadsWala = useGetUploadQuery({ page: page, id: company_id });

    //! Search results
    const [searchResults, setSearchResults] = useState({ search: "" });

    const [searchUpload, results] = useSearchUploadMutation()


    // !on search
    const onSearch = (e) => {
        const searchQuery = e.target.value;
        setSearchResults({ search: searchQuery, user_id: selectedOption })
        searchUpload(searchResults);
    }

    const initialFValues = {
        "search": " "
    }

    const {
        values,
        handleSearchClick,
    } = useForm1(initialFValues, true);

    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2} alignItems="center">
                        {
                            user_role === "admin" &&
                            <Grid item xs={3}>
                                <Autocomplete
                                    options={rolesOptions}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleOptionChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Roles" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            </Grid>
                        }
                        <Grid item xs={3}>
                            {selectedOption &&
                                <TextField
                                    label="Search Uploads"
                                    variant="outlined"
                                    onChange={(e) => onSearch(e)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{ m: 2 }}
                                />
                            }
                        </Grid>
                    </Grid>

                    {(searchResults.search.length <= 3) ?
                        <DefaultList /> :
                        <Container>
                            <SearchUploadList uploads={UploadsWala?.data} />
                        </Container>
                    }
                </Box>
            </Card>
        </>
    );
}

export default React.memo(UploadSearch);
