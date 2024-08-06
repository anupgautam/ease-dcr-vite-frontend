import React from "react";
import { TextField } from "@mui/material";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { tryParseDateFromString } from "../utils/tryParseDateFromString";

export default function DateTimePicker(props) {
  const { name, label, value, onChange } = props;

  const convertToDefEventPara = (name, e) => {
    onChange({ target: { name, value } });
  };

  return (
    <TextField
      id="datetime-local"
      label={label}
      type="datetime-local"
      name={name}
      //   value={value}
      onChange={(e) => convertToDefEventPara(name, e)}
      defaultValue={value}
      InputLabelProps={{
        shrink: true,
      }}
      style={{
        width: "100%",
      }}
    />
    // <MuiPickersUtilsProvider utils={DateFnsUtils}>
    //     <KeyboardDateTimePicker disableToolbar variant="inline" inputVariant="outlined"
    //         label={label}
    //         format="MMM/dd/yyyy"
    //         name={name}
    //         value={value}
    //         onChange={date =>onChange(convertToDefEventPara(name,date))}

    //     />
    // </MuiPickersUtilsProvider>
  );
}
