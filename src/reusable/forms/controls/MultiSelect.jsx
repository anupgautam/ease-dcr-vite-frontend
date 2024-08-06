import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select as MuiSelect, useTheme } from "@mui/material";
import React from "react";


export default function MultiSelect(props) {
  const { names, name, label, value, error = null, onChange, options, valueArray } = props;
  const theme = useTheme();



  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;


  return (

    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        labelId={label}
        multiple
        name={name}
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
      // renderValue={(selected) => (
      //   <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      //     {selected.map((value) => (
      //       <Chip key={value} label={value} />
      //     ))}
      //   </Box>
      // )}
      >
        {options && options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.title}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  )
}