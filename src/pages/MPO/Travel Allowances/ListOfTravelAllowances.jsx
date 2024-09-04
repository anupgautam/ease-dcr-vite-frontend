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
import AddTravelAllowances from './AddTravelAllowances'
import ExcelCSVTravelAllowances from './ExcelCSVTravelAllowances';


const ListOfTravelAllowances = () => {

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
                                {/* {
                                    user_role === "admin" &&
                                    <ExportChemist />
                                } */}

                                <ExcelCSVTravelAllowances />
                                <AddTravelAllowances />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <FilterTravelAllowances />
            </Container>
        </>
    )
}
export default React.memo(ListOfTravelAllowances)