import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useGetStockistsWithoutPaginationQuery } from '@/api/MPOSlices/stockistApiSlice';
import { Box, Grid, FormControl, Autocomplete, TextField } from '@mui/material';
import {
  useGetStockistOrderedProductsByChemistIdMutation
} from '@/api/OrderedProductslices/stockistOrderedProductSlice';
import DefaultStockistOrderedProduct from './DefaultStockistOrderedProduct';
import { useSelector } from 'react-redux';

const OrderedProductStockist = ({ index, value, other }) => {
  const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);
  const [selectedStockist, setSelectedStockist] = useState(null);
  const [orderedData, setOrderedData] = useState([]);
  const stockists = useGetStockistsWithoutPaginationQuery(company_id)
  const [stockistList, setStockistList] = useState([]);
  const [stockistOrderedProductData] = useGetStockistOrderedProductsByChemistIdMutation();

  useEffect(() => {
    if (stockists?.data) {
      const stockist = []
      stockists?.data?.forEach((key) => {
        stockist.push({ id: key.id, title: key?.stockist_name?.stockist_name })
      })
      setStockistList(stockist);
    }
  }, [stockists])

  const handleRoleSelect = useCallback((e, value) => {
    setSelectedStockist(value?.id || "")
  }, [])
  
  useEffect(() => {
    stockistOrderedProductData(selectedStockist).then((res) => {
      setOrderedData(res?.data?.results)
    })

  }, [selectedStockist])


  // 
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
                    options={stockistList}
                    getOptionLabel={(option) => option.title}
                    onChange={handleRoleSelect}
                    renderInput={(params) => (
                      <TextField {...params} label="Stockist" />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={`${option.id}-${option.title}`}>
                        {option.title}
                      </li>
                    )}
                  />
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <DefaultStockistOrderedProduct
            data={orderedData} />
        </Box>
      </div>
    </>
  )
}

export default React.memo(OrderedProductStockist);