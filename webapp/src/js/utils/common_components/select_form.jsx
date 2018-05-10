import React from 'react';
import AsynTetheredSelectWrap, {TetheredSelectWrap}  from './tetheredSelect';
import Select  from 'react-select';
import {Creatable}  from 'react-select';
import 'react-select/dist/react-select.css';


const tetheredSelectFunction = (props)=>{
         let { input: { value,onBlur } } = props;
          const label = props.label || "";
          const labelKey = _.has(props, 'labelKey') ? props.labelKey : 'label';
          const valueKey = _.has(props, 'valueKey') ? props.valueKey : 'value';          
          const clearable = _.has(props, 'clearable') ? props.clearable : true;
           const multi = _.has(props, 'multi') ? props.multi : false;
           const simpleValue = _.has(props, 'simpleValue') ? props.simpleValue : false;
           if (multi) {
                value = _.map(value,(item)=>{
                    if(item !== null && typeof item === 'object'){
                        return item[valueKey];
                    }
                    return item;
                });
            }else{
                if(value !== null && typeof value === 'object'){
                    if(simpleValue){
                         value =  value[valueKey];
                    }    
                }
            }             
          const disabled = props.disabled ? true : false;
          const error=  ( props.meta.error && (props.meta.touched ||  props.meta.submitFailed))  ? props.meta.error : "";
          const hasError = (error === "") ? false : true;
          const className = 'reduxform-select-container '  +
                (hasError? 'has-error' : '');
        return (
            <div  className={className}>
                <label >{label}</label>  
                <TetheredSelectWrap
                    {...props}
                    {...props.input}
                    options={props.options}
                    onBlur={() => onBlur(value)}
                    value={value}  
                    disabled={disabled}  
                    clearable={clearable}  
                    multi={multi}  
                    simpleValue={simpleValue}
                    labelKey={labelKey}
                    valueKey={valueKey}     
                    openAfterFocus={true}               
                />
                <span className="field-error-message" >{error}</span>
            </div>    
        );
}; 

const tetheredSelectAsynFunction = (props)=>{
          let { input: { value,onBlur } } = props;   
          const label = props.label || "";
          const labelKey = _.has(props, 'labelKey') ? props.labelKey : 'label';
          const valueKey = _.has(props, 'valueKey') ? props.valueKey : 'value';          
          const clearable = _.has(props, 'clearable') ? props.clearable : true;
          const multi = _.has(props, 'multi') ? props.multi : false;
          const simpleValue = _.has(props, 'simpleValue') ? props.simpleValue : false;
            if(multi){
                value = _.map(value,(item)=>{
                    if(item !== null && typeof item === 'object'){
                        return item[valueKey];
                    }
                    return item;
                });
            }else{
                if(value !== null && typeof value === 'object'){
                    if(simpleValue){
                         value =  value[valueKey];
                    }    
                }
            }           
          const disabled = props.disabled ? true : false;
          const error=  ( props.meta.error && (props.meta.touched ||  props.meta.submitFailed))  ? props.meta.error : "";
          const hasError = (error === "") ? false : true;
          const className = 'reduxform-select-container '  +
                (hasError? 'has-error' : '');
        return (
            <div  className={className}>
                <label >{label}</label>  
                <AsynTetheredSelectWrap
                    {...props}
                    {...props.input}
                    options={props.options}
                    onBlur={() => onBlur(value)}
                    value={value}  
                    disabled={disabled}  
                    clearable={clearable}  
                    multi={multi}  
                    simpleValue={simpleValue}
                    labelKey={labelKey}
                    valueKey={valueKey}    
                    openAfterFocus={true}                
                />
                <span className="field-error-message" >{error}</span>
            </div>    
        );
}; 
const selectFunction = (props)=>{
          let { input: { value,onBlur,onFocus } } = props; 
          const label = props.label || "";
          const labelKey = _.has(props, 'labelKey') ? props.labelKey : 'label';
          const valueKey = _.has(props, 'valueKey') ? props.valueKey : 'value';
          const clearable = _.has(props, 'clearable') ? props.clearable : true;
          const multi = _.has(props, 'multi') ? props.multi : false;
          const simpleValue = _.has(props, 'simpleValue') ? props.simpleValue : false;
          if(multi){
              value = _.map(value,(item)=>{
                  if(item !== null && typeof item === 'object'){
                      return item[valueKey];
                  }
                  return item;
              });
          }else{
            if(value !== null && typeof value === 'object'){
                    if(simpleValue){
                         value =  value[valueKey];
                    }    
            }
          }
          const disabled = props.disabled ? true : false;
          const error=  ( props.meta.error && (props.meta.touched ||  props.meta.submitFailed))  ? props.meta.error : "";
          const hasError = (error === "") ? false : true;
          const className = 'm-t-10 reduxform-select-container '  +
                (hasError? 'has-error' : '');
        return (
            <div  className={className}>
                <label >{label}</label>  
                <Select
                    {...props}
                    {...props.input}
                    options={props.options}
                    onBlur={() => onBlur(value)}
                    value={value}  
                    disabled={disabled}  
                    clearable={clearable}  
                    multi={multi}  
                    simpleValue={simpleValue}
                    labelKey={labelKey}
                    valueKey={valueKey}
                    openAfterFocus={true}
                />
                <span className="field-error-message" >{error}</span>
            </div>    
        );
}; 
const creatableFunction = (props)=>{
          let { input: { value,onBlur } } = props; 
          const label = props.label || "";
          const labelKey = _.has(props, 'labelKey') ? props.labelKey : 'label';
          const valueKey = _.has(props, 'valueKey') ? props.valueKey : 'value';
          const clearable = _.has(props, 'clearable') ? props.clearable : true;
          const multi = _.has(props, 'multi') ? props.multi : false;
          const simpleValue = _.has(props, 'simpleValue') ? props.simpleValue : false;
          const isValidNewTag = (data)=>{
            if (data.label ){
                    let label = data.label.trim();
                    if (label && label.length > 1 && label[0] && label[0] === label[0].toUpperCase()) {
                        return true;
                    }else {
                    return false;
                    }
                } else {
                    return false;
                }
          };

          if(multi){
              value = _.map(value,(item)=>{
                  if(item !== null && typeof item === 'object'){
                      let { className:className, ...remaining } = item; 
                      return remaining;
                  }
                  return item;
              });
          }else{
            if(value !== null && typeof value === 'object'){
                    if(simpleValue){
                         value =  value[valueKey];
                    }    
            }
          }
          const disabled = props.disabled ? true : false;
         const error=  ( props.meta.error && (props.meta.touched ||  props.meta.submitFailed))  ? props.meta.error : "";
          const hasError = (error === "") ? false : true;
          const className = 'm-t-10 reduxform-select-container '  +
                (hasError? 'has-error' : '');
        return (
            <div  className={className}>
                <label >{label}</label>  
                <Creatable
                    {...props}
                    {...props.input}
                    options={props.options}
                    onBlur={() => onBlur(value)}
                    value={value}  
                    disabled={disabled}  
                    clearable={clearable}  
                    multi={multi}  
                    simpleValue={simpleValue}
                    labelKey={labelKey}
                    valueKey={valueKey}
                    isValidNewOption={isValidNewTag}
                />
                <span className="field-error-message" >{error}</span>
            </div>    
        );
}; 
export  {tetheredSelectFunction,tetheredSelectAsynFunction,creatableFunction};
export default selectFunction;