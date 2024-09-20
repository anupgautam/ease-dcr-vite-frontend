import React from 'react'
import {
    Container,
    Grid, Box, Typography
} from '@mui/material';
import { useSelector } from 'react-redux';
import FilteredDoctorEvent from './FilteredDoctorEvent';
import AddDoctorEvents from './addDoctorEvents';

const ListofDoctorEvent = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

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
                                {(user_role === 'admin') && (
                                    <Box style={{ float: 'right', marginBottom: '20px' }}>
                                        <AddDoctorEvents />
                                    </Box>
                                )}
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