import React from 'react'
// @mui
import {
    Container, Grid, Box
} from '@mui/material';

import FilteredDCR from './FilteredDCR';
import ExcelCSVDCR from './ExcelCSVDCR';
import AddDcrForHo from './addDcr';
import { useSelector } from 'react-redux';

const ListOfDCR = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    return (
        <Container>
            <Box style={{ marginBottom: '30px' }}>
                <Grid container>
                    <Grid item xs={10}>
                        {/* <TourPlanCount /> */}
                    </Grid>
                    {
                        user_role === 'admin' ?
                            <></> :
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