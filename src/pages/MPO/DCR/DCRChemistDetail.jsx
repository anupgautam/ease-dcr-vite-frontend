import React, { useContext } from 'react';
import {
    Card,
    Container,
    Grid,
    Typography,
    Skeleton
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useGetChemistAllDCRByIdQuery } from '../../../api/DCRs Api Slice/chemistDCR/ChemistDCRAllSlice';
import { CookieContext } from '@/App';

const DCRChemistDetail = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const selectedUser = searchParams.get('id');

    const { data, isLoading } = useGetChemistAllDCRByIdQuery(selectedUser);
    console.log(data)
    return (
        <Container>
            <Card sx={{ padding: 2, marginTop: 3 }}>
                {isLoading ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Skeleton variant="text" width="80%" height={40} />
                        </Grid>
                        <Grid item xs={12}>
                            <Skeleton variant="text" width="60%" />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Skeleton variant="rectangular" width="100%" height={150} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Skeleton variant="rectangular" width="100%" height={150} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Skeleton variant="rectangular" width="100%" height={150} />
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                {`${data?.mpo_name?.user_name?.first_name} ${data?.mpo_name?.user_name?.last_name}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" color="textSecondary">
                                Shift: {data?.dcr?.shift?.shift}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Date: {data?.dcr?.dcr?.date}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Visited Area: {data?.dcr?.dcr?.visited_area?.area_name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Visited Doctor: {data?.dcr?.dcr?.visited_doctor?.doctor_name?.doctor_name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Expense: {data?.dcr?.dcr?.expenses}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Expense Name: {data?.dcr?.dcr?.expenses_name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                Expense Reasoning: {data?.dcr?.dcr?.expenses_reasoning}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card variant="outlined" sx={{ padding: 2 }}>
                                <Typography variant="h6">How do I get started?</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, et?
                                    Obcaecati, nemo sit. Delectus, totam obcaecati aliquid omnis cumque ex.
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card variant="outlined" sx={{ padding: 2 }}>
                                <Typography variant="h6">How do I get started?</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, et?
                                    Obcaecati, nemo sit. Delectus, totam obcaecati aliquid omnis cumque ex.
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card variant="outlined" sx={{ padding: 2 }}>
                                <Typography variant="h6">How do I get started?</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. In, et?
                                    Obcaecati, nemo sit. Delectus, totam obcaecati aliquid omnis cumque ex.
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Card>
        </Container>
    );
};

export default React.memo(DCRChemistDetail);
