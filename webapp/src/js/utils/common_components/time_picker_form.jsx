import React from 'react';
import TimePicker  from 'react-toolbox/lib/time_picker';


const TimePickerFunction = (props)=>{
    let { meta:meta,input: input, ...mainprops } = props; 
    let { value, onChange,onFocus,onBlur }  = input; 
    if (value === "" || value === null){
        value = undefined;
    }
    const readonly = props.readonly ? props.readonly : false;
        const error=  ( meta.error && (meta.touched ||  meta.submitFailed))  ? meta.error : "";
    return (
            <TimePicker
                   {...mainprops}    
                   error={error} 
                   format="ampm"
                   onChange={(value) => onChange(value)}
                   //onFocus={(value) => onFocus(value)}
                   value={value}  
                   readonly={readonly}  
            />    
    );    
}; 
export default TimePickerFunction;