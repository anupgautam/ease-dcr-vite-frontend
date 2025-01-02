import React from 'react';
import {
    Card,
    Container,
    Grid,
    Typography,
    Skeleton
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useGetChemistDcrByIdQuery } from '../../../api/DCRs Api Slice/chemistDCR/ChemistDCRAllSlice';
;

const DCRChemistDetail = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const selectedUser = searchParams.get('id');

    const { data, isLoading } = useGetChemistDcrByIdQuery(selectedUser);
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


                        <div className=" grid grid-cols-3 gap-2.5 ">
                            <div className=" rounded-[1.1rem] px-4 hover:scale-105 hover:z-50 duration-500 py-3 drop-shadow-lg bg-white/80 backdrop-lg">
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
                                    Visited Chemist: {data?.dcr?.dcr?.visited_chemist?.chemist_name?.chemist_name}
                                </Typography>
                            </div>

                            <div className=" rounded-[1rem] px-4 hover:scale-105 hover:z-50 duration-500 py-3 drop-shadow-lg bg-white/80 backdrop-blur-lg ">
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
                            </div>
                            <div className=" rounded-[1rem] px-4 hover:scale-105 hover:z-50 duration-500 py-3 drop-shadow-lg bg-white/80 backdrop-blur-lg ">
                                <Typography variant="h6">Visited With</Typography>
                                {
                                    data?.visited_with.map((key, index) => (
                                        <Typography variant="body2" color="textSecondary" key={index}>
                                            Visited with :{" "}
                                            {key?.user_name?.first_name +
                                                " " +
                                                key?.user_name?.middle_name +
                                                " " +
                                                key?.user_name?.last_name}
                                        </Typography>
                                    ))
                                }
                            </div>

                            <div className="col-span-2 rounded-[1rem] px-4 hover:scale-105 hover:z-50 duration-500 py-3 drop-shadow-lg min-h-[23rem] bg-white/80 backdrop-blur-lg ">
                                <Typography variant="h6" style={{ marginBottom: "10px" }}>
                                    Promoted Product
                                </Typography>
                                {
                                    data?.promoted_product.map((key, index) => (
                                        <Typography variant="body2" color="textSecondary">
                                            Product: {key?.product_name?.product_name}
                                        </Typography>
                                    ))
                                }
                            </div>

                            <div className=" rounded-[1rem] px-4 hover:scale-105 hover:z-50 duration-500 py-3 drop-shadow-lg  bg-white/80 backdrop-blur-lg">
                                <Typography variant="h6" style={{ marginBottom: "10px" }}>
                                    Rewards
                                </Typography>
                                {
                                    data?.rewards.map((key, index) => (
                                        <Typography variant="body2" color="textSecondary">
                                            Gift: {key?.reward}
                                        </Typography>
                                    ))
                                }
                            </div>
                        </div>
                    </>
                )}
            </>
        </Container>
    );
};

export default React.memo(DCRChemistDetail);
