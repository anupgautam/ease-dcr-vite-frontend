import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Container, Typography, TableCell, Table, TableContainer, TableRow, TableBody } from '@mui/material';
import { useGetAllStatsQuery } from '../../../api/MPOSlices/StatApiSlice';
import Scrollbar from '@/components/iconify/Iconify';
import { DashboardListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from 'react-redux';
import Iconify from '@/components/iconify/Iconify';
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../../../sections/@dashboard/app';
import { styled } from '@mui/material/styles';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { BSDate } from 'nepali-datepicker-react';


const TABLE_HEAD_CHEMIST = [
  { id: 'chemist_name', label: 'Chemist Name', alignRight: false },
  { id: 'chemist_address', label: 'Chemist Address', alignRight: false },
  { id: 'chemist_phone_number', label: 'Phone Number', alignRight: false },
  { id: '' },
];

const TABLE_HEAD_DOCTOR = [
  { id: 'doctor_name', label: 'Doctor Name', alignRight: false },
  { id: 'doctor_address', label: 'Doctor Address', alignRight: false },
  { id: 'doctor_phone_number', label: 'Phone Number', alignRight: false },
  { id: '' },
];

const TABLE_HEAD_STOCKIST = [
  { id: 'stockist_name', label: 'Stockist Name', alignRight: false },
  { id: 'stockist_address', label: 'Stockist Address', alignRight: false },
  { id: 'stockist_contact_number', label: 'Phone Number', alignRight: false },
  { id: '' },
];

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function DashboardAppPage() {
  const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);


  const companyName = company_id;
  const tenArrays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  //! Get Month and Year
  const now = new BSDate().now();

  const monthData = getNepaliMonthName(now._date.month);
  const yearData = now._date.year;

  //! Get all stat
  const [totalStats, setTotalStats] = useState([]);
  const { data } = useGetAllStatsQuery({ company_id: company_id, year: yearData, month: monthData })
  console.log(data)
  const [mostOrderedChem, setMostOrderedChem] = useState([]);
  const [mostOrderedStoc, setMostOrderedStoc] = useState([]);
  const [mostPromotedChem, setMostPromotedChem] = useState([]);
  const [mostPromotedDoc, setMostPromotedDoc] = useState([]);

  // useEffect(() => {
  //   if (companyName) {
  //     Stats({ company_name: companyName }).then((res) => {
  //       if (res) {
  //         const mostOrderedChems = res?.data?.most_ordered_product?.chemist_ordered_product?.map((key, index) => ({
  //           id: `${key.product_name}-${index}`,
  //           name: key.product_name,
  //           value: key.ordered_quantity,
  //         }));
  //         setMostOrderedChem(mostOrderedChems);

  //         const mostOrderedStock = res?.data?.most_ordered_product?.stockist_ordered_product?.map((key, index) => ({
  //           id: `${key.ordered_product.product_name.product_name}-${index}`,
  //           name: key.ordered_product.product_name.product_name,
  //           value: key.ordered_quantity,
  //         }));

  //         setMostOrderedStoc(mostOrderedStock);

  //         const mostPromotedChems = res?.data?.most_promoted_product?.chemist?.map((key, index) => ({
  //           id: `${key.product_name.product_name}-${index}`,
  //           name: key.product_name.product_name,
  //           value: null,
  //         }));
  //         setMostPromotedChem(mostPromotedChems);

  //         const mostPromotedDocs = res?.data?.most_promoted_product?.doctor?.map((key, index) => ({
  //           id: `${key.product_name.product_name}-${index}`,
  //           name: key.product_name.product_name,
  //           value: null,
  //         }));
  //         setMostPromotedDoc(mostPromotedDocs);
  //       }
  //       setTotalStats(res);
  //     });
  //   }
  // }, [companyName]);

  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard | Ease SFA </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200" width="100" height="200">
            {/* Tooth Crown (Simplified) */}
            <path
              d="M50,10 Q60,30 70,50 Q80,80 60,90 Q50,80 40,60 Q30,40 50,10"
              fill="white"
              stroke="black"
              strokeWidth="2"
            />

            {/* Roots */}
            <path
              d="M40,60 Q30,120 50,140"
              fill="none"
              stroke="brown"
              strokeWidth="6"
            />
            <path
              d="M60,60 Q70,120 50,140"
              fill="none"
              stroke="brown"
              strokeWidth="6"
            />

            {/* Tooth Neck */}
            <rect
              x="45"
              y="60"
              width="10"
              height="10"
              fill="lightgray"
              stroke="black"
              strokeWidth="2"
            />
          </svg>
        </Typography>

        {/*//! Total Stats  */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/admin/listofproduct" style={{ textDecoration: 'none', width: "100%" }}>
              <AppWidgetSummary title="Total Products" total={data?.total_product} img='/assets/images/icons/pharmacy.png' />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/admin/listofchemist" style={{ textDecoration: 'none', width: "100%" }}>
              <AppWidgetSummary title="Total Chemists" total={data?.total_chemist} color="info" img='/assets/images/icons/pharmacist.png' />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/admin/listofdoctor" style={{ textDecoration: 'none', width: "100%" }}>
              <AppWidgetSummary title="Total Doctors" total={data?.total_doctor} color="warning" img='/assets/images/icons/doctor.png' />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/admin/listofstockist" style={{ textDecoration: 'none', width: "100%" }}>
              <AppWidgetSummary title="Total Stockists" total={data?.total_stockist} color="error" img='/assets/images/icons/stockist.png' />
            </Link>
          </Grid>

          {/* //! Most Ordered Products */}
          <Grid item xs={12} md={10} lg={6}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                // {
                //   name: 'Team A',
                //   type: 'column',
                //   fill: 'solid',
                //   data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                // },
                {
                  name: 'Chemist',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Stockist',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={10} lg={6}>
            <AppTrafficBySite
              title="Most Ordered Product"
              subheader="Stockist"
              list={mostOrderedStoc}
            />
          </Grid>

          {/* //! Most Promoted Products */}
          <Grid item xs={12} md={10} lg={6}>
            <AppTrafficBySite
              title="Most Promoted Product"
              subheader="Chemist"
              list={mostPromotedChem}
            />
          </Grid>
          <Grid item xs={12} md={10} lg={6}>
            <AppTrafficBySite
              title="Most Promoted Product"
              subheader="Doctor"
              list={mostPromotedDoc}
            />
          </Grid>

          {/* //! Most visited chemist  */}
          <Grid item xs={12} md={22} lg={14}>
            <Card>
              <Scrollbar>
                <Grid item xs={10}>
                  <Typography style={{ fontSize: '22px', fontWeight: '600', paddingTop: '10px', paddingLeft: '20px' }}>
                    Most Visited Chemist
                  </Typography>
                </Grid>
                <TableContainer sx={{ paddingTop: '20px', paddingBottom: '20px' }}>
                  <Table>
                    <DashboardListHead
                      headLabel={TABLE_HEAD_CHEMIST}
                    />
                    <TableBody>
                      {totalStats === undefined ? (
                        tenArrays.map((key, index) => (
                          <TableRow key={index}>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        totalStats?.data?.company?.chemist?.map((mostVisited, index) => (
                          <TableRow tabIndex={-1} role="checkbox" key={`${index}`}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell component="th" scope="row" align="left">
                              <Typography variant="subtitle2" noWrap>
                                {mostVisited.chemist_name.chemist_name}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">{mostVisited.chemist_name.chemist_address}</TableCell>
                            <TableCell align="left">{mostVisited.chemist_name.chemist_phone_number}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Grid>

          {/* //! Most visited Doctor  */}
          <Grid item xs={12} md={22} lg={14}>
            <Card>
              <Scrollbar>
                <Grid item xs={10}>
                  <Typography style={{ fontSize: '22px', fontWeight: '600', paddingTop: '10px', paddingLeft: '20px' }}>
                    Most Visited Doctor
                  </Typography>
                </Grid>
                <TableContainer sx={{ minWidth: 600, paddingTop: '20px', paddingBottom: '20px' }}>
                  <Table>
                    <DashboardListHead
                      headLabel={TABLE_HEAD_DOCTOR}
                    />
                    <TableBody>
                      {totalStats === undefined ? (
                        tenArrays.map((key) => (
                          <TableRow key={key}>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        totalStats?.data?.company?.doctor?.map((mostVisited, index) => (
                          <TableRow tabIndex={-1} role="checkbox" key={`${index}`}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell component="th" scope="row" align="left">
                              <Typography variant="subtitle2" noWrap>
                                {mostVisited.doctor_name.doctor_name}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">{mostVisited.doctor_name.doctor_address}</TableCell>
                            <TableCell align="left">{mostVisited.doctor_name.doctor_phone_number}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Grid>

          {/* //! Most visited Stockist  */}
          <Grid item xs={12} md={22} lg={14}>
            <Card>
              <Scrollbar>
                <Grid item xs={10}>
                  <Typography style={{ fontSize: '22px', fontWeight: '600', paddingTop: '10px', paddingLeft: '20px' }}>
                    Most Visited Stockist
                  </Typography>
                </Grid>
                <TableContainer sx={{ minWidth: 600, paddingTop: '20px', paddingBottom: '20px' }}>
                  <Table>
                    <DashboardListHead
                      headLabel={TABLE_HEAD_STOCKIST}
                    />
                    <TableBody>
                      {totalStats === undefined ? (
                        tenArrays.map((key) => (
                          <TableRow key={key}>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        totalStats?.data?.company?.stockist?.map((mostVisited, index) => (
                          <TableRow tabIndex={-1} role="checkbox" key={`${index}`}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell component="th" scope="row" align="left">
                              <Typography variant="subtitle2" noWrap>
                                {mostVisited.stockist_name.stockist_name}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">{mostVisited.stockist_name.stockist_address}</TableCell>
                            <TableCell align="left">{mostVisited.stockist_name.stockist_contact_number}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          </Grid>

          {/* //! Apex Charts  */}

          {/* //! Line Chart */}
          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ]}
              chartData={[
                // {
                //   name: 'Team A',
                //   type: 'column',
                //   fill: 'solid',
                //   data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                // },
                {
                  name: 'Chemist',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Stockist',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid>

          {/*//! Pie Chart  */}
          <Grid item xs={12} md={6} lg={4}>
            {data &&
              <AppCurrentVisits
                title="Calls"
                chartData={[
                  { label: 'Chemist Call', value: data?.pie_chart?.chemist_call },
                  { label: 'Doctor Call', value: data?.pie_chart?.doctor_call },
                  // { label: 'Europe', value: 1443 },
                  { label: 'Stockist Call', value: data?.pie_chart?.stockist_call },
                ]}
                chartColors={[
                  theme.palette.success.main,
                  // theme.palette.info.main,
                  // theme.palette.warning.main,
                  theme.palette.error.main,
                  theme.palette.secondary.default
                ]}
              />
            }
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chartData={[
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject
              title="Current Subject"
              chartLabels={['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math']}
              chartData={[
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ]}
              chartColors={[...Array(6)].map(() => theme.palette.text.secondary)}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            {/* <AppNewsUpdate
                        title="News Update"
                        list={[...Array(5)].map((_, index) => ({
                          id: faker.datatype.uuid(),
                          title: faker.name.jobTitle(),
                          description: faker.name.jobTitle(),
                          image: `/assets/images/covers/cover_${index + 1}.jpg`,
                          postedAt: faker.date.recent(),
                        }))}
                      /> */}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            {/* <AppOrderTimeline
                title="Order Timeline"
                list={[...Array(5)].map((_, index) => ({
                  id: faker.datatype.uuid(),
                  title: [
                    '1983, orders, $4220',
                    '12 Invoices have been paid',
                    'Order #37745 from September',
                    'New order placed #XF-2356',
                    'New order placed #XF-2346',
                  ][index],
                  type: `order${index + 1}`,
                  time: faker.date.past(),
                }))}
              /> */}
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
