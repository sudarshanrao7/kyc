import React from 'react';
import DatePicker  from 'react-toolbox/lib/date_picker';


const DatePickerFunction = (props)=>{
    let { meta:meta,input: input, ...mainprops } = props; 
    const { value, onChange,onFocus }  = input;     
    const readonly = props.readonly ? props.readonly : false;
    const error=  ( meta.error && (meta.dirty ||  meta.submitFailed))  ? meta.error : "";

    return (
            <DatePicker
                    {...mainprops}   
                   error={error} 
                   onChange={(value) => onChange(value)}
                   //onFocus={(value) => onFocus(value)}
                   value={value}  
                   readonly={readonly}  
            />
    );    
}; 
export default DatePickerFunction;