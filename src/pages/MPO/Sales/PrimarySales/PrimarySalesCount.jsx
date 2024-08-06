import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllPrimarySalesQuery } from '@/api/MPOSlices/PrimarySalesApiSlice';

const PrimarySalesCount = () => {
    const [page, setPage] = useState(1)
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the chemists
    const { data } = useGetAllPrimarySalesQuery(page)
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                        Primary Sales Count {data.count}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: '600' }}>Primary Sales Count</Typography>}
        </>
    )
}

export default React.memo(PrimarySalesCount)