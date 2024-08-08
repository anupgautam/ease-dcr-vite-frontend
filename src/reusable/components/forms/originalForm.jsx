import React, { useEffect } from 'react'
import Controls from '../../components/forms/controls/Controls';

export const OriginalForm = ({ allKey, values, handleInputChange }) => {

    return (
        <>{allKey.ControlType === "input" ?
            <Controls.Input
                name={allKey.name}
                label={allKey.label}
                value={values[allKey.name]}
                onChange={handleInputChange}
            /> : <>{allKey.ControlType === "checkbox" ?
                <Controls.Checkbox
                    name={allKey.name}
                    label={allKey.label}
                    value={values[allKey.name]}
                    onChange={handleInputChange}
                /> : <>

                </>}</>
        }</>
    )
}

export const SelectForm = ({ allKey, values, handleInputChange }) => {
    const options = []
    const data = allKey.selectListAPI();

    if (data.status === "fulfilled") {
        data.data.ids.forEach((key) => {
            options.push({ id: key, title: data.data.entities[key][allKey.listTitle] })
        })
    }

    return (
        <>
            <Controls.Select
                name={allKey.name}
                label={allKey.label}
                value={values[allKey.name]}
                onChange={handleInputChange}
                options={options}
            />
        </>

    )
}