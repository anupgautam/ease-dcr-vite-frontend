import React from 'react'
import {
    Container,
    Grid, Box
} from '@mui/material';

import CompanyAreaWiseExpenseCount from './CompanyAreaWiseExpenseCount';
import AddCompanyWiseAreaExpense from './AddCompanyAreaWiseExpense';
import FilteredCompanyAreaWiseExpense from './FilteredCompanyAreaWiseExpense';

const ListOfCompanyAreaWiseExpense = () => {
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={9}>
                            <CompanyAreaWiseExpenseCount />
                        </Grid>
                        <Grid item xs={3}>
                            <Box style={{ float: "right" }}>
                                <AddCompanyWiseAreaExpense />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <FilteredCompanyAreaWiseExpense />
            </Container>
        </>
    )
}

export default React.memo(ListOfCompanyAreaWiseExpense);