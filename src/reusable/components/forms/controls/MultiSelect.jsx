// import React, { useState } from "react";
// import { Theme, useTheme } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select, { SelectChangeEvent } from '@mui/material/Select';
// import Chip from '@mui/material/Chip';

// export default function MultiSelect(props) {
//   const { names, name, label, value, error = null, onChange, options, valueArray = [] } = props;

//   const theme = useTheme();

//   function getStyles(name, valueArray, theme) {
//     return {
//       fontWeight:
//         valueArray.indexOf(name) === -1
//           ? theme.typography.fontWeightRegular
//           : theme.typography.fontWeightMedium,
//     };
//   }

//   const ITEM_HEIGHT = 48;
//   const ITEM_PADDING_TOP = 8;

//   const MenuProps = {
//     PaperProps: {
//       style: {
//         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//         width: 250,
//       },
//     },
//   };

//   return (

//     <FormControl sx={{ m: 1, width: 300 }}>
//       <InputLabel>{label}</InputLabel>
//       <Select
//         labelId={label}
//         multiple
//         name={name}
//         value={valueArray}
//         onChange={onChange}
//         input={<OutlinedInput label={label} />}
//         renderValue={(selected) => (
//           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//             {selected.map((value) => (
//               <Chip key={value} label={value} />
//             ))}
//           </Box>
//         )}
//         MenuProps={MenuProps}
//       >
//         {names.map((name1) => (
//           <MenuItem
//             key={name1}
//             value={name1.title}
//             style={getStyles(name1, valueArray, theme)}
//           >
//             {name1}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   )
// }

import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

export default function MultiSelect(props) {
  const {
    names,
    name,
    label,
    value,
    error = null,
    onChange,
    options,
    valueArray = [],
  } = props;

  const theme = useTheme();

  function getStyles(name, valueArray, theme) {
    return {
      fontWeight:
        valueArray.findIndex((item) => item.id === name.id) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <FormControl sx={{ m: 1, width: 300 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        labelId={label}
        multiple
        name={name}
        value={valueArray}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value.id} label={value.title} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {names.map((name1) => (
          <MenuItem
            key={name1.id}
            value={name1.title}
            style={getStyles(name1, valueArray, theme)}
          >
            {name1.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
