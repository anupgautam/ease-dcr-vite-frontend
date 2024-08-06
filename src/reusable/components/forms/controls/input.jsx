import { TextField } from '@mui/material';
import React, { useState } from 'react'


export default function Input(props) {
    const [shouldAnimate, setShouldAnimate] = useState(false);

    const { name, label, value, error = null, onChange, onKeyUp, className = null, defaultValue, disabled = false } = props;

    return (
        <>
            {
                disabled ?
                    <TextField
                        disabled
                        variant="outlined"
                        label={label}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        className={className}
                        defaultValue={defaultValue}
                        style={{
                            borderBlockColor: 'white',
                            width: '100%',
                        }
                        }
                        {...(error && { error: true, helperText: error })}
                    /> :
                    <TextField
                        variant="outlined"
                        label={label}
                        name={name}
                        value={value}
                        onChange={onChange}
                        onKeyUp={onKeyUp}
                        className={className}
                        defaultValue={defaultValue}
                        // InputLabelProps={{
                        //     className: shouldAnimate ? 'animated-label' : '',
                        // }}
                        // onFocus={() => setShouldAnimate(true)}
                        // onBlur={() => setShouldAnimate(false)}
                        style={{
                            borderBlockColor: 'white',
                            width: '100%',
                        }
                        }
                        {...(error && { error: true, helperText: error })}
                    />
            }
        </>
    )
}
