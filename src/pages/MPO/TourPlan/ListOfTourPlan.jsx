import React from 'react'
import {
    Stack,
    Grid,
    Box,
    Container
} from '@mui/material';

import TourPlanCount from './TourPlanCount';
import FilteredTourPlan from './FilteredTourPlan';
import ExcelCSVTourPlan from './ExcelCSVTourPlan';
import Cookies from 'js-cookie';
import AddTourPlan from './addTourPlan';
import AddUnplannedTp from './addUnplannedTp';

const ListOfTourPlan = () => {
    return (
        <Container>
            <Box style={{ marginBottom: '30px' }}>
                <Grid container>
                    <Grid item xs={Cookies.get('user_role') === 'admin' ? 10 : 9}>
                        <TourPlanCount />
                    </Grid>
                    {
                        Cookies.get('user_role') !== 'admin' &&
                        <Grid item xs={2}>
                            <Box style={{ float: "right" }}>
                                <AddUnplannedTp />
                            </Box>
                        </Grid>
                    }
                    <Grid item xs={Cookies.get('user_role') === 'admin' ? 2 : 1}>
                        {
                            Cookies.get('user_role') === 'admin' ?
                                <Box style={{ float: "right" }}>
                                    <ExcelCSVTourPlan />
                                </Box> :
                                <Box style={{ float: "right" }}>
                                    <AddTourPlan />
                                </Box>
                        }
                    </Grid>
                </Grid>
            </Box>
            <FilteredTourPlan />
        </Container>
    )
}

export default React.memo(ListOfTourPlan)