import React, { useContext } from 'react'
// @mui
import {
    Container, Grid, Box
} from '@mui/material';

import FilteredDCR from './FilteredDCR';
import ExcelCSVDCR from './ExcelCSVDCR';
import AddDcrForHo from './addDcr';
import { CookieContext } from '@/App'

const ListOfDCR = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    return (
        <Container>
            <Box style={{ marginBottom: '30px' }}>
                <Grid container>
                    <Grid item xs={10}>
                        {/* <TourPlanCount /> */}
                    </Grid>
                    {
                        user_role === 'admin' ?
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