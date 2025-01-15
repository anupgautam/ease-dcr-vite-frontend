import React from 'react'
import {
    Stack,
    Container,
    Grid, Box,
    useMediaQuery,
    useTheme
} from '@mui/material';
import TravelAllowancesCount from './TravelAllowancesCount';
import FilterTravelAllowances from './FilterTravelAllowances';
import AddTravelAllowances from './AddTravelAllowancesMPO'
import ExcelCSVTravelAllowances from './ExcelCSVTravelAllowances';
import { useSelector } from 'react-redux';
import TravelRolePage from './TravelRolePage';

const ListOfTravelAllowances = () => {
    const { user_role } = useSelector((state) => state.cookie);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Box style={{ marginTop: '10px' }}>
                                <TravelAllowancesCount />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack
                                direction={isSmallScreen ? 'column' : 'row'}
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-end"
                            >
                                {user_role === 'admin' &&
                                    <ExcelCSVTravelAllowances />
                                }
                                {user_role !== 'admin' &&
                                    <AddTravelAllowances />
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <TravelRolePage/>
                {/* <FilterTravelAllowances /> */}
            </Container>
        </>
    )
}
export default React.memo(ListOfTravelAllowances)