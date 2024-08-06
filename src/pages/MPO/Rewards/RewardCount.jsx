import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import {
    useGetAllRewardsQuery
} from '../../../api/MPOSlices/rewardsApiSlice'
import Cookies from 'js-cookie'


const RewardCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const { data } = useGetAllRewardsQuery(Cookies.get('company_id'));
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                        Rewards {data?.length}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: '600' }}>Rewards</Typography>}
        </>
    )
}

export default React.memo(RewardCount)