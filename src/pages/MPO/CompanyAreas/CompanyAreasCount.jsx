import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice';
import Cookies from 'js-cookie'


const CompanyAreasCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the company areas
    const { data } = useGetAllCompanyAreasQuery(Cookies.get('company_id'));
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: "18px", fontWeight: '600' }}>
                        Company Working Areas {data?.length}
                    </Typography> : <Typography style={{ fontSize: "18px", fontWeight: '600' }}>Company Working Areas</Typography>}
        </>
    )
}

export default React.memo(CompanyAreasCount)