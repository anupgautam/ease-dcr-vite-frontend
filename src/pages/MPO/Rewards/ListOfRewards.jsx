import React from 'react'
import {
    Container,
    Grid, Box,
    Stack,
    useMediaQuery,
    useTheme
} from '@mui/material';
import DefaultList from './DefaultList'
import AddRewards from './AddRewards';
import RewardCount from './RewardCount';
import {
    useGetAllRewardsQuery
} from '../../../api/MPOSlices/rewardsApiSlice'
import ExportToExcel from '@/reusable/utils/exportSheet';
import { useSelector } from 'react-redux';
import FlowbiteTable from './FlowbiteTable';

const ListOfRewards = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { data } = useGetAllRewardsQuery(company_id, {
        skip: !company_id
    })

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
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Box style={{ marginTop: '10px' }}>
                                <RewardCount />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack
                                direction={isSmallScreen ? 'column' : 'row'}
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-end"
                            >
                                {data ?
                                    <>
                                        <ExportToExcel headers={headers} fileName={`Rewards`} data={templateData} />
                                    </> : <></>}
                                <AddRewards />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                {/* <DefaultList /> */}
                <FlowbiteTable/>
            </Container>
        </>
    )
}

export default React.memo(ListOfRewards)