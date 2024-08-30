import React from 'react';
import {
    Card,
    Container,
    Grid,
    Typography,
    Skeleton
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useGetDoctorAllDCRByIdQuery, useGetDoctorDcrByIdQuery } from '../../../api/DCRs Api Slice/doctorDCR/DoctorDCRAllSlice';
import { useSelector } from 'react-redux';

import { useGetAllCompanyProductsWithoutPaginationByIdQuery } from '../../../api/productSlices/companyProductSlice';
import { useGetcompanyUserRolesByIdQuery } from '../../../api/CompanySlices/companyUserRoleSlice';
import { useGetRewardsByIdQuery } from '../../../api/MPOSlices/rewardsApiSlice';

import { useGetRewardsByDcrIdQuery } from '../../../api/DCRs Api Slice/rewardsAPISlice';
import { useGetVisitedWithByDcrIdQuery } from '../../../api/MPOSlices/companyRolesSlice';
;

const DCRDetail = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const selectedUser = searchParams.get('id');

    const { data, isLoading } = useGetDoctorDcrByIdQuery(selectedUser);
    console.log(data)
    return (
        <Container>
            <>
                {isLoading ? (
                    <Card sx={{ padding: 2, marginTop: 3 }}>
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
                    </Card>
                ) : (
                    <>
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {`${data?.mpo_name?.user_name?.first_name} ${data?.mpo_name?.user_name?.last_name}`}
                        </Typography>
                        <Grid container spacing={2} style={{ marginTop: "15px" }}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card variant="outlined" sx={{ padding: 2 }}>
                                    <Typography variant="h6" style={{ marginBottom: '10px' }}>Dcr Detail</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Shift: {data?.dcr?.shift?.shift}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        Date: {data?.dcr?.dcr?.date}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Visited Area: {data?.dcr?.dcr?.visited_area?.area_name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Visited Doctor: {data?.dcr?.dcr?.visited_doctor?.doctor_name?.doctor_name}
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card variant="outlined" sx={{ padding: 2 }}>
                                    <Typography variant="h6" style={{ marginBottom: '10px' }}>Expenses Detail</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Expense: {data?.dcr?.dcr?.expenses}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Expense Name: {data?.dcr?.dcr?.expenses_name}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Expense Reasoning: {data?.dcr?.dcr?.expenses_reasoning}
                                    </Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card variant="outlined" sx={{ padding: 2 }}>
                                    <Typography variant="h6" style={{ marginBottom: "10px" }}>Promoted Product</Typography>
                                    <PromotedProduct id={data?.dcr?.dcr?.id} />
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card variant="outlined" sx={{ padding: 2 }}>
                                    <Typography variant="h6">Visited With</Typography>
                                    <VisitedWith id={data?.dcr?.dcr?.id} />
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card variant="outlined" sx={{ padding: 2 }}>
                                    <Typography variant="h6" style={{ marginBottom: "10px" }}>Rewards</Typography>
                                    <RewardsRole id={data?.dcr?.dcr?.id} />
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}
            </>
        </Container>
    );
};

const PromotedProduct = ({ id }) => {
    const { data } = useGetDoctorAllDCRByIdQuery(id)
    return (
        <>
            {
                data !== undefined ?
                    <>
                        {
                            data.map((key, index) => (
                                <PromotedProductById id={key.company_product_id} key={index} />
                            ))
                        }
                    </> : null
            }
        </>
    )
}

const PromotedProductById = ({ id }) => {
    const { data } = useGetAllCompanyProductsWithoutPaginationByIdQuery(id);
    return (
        <>
            <Typography variant="body2" color="textSecondary">
                Product: {data?.product_name?.product_name}
            </Typography>
        </>
    )
}

const RewardsRole = ({ id }) => {
    const { data } = useGetRewardsByDcrIdQuery(id);
    return (
        <>
            {
                data !== undefined ?
                    <>
                        {
                            data.map((key, index) => (
                                <RewardsRoleById id={key.reward_id} key={index} />
                            ))
                        }
                    </> : null
            }
        </>
    )
}

const RewardsRoleById = ({ id }) => {
    const { data } = useGetRewardsByIdQuery(id);
    return (
        <>
            <Typography variant="body2" color="textSecondary">
                Gift: {data?.reward}
            </Typography>
        </>
    )
}

const VisitedWith = ({ id }) => {
    const { data } = useGetVisitedWithByDcrIdQuery(id);
    return (
        <>
            {
                data !== undefined ?
                    <>
                        {
                            data.map((key, index) => (
                                <VisitedWithById id={key.roles_id} key={index} />
                            ))
                        }
                    </> : null
            }
        </>
    )
}

const VisitedWithById = ({ id }) => {
    const { data } = useGetcompanyUserRolesByIdQuery(id);
    return (
        <>
            <Typography variant="body2" color="textSecondary">
                Visited: {data.user_name.first_name + ' ' + data.user_name.middle_name + " " +
                    data.user_name.last_name}
            </Typography>
        </>
    )
}
//dcr for doctor there is no promoted product

export default React.memo(DCRDetail);
