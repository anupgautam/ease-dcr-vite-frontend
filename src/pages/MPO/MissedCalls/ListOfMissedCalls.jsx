import React from 'react'
// @mui
import {
    Stack,
    Container, 
    Typography
} from '@mui/material';

import FilteredMissedCalls from './FilteredMissedCalls';

const ListOfMissedCalls = () => {
    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography style={{ fontSize: '18px', fontWeight: "600" }}>
                    Missed Calls
                </Typography>
            </Stack>
            <FilteredMissedCalls />
        </Container>
    )
}

export default React.memo(ListOfMissedCalls)