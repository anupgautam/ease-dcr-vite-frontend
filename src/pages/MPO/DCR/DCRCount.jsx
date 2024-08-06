import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetTourPlansQuery } from '@/api/MPOSlices/TourPlanApiSlice';

const TourPlanCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the tourplans
    const { data } = useGetTourPlansQuery(page)
    return (
        <>
            {
                data ?
                    <Typography variant="h4" gutterBottom>
                        Tour Plans {data.count}
                    </Typography> : <>Tour Plan Count</>}
        </>
    )
}

export default React.memo(TourPlanCount)