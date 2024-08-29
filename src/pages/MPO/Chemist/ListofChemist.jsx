import React from 'react'
import {
    Stack,
    Container,
    Grid,
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';

import ChemistCount from './ChemistCount';
import ChemistSearch from './ChemistSearch';
import AddChemist from './AddChemist';
import ExportChemist from './exportChemist';
import { useSelector } from 'react-redux';

const ListofChemist = () => {
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
                                <ChemistCount />
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
                                    <ExportChemist />
                                }
                                {user_role === "MPO" &&
                                    <AddChemist />
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <ChemistSearch />
            </Container>
        </>
    )
}

export default React.memo(ListofChemist)