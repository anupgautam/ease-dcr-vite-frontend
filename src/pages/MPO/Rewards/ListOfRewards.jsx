import React from 'react'
import {
    Container,
    Grid, Box
} from '@mui/material';
import DefaultList from './DefaultList'
import AddRewards from './AddRewards';
import RewardCount from './RewardCount';
import {
    useGetAllRewardsQuery
} from '../../../api/MPOSlices/rewardsApiSlice'
import Cookies from 'js-cookie'
import ExportToExcel from '@/reusable/utils/exportSheet';

const ListOfRewards = () => {
    const { data } = useGetAllRewardsQuery(Cookies.get('company_id'))

    const headers = [
        { label: 'S.No.', key: 'sno' },
        { label: 'Reward', key: 'reward' },
        { label: 'Price', key: "price" },
    ];

    const templateData = data?.map((values, index) => ({
        sno: index + 1,
        reward: values?.reward,
        price: values?.price
    }))

    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={9}>
                            <RewardCount />
                        </Grid>
                        <Grid item xs={2}>
                            <Box style={{ float: 'right' }}>
                                {data ?
                                    <>
                                        <ExportToExcel headers={headers} fileName={`Rewards`} data={templateData} />
                                    </> : <></>}
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            <Box style={{ float: 'right' }}>
                                <AddRewards />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <DefaultList />
            </Container>
        </>
    )
}

export default React.memo(ListOfRewards)