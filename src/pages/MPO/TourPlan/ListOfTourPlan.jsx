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
import AddTourPlan from './addTourPlan';
import AddUnplannedTp from './addUnplannedTp';
import { useSelector } from 'react-redux';

const ListOfTourPlan = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container>
            <Box style={{ marginBottom: '30px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={user_role === 'admin' ? 12 : 8} md={8}>
                        <TourPlanCount />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Stack
                            direction={isSmallScreen ? 'column' : 'row'}
                            spacing={2}
                            alignItems={isSmallScreen ? 'flex-start' : 'center'}
                            justifyContent={isSmallScreen ? 'flex-start' : 'flex-end'}
                        >
                            {
                                user_role !== 'admin' &&
                                <Box>
                                    <AddUnplannedTp />
                                </Box>
                            }
                            <Box>
                                {
                                    user_role === 'admin' ?
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