import React, { useContext } from 'react'
import DefaultSpecialization from './DefaultSpecialization';
import {
    Container,
    Grid, Box, Stack,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    useGetDoctorsSpecializationQuery,
} from '../../../../api/MPOSlices/DoctorSlice'
import AddDoctorSpecialization from './AddDoctorSpecialization';
import SpecializationCount from './SpecializationCount';
import { CookieContext } from '@/App'

import ExportToExcel from '@/reusable/utils/exportSheet';


const ListOfDoctorSpecialization = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const { data } = useGetDoctorsSpecializationQuery(company_id)
    const headers = [
        { label: 'S.No.', key: 'sno' },
        { label: 'Specialization', key: 'category_name' },
    ];

    const templateData = data?.map((values, index) => ({
        sno: index + 1,
        category_name: values?.category_name,
    }))

    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Box style={{ marginTop: '10px' }}>
                                <SpecializationCount />
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
                                        <ExportToExcel headers={headers} fileName={`Doctor Specialization`} data={templateData} />
                                    </> : <></>}
                                <AddDoctorSpecialization />
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <DefaultSpecialization />
            </Container>
        </>
    )
}

export default React.memo(ListOfDoctorSpecialization)