import React from 'react'
import DefaultSpecialization from './DefaultSpecialization';
import {
    Container,
    Grid, Box
} from '@mui/material';
import {
    useGetDoctorsSpecializationQuery,
} from '../../../../api/MPOSlices/DoctorSlice'
import AddDoctorSpecialization from './AddDoctorSpecialization';
import SpecializationCount from './SpecializationCount';

import Cookies from 'js-cookie'
import ExportToExcel from '@/reusable/utils/exportSheet';


const ListOfDoctorSpecialization = () => {
    const { data } = useGetDoctorsSpecializationQuery(Cookies.get('company_id'))
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
                    <Grid container>
                        <Grid item xs={9}>
                            <SpecializationCount />
                        </Grid>
                        <Grid item xs={2}>
                            <Box style={{ float: 'right' }}>
                                {data ?
                                    <>
                                        <ExportToExcel headers={headers} fileName={`Doctor Specialization`} data={templateData} />
                                    </> : <></>}
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            <Box style={{ float: 'right' }}>
                                <AddDoctorSpecialization />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <DefaultSpecialization />
            </Container>
        </>
    )
}

export default React.memo(ListOfDoctorSpecialization)