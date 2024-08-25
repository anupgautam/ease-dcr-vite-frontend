import React, { useState, useCallback, useContext } from 'react'
import { Typography } from '@mui/material';
import {
    useGetTPlockDaysQuery
} from '../../../api/MPOSlices/TourPlanSlice'
import { CookieContext } from '@/App'

const DCRLockCount = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const { data } = useGetTPlockDaysQuery(company_id);
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                        DCR Lock Days {data?.length}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: '600' }}>DCR Lock Days</Typography>}
        </>
    )
}

export default React.memo(DCRLockCount)