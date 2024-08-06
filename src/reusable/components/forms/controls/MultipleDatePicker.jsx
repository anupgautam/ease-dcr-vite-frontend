import React, {useState} from 'react'
import { Button } from '@mui/material'
import getDatesByDayList from '@/reusable/forms/utils/getHoliday'

import MultipleDatesPicker from '@ambiot/material-ui-multiple-dates-picker'


const MultipleDatePicker = (props) => {
    const {buttonText, onChange, name, selectedDates, disabledDates} = props
  const [open, setOpen] = useState(false);
  const convertToDefEventPara = (value) => {
    onChange({ target: {name, value} });
  };
  return (
    <div>
      <Button onClick={() => setOpen(!open)} className="select-holidays">
        {buttonText}
      </Button>
      <MultipleDatesPicker
        open={open}
        selectedDates={selectedDates}
        disabledDates={disabledDates}
        onCancel={() => setOpen(false)}
        onSubmit={dates => convertToDefEventPara(dates) }
        style={{width:"100%"}}
      />
    </div>
  )
}

export default MultipleDatePicker;