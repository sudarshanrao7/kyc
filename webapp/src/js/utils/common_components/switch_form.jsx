import React from 'react';
import Switch  from 'react-toolbox/lib/switch';

const SwitchFunction = (props)=>{
    let { meta:meta,input: input, ...mainprops } = props; 
    const { value, onChange,onFocus,onBlur }  = input; 
    const disabled = _.has(props, 'disabled') ? props.disabled : false;
    let onChangeFunction = (value) => onChange(value);
    let onFocusFunction = (value) => onFocus(value);
    let onBlurFunction = (value) => onBlur(value);
    
    if (disabled){
        onChangeFunction = null;
        onFocusFunction = null;
        onBlurFunction = null;
    }
    return (
            <Switch
                   {...mainprops}    
                   onChange={onChangeFunction}
                   //onFocus={onFocusFunction}
                   //onBlur={onBlurFunction}
                   checked={value}  
                   disabled={disabled}  
            />
    );    
}; 
export default SwitchFunction;