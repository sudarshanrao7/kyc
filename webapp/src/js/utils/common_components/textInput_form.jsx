import React from 'react';
import Input from 'react-toolbox/lib/input';


const InputFunction = (props) => {
    let { meta: meta, input: input,needsOnBlur, ...mainprops } = props;
    let { value, onChange, onFocus, onBlur } = input;
    const hint = _.has(props, 'hint') ? props.hint : "";
    const support_float = _.has(props, 'data-support-float') ? props["data-support-float"] : false;
    let isNumber =  false;
    let isFloat =  false;
    if(_.has(props, "type")){
        if(props.type === "number"){
            if(support_float){
                isFloat = true;
            }else{
                isNumber = true;
            }
        }
    }
    needsOnBlur = _.has(props, 'needsOnBlur') ? props.needsOnBlur : false;
    if (!needsOnBlur) {
        onBlur = () => { };
    }
    let currentValue = value;
    const error = (meta.error && (meta.dirty || meta.submitFailed)) ? meta.error : "";
    return (
        <Input
            {...mainprops}
            error={error}
            onChange={(val) => {
                if (val === "") {
                    val = null;
                }else{
                    if(isNumber){
                        val = parseInt(val);    
                        if(isNaN(val)){
                            val = null;
                        }
                    }else if(isFloat){
                        val = parseFloat(val);    
                        if(isNaN(val)){
                            val = null;
                        }
                    }
                }
                currentValue = val;
                onChange(val);
            }}
            onBlur={() => {
                onBlur(currentValue);
            }}
            value={value}
            hint={hint}
        />
    );
};
export default InputFunction;