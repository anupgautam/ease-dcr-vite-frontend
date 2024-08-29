import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Card, Grid, Container, Typography, TableCell, Table, TableContainer, TableRow, TableBody } from '@mui/material';
import { AppTrafficBySite, AppWidgetSummary } from '../../../sections/@dashboard/app';
import { useGetAllStatsMutation } from '../../../api/MPOSlices/StatApiSlice';
import Scrollbar from '@/components/iconify/Iconify';
import { DashboardListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from 'react-redux';


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

export default function DashboardAppPage() {
  const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

  const companyName = company_id;
  const tenArrays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  //! Get all stat
  const [totalStats, setTotalStats] = useState([]);
  const [Stats] = useGetAllStatsMutation();
  const [mostOrderedChem, setMostOrderedChem] = useState([]);
  const [mostOrderedStoc, setMostOrderedStoc] = useState([]);
  const [mostPromotedChem, setMostPromotedChem] = useState([]);
  const [mostPromotedDoc, setMostPromotedDoc] = useState([]);

  useEffect(() => {
    if (companyName) {
      Stats({ company_name: companyName }).then((res) => {
        if (res) {
          const mostOrderedChems = res?.data?.most_ordered_product?.chemist_ordered_product?.map((key, index) => ({
            id: `chemist-${key.product_name}-${index}`, // Ensure unique ID
            name: key.product_name,
            value: key.ordered_quantity,
          }));
          setMostOrderedChem(mostOrderedChems);

          const mostOrderedStock = res?.data?.most_ordered_product?.stockist_ordered_product?.map((key, index) => ({
            id: `stockist-${key.ordered_product.product_name.product_name}-${index}`,  // Ensure unique ID
            name: key.ordered_product.product_name.product_name,
            value: key.ordered_quantity,
          }));
          setMostOrderedStoc(mostOrderedStock);

          const mostPromotedChems = res?.data?.most_promoted_product?.chemist?.map((key, index) => ({
            id: `promoted-chemist-${key.product_name.product_name}-${index}`, // Ensure unique ID
            name: key.product_name.product_name,
            value: null,
          }));
          setMostPromotedChem(mostPromotedChems);

          const mostPromotedDocs = res?.data?.most_promoted_product?.doctor?.map((key, index) => ({
            id: `promoted-doctor-${key.product_name.product_name}-${index}`, // Ensure unique ID
            name: key.product_name.product_name,
            value: null,
          }));
          setMostPromotedDoc(mostPromotedDocs);
        }
        setTotalStats(res);
      });
    }
  }, [companyName]);

  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard | Ease SFA </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        {/*//! Total Stats  */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/admin/listofproduct" style={{ textDecoration: 'none', width: "100%" }}>
              <AppWidgetSummary title="Total Products" total={totalStats?.data?.total_number?.total_product} img='/assets/images/icons/pharmacy.png' />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/admin/listofchemist" style={{ textDecoration: 'none', width: "100%" }}>
              <AppWidgetSummary title="Total Chemists" total={totalStats?.data?.total_number?.total_chemist} color="info" img='/assets/images/icons/pharmacist.png' />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/admin/listofdoctor" style={{ textDecoration: 'none', width: "100%" }}>
              <AppWidgetSummary title="Total Doctors" total={totalStats?.data?.total_number?.total_doctor} color="warning" img='/assets/images/icons/doctor.png' />
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Link to="/dashboard/admin/listofstockist" style={{ textDecoration: 'none', width: "100%" }}>
              <AppWidgetSummary title="Total Stockists" total={totalStats?.data?.total_number?.total_stockist} color="error" img='/assets/images/icons/stockist.png' />
            </Link>
          </Grid>

          {/* //! Most Ordered Products */}
          <Grid item xs={12} md={10} lg={6}>
            <AppTrafficBySite
              title="Most Ordered Product"
              subheader="Chemist"
              list={mostOrderedChem}
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
                        tenArrays.map((key) => (
                          <TableRow key={key}>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                            <TableCell><Skeleton /></TableCell>
                          </TableRow>
                        ))
                      ) : (
                        totalStats?.data?.company?.chemist?.map((mostVisited, index) => (
                          <TableRow tabIndex={-1} role="checkbox" key={mostVisited.id || `chemist-${index}`}>
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
                          <TableRow tabIndex={-1} role="checkbox" key={mostVisited.id || `doctor-${index}`}>
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
                          <TableRow tabIndex={-1} role="checkbox" key={mostVisited.id || `stockist-${index}`}>
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
        </Grid>
      </Container>
    </>
  );
}
