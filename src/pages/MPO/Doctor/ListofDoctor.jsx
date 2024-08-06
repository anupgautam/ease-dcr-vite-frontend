import React from 'react'
import {
    Grid,
    Box,
    Container,
} from '@mui/material';

import DoctorCount from './DoctorCount';
import DoctorSearch from './DoctorSearch';
import ExportDoctor from './exportDoctor';
import AddDoctor from './AddDoctor';
import Cookies from 'js-cookie';

const ListOfDoctor = () => {
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={9}>
                            <DoctorCount />
                        </Grid>
                        <Grid item xs={2}>
                            {
                                Cookies.get('user_role') === "admin" &&
                                <ExportDoctor />
                            }
                        </Grid>
                        <Grid item xs={1}>
                            <Box style={{ float: "right" }}>
                                <AddDoctor />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <DoctorSearch />
            </Container>
        </>
    )
}

export default React.memo(ListOfDoctor)