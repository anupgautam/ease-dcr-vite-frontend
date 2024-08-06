import React from 'react'
import {
    Container,
    Grid, Box, Typography
} from '@mui/material';
import Cookies from 'js-cookie';
import FilteredAsignStockist from './filterAsignStockist';
import AddAsignStockist from './addAsignStokist';

const ListOfAsignStokist = () => {
    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography style={{ fontWeight: '600', fontSize: '18px', marginBottom: 20 }}>
                            Assign Stockist
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container>
                            <Grid item xs={2}>
                            </Grid>
                            <Grid item xs={10}>
                                {
                                    Cookies.get('user_role') === 'admin' &&
                                    <Box style={{ float: 'right', marginBottom: "20px" }}>
                                        <AddAsignStockist />
                                    </Box>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <FilteredAsignStockist />
            </Container>
        </>
    )
}

export default React.memo(ListOfAsignStokist);