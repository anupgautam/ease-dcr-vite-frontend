import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice';
import { useSelector } from 'react-redux';

const CompanyAreasCount = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the company areas
    const { data } = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: "18px", fontWeight: '600' }}>
                        Total Company Working Areas: {data?.length}
                    </Typography> : <Typography style={{ fontSize: "18px", fontWeight: '600' }}>Company Working Areas</Typography>}
        </>
    )
}

export default React.memo(CompanyAreasCount)