import React from 'react'
import {
    Container,
    Grid, Box, Typography
} from '@mui/material';

import FilteredApplication from './FilteredApplication';
import AddApplication from './addApplication';
import Cookies from 'js-cookie';


const ListofApplication = () => {
    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Application Lists</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container>
                            <Grid item xs={10}>
                                <Box style={{ float: 'right', marginBottom: "25px" }}>
                                    <AddApplication />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <FilteredApplication />
            </Container>
        </>
    )
}

export default React.memo(ListofApplication);