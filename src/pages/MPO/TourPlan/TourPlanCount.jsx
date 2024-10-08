import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetTourPlansQuery } from '@/api/MPOSlices/TourPlanSlice';
import { useSelector } from 'react-redux';


const TourPlanCount = () => {
    const { company_id } = useSelector((state) => state.cookie);

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the tourplans
    // const { data } = useGetTourPlansQuery({
    //     id: company_id,
    //     page: page
    // });
    return (
        <>
            {/* {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: "600" }}>
                        Tour Plans {data.count}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: "600" }}>Tour Plan</Typography>
            } */}
            <Typography style={{ fontSize: '18px', fontWeight: "600" }}>Tour Plan</Typography>
        </>
    )
}

export default React.memo(TourPlanCount)