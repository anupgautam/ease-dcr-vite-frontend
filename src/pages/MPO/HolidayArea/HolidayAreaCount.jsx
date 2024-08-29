import React, { useState, useCallback, useMemo } from 'react'
import { Typography } from '@mui/material';
import { useGetHolidayAreasQuery } from '@/api/HolidaySlices/holidaySlices';
import { useSelector } from 'react-redux';

const HolidayAreaCount = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

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