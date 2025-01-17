import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllSecondarySalesQuery } from '@/api/MPOSlices/SecondarySalesApiSlice';
import { useGetSecondarySalesByCompanyIdQuery } from '../../../../api/OrderedProductslices/chemistOrderedProductSlice';
import { useSelector } from 'react-redux';

const SecondarySalesCount = () => {
    const { company_id } = useSelector((state) => state.cookie);

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the chemists
    const { data } = useGetSecondarySalesByCompanyIdQuery({ company_id: company_id });

    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                        Total Secondary Sales: {data?.length}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: '600' }}>Secondary Sales Count</Typography>
            }
        </>
    )
}

export default React.memo(SecondarySalesCount)