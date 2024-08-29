import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  MenuItem,
  Box,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Card
} from '@mui/material';
import { useSelector } from 'react-redux';
import ApexChart from '@/reusable/components/charts/apexChart';
import { useGetTargetsByUserMutation } from '@/api/ExpensesSlices/targetSlices';
import { useGetCompanyRolesByCompanyQuery } from '@/api/CompanySlices/companyRolesSlice';
import { useGetAllCompanyUserRoleByRoleQuery } from '@/api/CompanySlices/companyUserRoleSlice';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';

export default function TargetChart(props) {
  const { company_id, user_role, company_user_id, refresh, access } = useSelector((state) => state.cookie);

  const now = new BSDate().now();

  const monthData = getNepaliMonthName(now._date.month);
  const yearData = now._date.year;

  const { children, value, index, ...other } = props;
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedYear, setSelectedYear] = useState(yearData);
  const [selectedCompanyUser, setSelectedCompanyUser] = useState(null);
  const [companyUserList, setCompanyUserList] = useState([]);
  // const roles = useSelector(state => state?.dcrData?.company_roles);
  const year = [
    { value: '2080', label: '2080' },
    { value: '2081', label: '2081' },
    { value: '2082', label: '2082' },
    { value: '2083', label: '2083' },
    { value: '2084', label: '2084' },
    { value: '2085', label: '2085' },
    { value: '2086', label: '2086' },
    { value: '2087', label: '2087' },
    { value: '2089', label: '2089' },
    { value: '2090', label: '2090' },
  ]

  // const yearList = ['2075', '2076', '2077', '2078', '2079', '2080', '2081', '2082', '2083', '2084', '2085', '2086', '2087', '2088', '2089', '2090']

  const handleNepaliYearChange = useCallback((event) => {
    setSelectedYear(event.target.value);
  }, [])

  const [chartData, setChartData] = useState(null);

  const companyUser = useGetAllCompanyUserRoleByRoleQuery(selectedRole);

  const { data: rolesData } = useGetCompanyRolesByCompanyQuery(company_id);

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
              categories: res?.data?.year
            }
          },
          series: [
            {
              name: "Target Amount",
              data: res?.data?.target_amount
            },
            {
              name: "Sales",
              data: res?.data?.sales
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
          <Card>
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
                        onChange={handleNepaliYearChange}
                        label="Year"
                      >
                        <MenuItem value={null}>None</MenuItem>
                        {year.map((year) => (
                          <MenuItem key={year.value} value={year.value}>
                            {year.label}
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
          </Card>
        </>
      )}
    </div>
  );
}