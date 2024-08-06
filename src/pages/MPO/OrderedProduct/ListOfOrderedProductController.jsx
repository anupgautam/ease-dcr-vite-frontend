import React, { useCallback } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import OrderedProductChemist from './OrderedProductChemist';
import OrderedProductStockist from './OrderedProductStockist';

const ListOfOrderedProductPage = () => {

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const [value, setValue] = React.useState(0);

    const handleChange = useCallback((event, newValue) => {
        setValue(newValue);
    }, []);

    return (
        <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Chemist" {...a11yProps(0)} />
                    <Tab label="Stockist" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <OrderedProductChemist index={0} value={value}
            />
            <OrderedProductStockist index={1} value={value} />
        </>
    )
}

export default React.memo(ListOfOrderedProductPage);