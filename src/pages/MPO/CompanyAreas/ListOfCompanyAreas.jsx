import React from 'react'
import {
    Stack,
    Container,
    Grid,
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { useSelector } from 'react-redux';
import CompanyAreasCount from './CompanyAreasCount';
import AddCompanyAreas from './AddCompanyAreas';
import DefaultList from './DefaultList'
import { useGetAllCompanyAreasWithoutPaginationQuery } from '@/api/CompanySlices/companyAreaSlice';
import ExportToExcel from '@/reusable/utils/exportSheet';


const ListOfCompanyAreas = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { data } = useGetAllCompanyAreasWithoutPaginationQuery(company_id)

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
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Box style={{ marginTop: '10px' }}>
                                <CompanyAreasCount />
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
                                        <ExportToExcel headers={headers} fileName={`Company Area`} data={templateData} />
                                    </> : <></>}
                                <AddCompanyAreas />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <DefaultList />
            </Container>
        </>
    )
}

export default React.memo(ListOfCompanyAreas)