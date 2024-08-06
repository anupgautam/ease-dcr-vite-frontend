import React from 'react'
// @mui
import {
    Stack,
    Container,
    Grid, Box
} from '@mui/material';

import StockistCount from './StockistCount';
import StockistSearch from './StockistSearch';
import AddStockist from './AddStockist';
import ExportStockist from './exportStockist';
import Cookies from 'js-cookie';

const ListofStockist = () => {
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={1}>
                        <Grid item xs={9}>
                            <StockistCount />
                        </Grid>
                        <Grid item xs={2}>
                            {
                                Cookies.get('user_role') === 'admin' &&
                                <Box style={{ float: "right" }}>
                                    <ExportStockist />
                                </Box>
                            }
                        </Grid>
                        <Grid item xs={1}>
                            {
                                Cookies.get('user_role') === 'admin' &&
                                <Box style={{ float: "right" }}>
                                    <AddStockist />
                                </Box>
                            }
                        </Grid>
                    </Grid>
                </Box>
                <StockistSearch />
            </Container>
        </>
    )
}

export default React.memo(ListofStockist)