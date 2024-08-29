import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllCompanyDivisionsQuery } from '@/api/DivisionSilces/companyDivisionSlice';
import { useSelector } from 'react-redux';

const DivisionCount = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the chemists
    const { data } = useGetAllCompanyDivisionsQuery(company_id);

    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: "18px", fontWeight: '600' }}>
                        Total Divisions: {data?.length}
                    </Typography> : <Typography style={{ fontSize: "18px", fontWeight: '600' }}>Divisions Count</Typography>}
        </>
    )
}

export default React.memo(DivisionCount)