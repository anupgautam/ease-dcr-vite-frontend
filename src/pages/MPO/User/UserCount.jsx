import React, { useState, useCallback, useContext } from 'react'
import { Typography } from '@mui/material';
import { useGetAllcompanyUserRolesQuery } from '@/api/CompanySlices/companyUserRoleSlice';
import { CookieContext } from '@/App'

const UserCount = () => {

    const { company_id } = useContext(CookieContext)
    const [page, setPage] = useState(1)
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const { data } = useGetAllcompanyUserRolesQuery({ company_name: company_id, page: page });
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