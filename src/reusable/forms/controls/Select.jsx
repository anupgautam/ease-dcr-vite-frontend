import React from "react";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from "@mui/material";

export default function Select(props) {
  const { name, label, value, error = null, onChange, options, multiple = false } = props;

  return (
    <FormControl variant="outlined" fullWidth {...(error && { error: true })}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        label={label}
        name={name}
        value={value}
        multiple={multiple}
        onChange={onChange}
        sx={{ width: '100%' }}
        style={{
          borderBlockColor: "white",
          width: "100%",
          textAlign: 'start'
        }}
      >
        <MenuItem value="">None</MenuItem>
        {options && options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.title}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}