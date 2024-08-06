import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllCompanyDivisionsQuery } from '@/api/DivisionSilces/companyDivisionSlice';
import Cookies from 'js-cookie'

const DivisionCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the chemists
    const { data } = useGetAllCompanyDivisionsQuery(Cookies.get('company_id'));

    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: "18px", fontWeight: '600' }}>
                        Divisions {data?.length}
                    </Typography> : <Typography style={{ fontSize: "18px", fontWeight: '600' }}>Divisions Count</Typography>}
        </>
    )
}

export default React.memo(DivisionCount)