import React from 'react';
import Checkbox  from 'react-toolbox/lib/checkbox';

const CheckboxFunction = (props) => {
    let { meta:meta,input: input, ...mainprops } = props; 
    const { value, onChange,onFocus,onBlur }  = input;     
    const disabled = _.has(props, 'disabled') ? props.disabled : false;
    return (
            <Checkbox
                   {...mainprops}    
                   onChange={(val) => onChange(val)}
                   onFocus={(val) => onFocus(val)}
                   onBlur={(val) => onBlur(val)}
                   checked={value}  
                   disabled={disabled}  
            />
    );    
}; 
export default CheckboxFunction;