import React, { useContext } from 'react'
import {
    Container,
    Grid,
    Box,
    Stack,
    useMediaQuery,
    useTheme
} from '@mui/material';

import DivisionCount from './DivisionCount';
import AddDivision from './AddDivision';
import DefaultList from './DefaultList'
import { useGetAllCompanyDivisionsQuery } from '@/api/DivisionSilces/companyDivisionSlice';
import { CookieContext } from '@/App'

import ExportToExcel from '@/reusable/utils/exportSheet';

const ListOfDivision = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { data } = useGetAllCompanyDivisionsQuery(company_id)

    const headers = [
        { label: 'S.No.', key: 'sno' },
        { label: 'Divisions', key: 'division_name' },
    ];

    const templateData = data?.map((values, index) => ({
        sno: index + 1,
        division_name: values?.division_name,
    }))

    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Box style={{ marginTop: '10px' }}>
                                <DivisionCount />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack
                                direction={isSmallScreen ? 'column' : 'row'}
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-end"
                            >
                                {data ?
                                    <>
                                        <ExportToExcel headers={headers} fileName={`Company Division`} data={templateData} />
                                    </> : <></>}
                                <AddDivision />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <DefaultList />
            </Container>
        </>
    )
}

export default React.memo(ListOfDivision)