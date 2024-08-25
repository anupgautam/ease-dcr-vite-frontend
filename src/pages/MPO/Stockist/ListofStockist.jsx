import React, { useContext } from 'react'
import {
    Stack,
    Container,
    Grid,
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';

import StockistCount from './StockistCount';
import StockistSearch from './StockistSearch';
import AddStockist from './AddStockist';
import ExportStockist from './exportStockist';
import { CookieContext } from '@/App'

const ListofStockist = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Box style={{ marginTop: '10px' }}>
                                <StockistCount />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack
                                direction={isSmallScreen ? 'column' : 'row'}
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-end"
                            >
                                {
                                    user_role === 'admin' &&
                                    <ExportStockist />
                                }
                                {
                                    user_role === 'admin' &&
                                    <AddStockist />
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <StockistSearch />
            </Container>
        </>
    )
}

export default React.memo(ListofStockist)