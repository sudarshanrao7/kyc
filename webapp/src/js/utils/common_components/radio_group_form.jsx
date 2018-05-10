import React from 'react';
import {RadioGroup,RadioButton} from 'react-toolbox/lib/radio';

const RadioFunction = (props) => {
    let { meta: meta, input: input, ...mainprops } = props;
    let options = _.has(mainprops, 'options') ? mainprops.options : [];
    const label = props.labelString || "";
    const colXSNum =  _.has(props, 'colXSNum') ? "col-xs-"+props.colXSNum : "";
    let labelKey = _.has(mainprops, 'labelKey') ? mainprops.labelKey : 'label';
    let valueKey = _.has(mainprops, 'valueKey') ? mainprops.valueKey : 'value';
    let { value, onChange, onFocus, onBlur } = input;
    const error = (meta.error && (meta.touched || meta.submitFailed)) ? meta.error : "";
    const hasError = (error === "") ? false : true;
    const className = 'row reduxform-select-container '  +
        (hasError ? 'has-error' : '');

    return (
        <div className={className}>
            <label className="m-b-10 w-100" >{label}</label>  
            <RadioGroup  {...mainprops}  value={value}  onChange={onChange}      >
                {
                    options.map((option, index) => (
                        <RadioButton
                            className={colXSNum}
                            key={index} label={option[labelKey].toString()} value={option[valueKey]} />
                    ))    
            }
        </RadioGroup>   
            <div className="field-error-message" >{error}</div>
        </div>       

    );
};
export default RadioFunction;