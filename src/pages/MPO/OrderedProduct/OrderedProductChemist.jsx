import React, { useEffect, useState, useCallback } from 'react'
import { useGetChemistsWithoutPaginationQuery } from '@/api/MPOSlices/ChemistSlice'
import { Box, Grid, FormControl, Autocomplete, TextField } from '@mui/material';
import {
  useGetChemistOrderedProductsByChemistIdMutation
} from '@/api/OrderedProductslices/chemistOrderedProductSlice';
import DefaultChemistOrderedProduct from './DefaultChemistOrderedProduct';
import { useSelector } from 'react-redux';

const OrderedProductChemist = ({ index, value, other }) => {
  const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);
  const [selectedChemist, setSelectedChemist] = useState(null);
  const [orderedData, setOrderedData] = useState([]);
  const chemists = useGetChemistsWithoutPaginationQuery(company_id);
  const [chemistList, setChemistList] = useState([]);
  const [chemistOrderedProductData] = useGetChemistOrderedProductsByChemistIdMutation();

  useEffect(() => {
    if (chemists?.data) {
      const chemist = []
      chemists?.data?.forEach((key) => {
        chemist.push({ id: key.id, title: key?.chemist_name?.chemist_name })
      })
      setChemistList(chemist);
    }
  }, [chemists])

  const handleRoleSelect = useCallback((e, value) => {
    setSelectedChemist(value?.id || "")
  }, [])

  const [responseData, setResponseData] = useState();
  useEffect(() => {
    if (selectedChemist) {
      chemistOrderedProductData(selectedChemist)
        .then((res) => {
          setResponseData(res);
          setOrderedData(res?.data?.results);
        })
        .catch((error) => {
          console.error("Failed to fetch ordered product data:", error);
        });
    }
  }, [selectedChemist]);

  return (
    <>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Box style={{ padding: "20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={5.5} sm={2.5}>
              <Box marginBottom={3}>
                <FormControl>
                  <Autocomplete
                    options={chemistList}
                    getOptionLabel={(option) => option.title}
                    onChange={handleRoleSelect}
                    renderInput={(params) => (
                      <TextField {...params} label="Chemist" />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        {option.title}
                      </li>
                    )}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <DefaultChemistOrderedProduct
            data={orderedData} />
        </Box>
      </div>
    </>
  )
}

export default React.memo(OrderedProductChemist)