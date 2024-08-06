import React from 'react'
import {
    Container,
    Grid, Box, Typography
} from '@mui/material';

import FilteredDoctorEvent from './FilteredDoctorEvent';
import AddDoctorEvents from './addDoctorEvents';
import Cookies from 'js-cookie';

const ListofDoctorEvent = () => {
    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography style={{ fontWeight: '600', fontSize: '18px', marginBottom: 20 }}>
                            Doctor Events
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container>
                            <Grid item xs={2}>
                            </Grid>
                            <Grid item xs={10}>
                                {
                                    Cookies.get('user_role') === 'MPO' &&
                                    <Box style={{ float: 'right', marginBottom: "20px" }}>
                                        <AddDoctorEvents />
                                    </Box>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <FilteredDoctorEvent />
            </Container>
        </>
    )
}

export default React.memo(ListofDoctorEvent);