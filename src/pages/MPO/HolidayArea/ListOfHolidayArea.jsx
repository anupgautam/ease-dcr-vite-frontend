import React, { useState } from 'react'
import {
    Container,
    Grid, Box, Typography,
    Stack, useMediaQuery, useTheme, Button
} from '@mui/material';
import DefaultHolidayArea from './DefaultHolidayArea'
import AddHolidayArea from './AddHolidayArea';
import HolidayAreaCount from './HolidayAreaCount';
import FilterHolidayArea from './FilterHolidayArea';
import AddHolidayName from './AddHolidayName';
import DefaultHolidays from './DefaultHolidays';

const ListOfHolidayArea = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [showHolidayArea, setShowHolidayArea] = useState(true);

    const handleToggle = () => {
        setShowHolidayArea(!showHolidayArea);
    };
    return (
        <>
            <Container>
                <Grid container style={{ marginBottom: '30px' }}>
                    <Grid item xs={10} md={9}>
                        <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                            Holiday Areas
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Stack
                            direction={isSmallScreen ? 'column' : 'row'}
                            spacing={2}
                            alignItems="center"
                            justifyContent="flex-end"
                        >
                            <AddHolidayName />
                            <AddHolidayArea />
                        </Stack>
                    </Grid>
                </Grid>
                <Box>
                    <Box marginBottom={2}>
                        <Button
                            variant="outlined"
                            className="cancel-button"
                            onClick={handleToggle}
                        >
                            {showHolidayArea ? 'View Holiday Names' : 'View Holiday Areas'}
                        </Button>
                    </Box>
                    {showHolidayArea ? <DefaultHolidayArea /> : <DefaultHolidays />}
                </Box>
            </Container>
        </>
    )
}

export default React.memo(ListOfHolidayArea)