import React from 'react'
import {
    Stack,
    Grid,
    Box,
    Container,
    useMediaQuery,
    useTheme
} from '@mui/material';

import TourPlanCount from './TourPlanCount';
import FilteredTourPlan from './FilteredTourPlan';
import ExcelCSVTourPlan from './ExcelCSVTourPlan';
import Cookies from 'js-cookie';
import AddTourPlan from './addTourPlan';
import AddUnplannedTp from './addUnplannedTp';

const ListOfTourPlan = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container>
            <Box style={{ marginBottom: '30px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={Cookies.get('user_role') === 'admin' ? 12 : 9} md={9}>
                        <TourPlanCount />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Stack
                            direction={isSmallScreen ? 'column' : 'row'}
                            spacing={2}
                            alignItems={isSmallScreen ? 'flex-start' : 'center'}
                            justifyContent={isSmallScreen ? 'flex-start' : 'flex-end'}
                        >
                            {
                                Cookies.get('user_role') !== 'admin' &&
                                <Box>
                                    <AddUnplannedTp />
                                </Box>
                            }
                            <Box>
                                {
                                    Cookies.get('user_role') === 'admin' ?
                                        <ExcelCSVTourPlan /> :
                                        <AddTourPlan />
                                }
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
            <FilteredTourPlan />
        </Container>
    )
}

export default React.memo(ListOfTourPlan)