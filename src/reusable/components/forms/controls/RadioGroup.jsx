import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

export default function RadioGroup(props) {
  const { name, label, value, onChange, items } = props;

  return (
    <FormControl>
      <FormLabel
        style={{
          fontSize: "14px ",
          fontWeight: "600",
          color: "black",
          marginTop: "5px",
          marginBottom: "10px",
          textAlign:'start'
        }}
      >
        {label}
      </FormLabel>
      <MuiRadioGroup row name={name} value={value} onChange={onChange}>
        {items.map((item) => (
          <FormControlLabel
            key={item.id}
            value={item.id}
            control={<Radio />}
            label={item.title}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
}
