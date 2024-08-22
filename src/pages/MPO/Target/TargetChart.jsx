import React, { useState, useEffect, useMemo } from 'react'
import {
  MenuItem,
  Box,
  Grid,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useSelector } from 'react-redux';
import ApexChart from '@/reusable/components/charts/apexChart';
import { useGetTargetsByUserMutation } from '@/api/ExpensesSlices/targetSlices';
import { useGetCompanyRolesByCompanyQuery } from '@/api/CompanySlices/companyRolesSlice';
import { useGetAllCompanyUserRoleByRoleQuery } from '@/api/CompanySlices/companyUserRoleSlice';
import Cookies from 'js-cookie'

export default function TargetChart(props) {
  const { children, value, index, ...other } = props;
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedCompanyUser, setSelectedCompanyUser] = useState(null);
  const [companyUserList, setCompanyUserList] = useState([]);
  // const roles = useSelector(state => state?.dcrData?.company_roles);
  const yearList = ['2080', '2081', '2082', '2083', '2084', '2085', '2086', '2087', '2088', '2089', '2090'];
  const [chartData, setChartData] = useState(null);

  const companyUser = useGetAllCompanyUserRoleByRoleQuery(selectedRole);

  const { data: rolesData } = useGetCompanyRolesByCompanyQuery(Cookies.get('company_id'));

  const roles = useMemo(() => {
    if (rolesData !== undefined) {
      return rolesData?.map((key) => ({
        id: key.id,
        title: key.role_name.role_name
      }))
    }
    return [];
  }, [rolesData])

  useEffect(() => {
    if (companyUser?.data) {
      const userList = []
      companyUser?.data?.forEach((key) => {
        userList.push({ id: key.id, title: key?.user_name?.first_name + " " + key?.user_name?.last_name })
      })
      setCompanyUserList(userList);
    }
  }, [companyUser])


  const [targetUser] = useGetTargetsByUserMutation();

  useEffect(() => {
    if (selectedCompanyUser !== null && selectedYear == null) {
      targetUser({ 'id': selectedCompanyUser }).then((res) => {
        setChartData({
          options: {
            chart: {
              id: 'bar'
            },
            xaxis: {
              categories: res.data.year
            }
          },
          series: [
            {
              name: "Target Amount",
              data: res.data.target_amount
            },
            {
              name: "Sales",
              data: res.data.sales
            }
          ],
          type: "bar",
          width: "700",
          header: "Bar Graph Yearly"
        })
      })
    }
    else if (selectedCompanyUser !== null && selectedYear !== null) {
      targetUser({ 'id': selectedCompanyUser, 'year': selectedYear }).then((res) => {
        setChartData({
          options: {
            labels: ['Target Amount', 'Sales'],
            colors: ['#FF4560', '#008FFB'],
            series: [res.data.target_amount[0], res.data.sales[0]],
            legend: {
              position: 'bottom'
            }
          },
          series: [res.data.target_amount[0], res.data.sales[0]],
          type: "pie",
          width: "700",
          header: "Pie Chart"

        })
      })

    }
  }, [selectedCompanyUser, selectedYear]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >

      {value === index && (
        <>
          <Box style={{ padding: "20px" }}>
            <Grid container spacing={0}>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <FormControl>
                    <InputLabel id="mpo-select-label">Role Name</InputLabel>
                    <Select
                      labelId="mpo-select-label"
                      id="mpo-select"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      label="Role Name"
                    >
                      <MenuItem value={null}>None</MenuItem>
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.title && role.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {selectedRole !== null ?
                  <Grid item xs={2}>
                    <FormControl>
                      <InputLabel id="mpo-select-label">User Name</InputLabel>
                      <Select
                        labelId="mpo-select-label"
                        id="mpo-select"
                        value={selectedCompanyUser}
                        onChange={(e) => setSelectedCompanyUser(e.target.value)}
                        label="Role Name"
                      >
                        <MenuItem value={null}>None</MenuItem>
                        {companyUserList?.map((role) => (
                          <MenuItem key={role.id} value={role.id}>
                            {role.title && role.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid> : <></>}
                <Grid item xs={2}>
                  <FormControl>
                    <InputLabel id="mpo-select-label">Year</InputLabel>
                    <Select
                      labelId="mpo-select-label"
                      id="mpo-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      label="Year"
                    >
                      <MenuItem value={null}>None</MenuItem>
                      {yearList.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <ApexChart
            data={chartData} />
        </>
      )}
    </div>
  );
}