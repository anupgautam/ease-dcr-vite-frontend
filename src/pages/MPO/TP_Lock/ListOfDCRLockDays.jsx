import React, { useContext } from 'react'
import {
    Container,
    Grid, Box,
    Stack,
    useMediaQuery,
    useTheme
} from '@mui/material';
import DefaultList from './DefaultList'
import AddDCRLockDays from './AddDCRLockDays';
import DCRLockCount from './DCRLockCount';
import {
    useGetTPlockDaysQuery
} from '../../../api/MPOSlices/TourPlanSlice'
import { CookieContext } from '@/App'

const ListOfDCRLockDays = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { data } = useGetTPlockDaysQuery(company_id)

    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Box style={{ marginTop: '10px' }}>
                                <DCRLockCount />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack
                                direction={isSmallScreen ? 'column' : 'row'}
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-end"
                            >
                                <AddDCRLockDays />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <DefaultList />
            </Container>
        </>
    )
}

export default React.memo(ListOfDCRLockDays)