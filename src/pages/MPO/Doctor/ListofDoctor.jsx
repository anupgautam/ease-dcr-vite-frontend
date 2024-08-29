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
import { useSelector } from 'react-redux';

const ListOfDoctor = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

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
                                    user_role === "admin" &&
                                    <ExportDoctor />
                                }
                                {
                                    user_role === "MPO" || user_role === "admin" &&
                                    <AddDoctor />
                                }
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