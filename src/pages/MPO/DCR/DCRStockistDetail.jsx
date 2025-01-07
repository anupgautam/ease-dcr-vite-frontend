import React from 'react';
import {
    Card,
    Container,
    Grid,
    Typography,
    Skeleton
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useGetStockistDcrByIdQuery } from '../../../api/DCRs Api Slice/stockistDCR/stockistDCRAllSlice';
import { useSelector } from 'react-redux';
import { useGetAllCompanyProductsWithoutPaginationByIdQuery } from '../../../api/productSlices/companyProductSlice';
import { useGetcompanyUserRolesByIdQuery } from '../../../api/CompanySlices/companyUserRoleSlice';
import { useGetRewardsByIdQuery } from '../../../api/MPOSlices/rewardsApiSlice';

import { useGetRewardsForStockistByDcrIdQuery } from '../../../api/DCRs Api Slice/rewardsAPISlice';
import { useGetStockistVisitedWithByDcrIdQuery } from '../../../api/MPOSlices/companyRolesSlice';
import { useGetUsersByCompanyUserByIdQuery } from '../../../api/MPOSlices/UserSlice';

const DCRStockistDetail = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const selectedUser = searchParams.get('id');

    const { data, isLoading } = useGetStockistDcrByIdQuery(selectedUser, {
        skip: !selectedUser
    });

    console.log("DCRStockist", data)
    
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
                                    Shift: {data?.shift?.shift}
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Date: {data?.dcr?.date}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Visited Area: {data?.visited_area?.company_area}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Visited Stockist: {data?.dcr?.visited_stockist?.stockist_name?.stockist_name}
                                </Typography>
                            </div>

                            <div className=" rounded-[1rem] px-4 hover:scale-105 hover:z-50 duration-500 py-3 drop-shadow-lg bg-white/80 backdrop-blur-lg ">
                                <Typography variant="h6" style={{ marginBottom: '10px' }}>Expenses Detail</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Expense: {data?.dcr?.expenses}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Expense Name: {data?.dcr?.expenses_name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Expense Reasoning: {data?.dcr?.expenses_reasoning}
                                </Typography>
                            </div>

                            <div className=" rounded-[1rem] px-4 hover:scale-105 hover:z-50 duration-500 py-3 drop-shadow-lg bg-white/80 backdrop-blur-lg ">
                                <Typography variant="h6">Visited With</Typography>
                                {/* <VisitedWith id={data?.dcr?.id} /> */}
                                {data?.visited_with?.map((index, visited) => (
                                    <Typography variant="body2" color="textSecondary" key={index}>
                                        Visited With:{visited?.visited_with}
                                    </Typography>
                                ))
                                }
                            </div>

                            <div className="col-span-2 rounded-[1rem] px-4 hover:scale-105 hover:z-50 duration-500 py-3 drop-shadow-lg min-h-[23rem] bg-white/80 backdrop-blur-lg ">
                                <Typography variant="h6" style={{ marginBottom: "10px" }}>Promoted Product</Typography>
                                {/* <PromotedProduct id={data?.dcr?.id} /> */}

                                {data?.ordered_products?.map((product, index) => (
                                    <Typography variant="body2" color="textSecondary" key={index}>
                                        Product Name:{product?.product_id?.product_name?.product_name}
                                    </Typography>
                                ))
                                }
                            </div>


                            <div className=" rounded-[1rem] px-4 hover:scale-105 hover:z-50 duration-500 py-3 drop-shadow-lg  bg-white/80 backdrop-blur-lg">
                                <Typography variant="h6" style={{ marginBottom: "10px" }}>Rewards</Typography>
                                {/* <RewardsRole id={data?.dcr?.id} /> */}
                                {data?.rewards?.map((reward, index) => (
                                    <Typography variant="body2" color="textSecondary" key={index}>
                                        Rewards:{reward?.rewards}
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

// const PromotedProduct = ({ id }) => {
//     const { data } = useGetStockistDcrByIdQuery(id)
//     console.log("Promoted Product", data)
//     return (
//         <>
//             {
//                 data !== undefined ?
//                     <>
//                         {
//                             data?.map((key, index) => (
//                                 <PromotedProductById id={key?.company_product_id} key={index} />
//                             ))
//                         }
//                     </> : null
//             }
//         </>
//     )
// }

// const PromotedProductById = ({ id }) => {
//     const { data } = useGetAllCompanyProductsWithoutPaginationByIdQuery(id);
//     return (
//         <>
//             <Typography variant="body2" color="textSecondary">
//                 Product: {data?.product_name?.product_name}
//             </Typography>
//         </>
//     )
// }

// const RewardsRole = ({ id }) => {
//     // console.log("Reward Id", id)
//     const { data } = useGetRewardsForStockistByDcrIdQuery(id);
//     // console.log("Rewards", data)
//     return (
//         <>
//             {
//                 data !== undefined ?
//                     <>
//                         {
//                             data?.map((key, index) => (
//                                 <RewardsRoleById id={key?.reward_id} key={index} />
//                             ))
//                         }
//                     </> : null
//             }
//         </>
//     )
// }

// const RewardsRoleById = ({ id }) => {
//     const { data } = useGetRewardsByIdQuery(id, {
//         skip: !id
//     });
//     console.log(data)
//     return (
//         <>
//             <Typography variant="body2" color="textSecondary">
//                 Gift: {data?.reward}
//             </Typography>
//         </>
//     )
// }

// const VisitedWith = ({ id }) => {
//     const { data } = useGetStockistVisitedWithByDcrIdQuery(id);
//     return (
//         <>
//             {
//                 data !== undefined ?
//                     <>
//                         {
//                             data?.map((key, index) => (
//                                 <VisitedWithById id={key.roles_id} key={index} />
//                             ))
//                         }
//                     </> : null
//             }
//         </>
//     )
// }

// const VisitedWithById = ({ id }) => {
//     const { data } = useGetUsersByCompanyUserByIdQuery(id);
//     return (
//         <>
//             <Typography variant="body2" color="textSecondary">
//                 Visited: {data?.user_name?.first_name + ' ' + data?.user_name?.middle_name + " " +
//                     data?.user_name?.last_name}
//             </Typography>
//         </>
//     )
// }
export default React.memo(DCRStockistDetail);
