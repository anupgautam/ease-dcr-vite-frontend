import React from "react";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from "@mui/material";

export default function Select(props) {
  const { name, label, value, error = null, onChange, options, className = null, disabled = false } = props;

  return (
    <FormControl fullWidth variant="outlined"   error={!!error}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        sx={{
          width: '100%',
          borderBlockColor: "white",
          textAlign: 'start',
        }}
        MenuProps={{ autoFocus: true }}
        disabled={disabled}
      >
        {options?.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.title}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
