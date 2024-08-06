import React from 'react'
// @mui
import {
    Container, Grid, Box
} from '@mui/material';

import FilteredDCR from './FilteredDCR';
import ExcelCSVDCR from './ExcelCSVDCR';
import Cookies from 'js-cookie';
import AddDcrForHo from './addDcr';

const ListOfDCR = () => {
    return (
        <Container>
            <Box style={{ marginBottom: '30px' }}>
                <Grid container>
                    <Grid item xs={10}>
                        {/* <TourPlanCount /> */}
                    </Grid>
                    {
                        Cookies.get('user_role') === 'admin' ?
                            <Grid item xs={2}>

                                <Box style={{ float: "right" }}>
                                    <ExcelCSVDCR />
                                </Box>
                            </Grid> :
                            <Grid item xs={2}>
                                <Box style={{ float: "right" }}>
                                    <AddDcrForHo />
                                </Box>
                            </Grid>
                    }
                </Grid>
            </Box>
            <FilteredDCR />
        </Container>
    )
}

export default React.memo(ListOfDCR);