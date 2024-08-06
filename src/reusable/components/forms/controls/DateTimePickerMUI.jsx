import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import {
    MuiPickersUtilsProvider,
    KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { tryParseDateFromString } from "../utils/tryParseDateFromString";

export default function DateTimePickerMUI(props) {
    const { name, label, value, onChange } = props;
    const [changeDefault, setChangeDefault] = useState("");


    useEffect(() => {
        setChangeDefault(value);
        if (typeof (value) === "object") {
            if (value !== null)
                setChangeDefault(value.toISOString().slice(0, 16));
        }
        if (typeof (value) === "string") {
            setChangeDefault(value.slice(0, 16))
        }


    }, [value])


    const convertToDefEventPara = (name, e) => {
        // var value = new Date(e.target.value);

        // 
        let value = e.target.value;

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
            value={changeDefault}
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
