import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllcompanyUserRolesQuery } from '@/api/CompanySlices/companyUserRoleSlice';
import { useSelector } from 'react-redux';

const UserCount = () => {

    const { company_id } = useSelector((state) => state.cookie);
    const [page, setPage] = useState(1)
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const { data } = useGetAllcompanyUserRolesQuery({ company_name: company_id, page: page }, {
        skip: !company_id
    });
    return (
        <>
            {
                data ?
                    <Typography style={{ fontWeight: '600', fontSize: '18px' }}>
                        Total Users: {data.count}
                    </Typography> : <Typography style={{ fontWeight: '600', fontSize: '18px' }}>Users</Typography>}
        </>
    )
}

export default React.memo(UserCount);