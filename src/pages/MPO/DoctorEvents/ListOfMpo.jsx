import React from 'react'
import {
    Container,
    Grid, Typography
} from '@mui/material';

import DefaultMPONames from './DefaultMPONames';

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
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {/* <FilteredDoctorEvent /> */}
                <DefaultMPONames/>
            </Container>
        </>
    )
}

export default React.memo(ListofDoctorEvent);