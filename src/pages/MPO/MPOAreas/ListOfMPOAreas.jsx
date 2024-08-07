import React from 'react'
import {
    Stack,
    Container,
    Grid,
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';

import FilterMPOAreas from './FilterMPOAreas';
import MPOAreasCount from './MPOAreasCount';
import AddMpoArea from './addMpoArea';
import TransferMpoArea from './transferMpoArea';

const ListOfLockedUsers = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={10} md={9}>
                            <MPOAreasCount />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack
                                direction={isSmallScreen ? 'column' : 'row'}
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-end"
                            >
                                <TransferMpoArea />
                                <AddMpoArea />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <FilterMPOAreas />
            </Container>
        </>
    )
}

export default React.memo(ListOfLockedUsers);