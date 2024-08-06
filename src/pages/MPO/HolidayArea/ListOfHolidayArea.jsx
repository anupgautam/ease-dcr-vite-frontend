import React from 'react'
import {
    Container,
    Grid, Box, Typography
} from '@mui/material';
import DefaultHolidayArea from './DefaultHolidayArea'
import AddHolidayArea from './AddHolidayArea';
import HolidayAreaCount from './HolidayAreaCount';
import FilterHolidayArea from './FilterHolidayArea';

const ListOfHolidayArea = () => {
    return (
        <>
            <Container>
                <Grid container style={{ marginBottom: '30px' }}>
                    <Grid item xs={10}>
                        <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                            Holiday Areas
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container>
                            <Grid item xs={2}>
                            </Grid>
                            <Grid item xs={10}>
                                <Box style={{ textAlign: 'right', marginBottom: "20px" }}>
                                    <AddHolidayArea />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <DefaultHolidayArea />
            </Container>
        </>
    )
}

export default React.memo(ListOfHolidayArea)