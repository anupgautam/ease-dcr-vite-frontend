import React, { useState, useCallback, useContext } from 'react'
import { Typography } from '@mui/material';
import {
    useGetAllRewardsQuery
} from '../../../api/MPOSlices/rewardsApiSlice'
import { CookieContext } from '@/App'


const RewardCount = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const { data } = useGetAllRewardsQuery(company_id);
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                        Total Rewards: {data?.length}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: '600' }}>Rewards</Typography>}
        </>
    )
}

export default React.memo(RewardCount)