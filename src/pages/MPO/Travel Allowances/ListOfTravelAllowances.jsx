import React from 'react'
import {
    Container,
    Grid, Box
} from '@mui/material';
import TravelAllowancesCount from './TravelAllowancesCount';
import FilterTravelAllowances from './FilterTravelAllowances';

const ListOfTravelAllowances = () => {

    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={9}>
                            <TravelAllowancesCount />
                        </Grid>
                    </Grid>
                </Box>
                <FilterTravelAllowances />
            </Container>
        </>
    )
}
export default React.memo(ListOfTravelAllowances)