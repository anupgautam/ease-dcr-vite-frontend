import React from 'react'
import {
    Grid,
    Box,
    Container,
    Stack,
    useMediaQuery,
    useTheme
} from '@mui/material';

import DoctorCount from './DoctorCount';
import DoctorSearch from './DoctorSearch';
import ExportDoctor from './exportDoctor';
import AddDoctor from './AddDoctor';
import Cookies from 'js-cookie';

const ListOfDoctor = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Box style={{ marginTop: '10px' }}>
                                <DoctorCount />
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
                                    Cookies.get('user_role') === "admin" &&
                                    <ExportDoctor />
                                }
                                <AddDoctor />
                            </Stack>
                        </Grid>

                    </Grid>
                </Box>
                <DoctorSearch />
            </Container>
        </>
    )
}

export default React.memo(ListOfDoctor)