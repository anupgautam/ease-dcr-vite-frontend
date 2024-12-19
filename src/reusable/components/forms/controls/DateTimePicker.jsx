import React from "react";
import { TextField } from "@mui/material";

export default function DateTimePicker(props) {
  const { name, label, value, onChange } = props;

  const convertToDefEventPara = (name, value) => {
    onChange({ target: { name, value } });
  };

  return (
    <TextField
      id="date"
      label={label}
      type="date"
      name={name}
      value={value}
      onChange={(e) => convertToDefEventPara(name, e.target.value)}
      InputLabelProps={{
        shrink: true,
      }}
      style={{
        width: "100%",
      }}
    />
  );
}
