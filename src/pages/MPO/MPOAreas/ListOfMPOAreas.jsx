import React from 'react'
import {
    Container,
    Grid, Box
} from '@mui/material';

import FilterMPOAreas from './FilterMPOAreas';
import MPOAreasCount from './MPOAreasCount';
import AddMpoArea from './addMpoArea';
import TransferMpoArea from './transferMpoArea';

const ListOfLockedUsers = () => {
    return (
        <>
            <Container>
                <Grid container spacing={4}>
                    <Grid item xs={10}>
                        <MPOAreasCount />
                    </Grid>
                    <Grid item xs={1}>
                        <Box style={{ float: "right", marginBottom: "15px" }}>
                            <TransferMpoArea />
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        <Box style={{ float: "right", marginBottom: "15px" }}>
                            <AddMpoArea />
                        </Box>
                    </Grid>
                </Grid>
                <FilterMPOAreas />
            </Container>
        </>
    )
}

export default React.memo(ListOfLockedUsers);