import React from 'react';
import PropTypes from 'prop-types';
import Checkbox  from 'react-toolbox/lib/checkbox';
import Field  from 'redux-form';

const CheckboxGroupFunction = (props) => {
    //showCountLabel  is used exercise filter facet count
    let showCountLabel = _.has(props, 'showCountLabel') ? props.showCountLabel : false;
    if(typeof(showCountLabel) !== "boolean"){
        showCountLabel = false;
    }
    const disabled = _.has(props, 'disabled') ? props.disabled : false;
    const label = props.label || "";
    const colXSNum =  _.has(props, 'colXSNum') ? "vertical-align col-xs-"+props.colXSNum : "vertical-align col-xs-4";
    let { meta: meta, input: input, options: options, name: name, ...mainprops } = props; 
    const { value, onChange } = input;     
    const error=  ( meta.error && meta.submitFailed)  ? meta.error : "";
    const hasError = (error === "") ? false : true;
    const className = 'row reduxform-select-container '  +
        (hasError? 'has-error' : '');

        return (
            <div  className={className}>
                <label className="m-b-10 w-100" >{label}</label>  
                {
                    options.map((option, index) => (
                        <span className={colXSNum}  key={index}>
                            <Checkbox
                                {...mainprops}     
                                key={index}
                                className="di-block"
                                name={`${index}`}   
                                label={option.label}
                                    onChange={(checked_val) => {
                                        const newValue = [...value];
                                        if (checked_val){
                                            newValue.push(option.value);
                                        } else {
                                            newValue.splice(newValue.indexOf(option.value), 1);
                                        }
                                        return onChange(newValue);
                                        }}
                                    checked={(value.indexOf(option.value) !== -1)}
                                    disabled={disabled}  
                                />
                                {
                                    showCountLabel && (
                                        <span className="badge bg-success  m-l-5 m-r-10 m-b-15" >{option.count ? option.count : 0}</span>  
                                    )
                                }
                        </span>
                    ))
                }   
                <span className="field-error-message" >{error}</span>
            </div>    
        );  
}; 
    
CheckboxGroupFunction.propTypes = {
    colXSNum: PropTypes.number,
    showCountLabel:PropTypes.boolean,
};


export default CheckboxGroupFunction;