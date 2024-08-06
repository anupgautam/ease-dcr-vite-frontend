import React, { useCallback, useMemo } from 'react'
import {
    Stack,
    Container,
    Grid,
    Box,
    Button
} from '@mui/material';

import CompanyAreasCount from './CompanyAreasCount';
import AddCompanyAreas from './AddCompanyAreas';
import DefaultList from './DefaultList'
import Cookies from 'js-cookie';
import { CSVLink } from "react-csv";
import { useGetAllCompanyAreasWithoutPaginationQuery } from '@/api/CompanySlices/companyAreaSlice';
import Iconify from '@/components/iconify/Iconify';
import ExportToExcel from '@/reusable/utils/exportSheet';


const ListOfCompanyAreas = () => {
    const { data } = useGetAllCompanyAreasWithoutPaginationQuery(Cookies.get('company_id'))

    const headers = [
        { label: 'S.No.', key: 'sno' },
        { label: 'Company Area', key: 'company_area' },
        { label: 'Station Type', key: "station_type" },
    ];

    const templateData = data?.map((values, index) => ({
        sno: index + 1,
        company_area: values?.company_area,
        station_type: values?.station_type
    }))
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={9}>
                            <CompanyAreasCount />
                        </Grid>
                        <Grid item xs={2}>
                            <Box style={{ float: 'right' }}>
                                {data ?
                                    <>
                                        <ExportToExcel headers={headers} fileName={`Company Area`} data={templateData} />
                                    </> : <></>}
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            <Box style={{ float: "right" }}>
                                <AddCompanyAreas />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <DefaultList />
            </Container>
        </>
    )
}

export default React.memo(ListOfCompanyAreas)