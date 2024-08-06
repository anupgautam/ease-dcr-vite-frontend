import React from 'react'
import {
    Container,
    Grid,
    Box
} from '@mui/material';

import DivisionCount from './DivisionCount';
import AddDivision from './AddDivision';
import DefaultList from './DefaultList'
import { useGetAllCompanyDivisionsQuery } from '@/api/DivisionSilces/companyDivisionSlice';

import Cookies from 'js-cookie'
import ExportToExcel from '@/reusable/utils/exportSheet';

const ListOfDivision = () => {
    const { data } = useGetAllCompanyDivisionsQuery(Cookies.get('company_id'))

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
                    <Grid container>
                        <Grid item xs={9}>
                            <DivisionCount />
                        </Grid>
                        <Grid item xs={2}>
                            <Box style={{ float: 'right' }}>
                                {data ?
                                    <>
                                        <ExportToExcel headers={headers} fileName={`Company Division`} data={templateData} />
                                    </> : <></>}
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            <Box style={{ float: 'right' }}>
                                <AddDivision />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <DefaultList />
            </Container>
        </>
    )
}

export default React.memo(ListOfDivision)