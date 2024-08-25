import React, { useState, useCallback, useMemo, useContext } from 'react'
import { Typography } from '@mui/material';
import { useGetHolidayAreasQuery } from '@/api/HolidaySlices/holidaySlices';
import { CookieContext } from '@/App'

const HolidayAreaCount = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all Holiday Areas
    const { data } = useGetHolidayAreasQuery(company_id);
    return (
        <>
            {
                data ?
                    <Typography style={{ fontWeight: '600', fontSize: '18px' }}>
                        Holiday Areas {data.count}
                    </Typography> : <Typography style={{ fontWeight: '600', fontSize: '18px' }}>Holiday Area Count</Typography>}
        </>
    )
}

export default React.memo(HolidayAreaCount)