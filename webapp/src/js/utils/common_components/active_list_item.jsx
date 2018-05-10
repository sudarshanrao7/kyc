import React from 'react';
import {ListItem}  from 'react-toolbox/lib/list';
import store from '../../redux/store';




const activeListItemFunction = (props)=>{
    let className = _.has(props, 'className') ? props.className : '';
    let to = _.has(props, 'to') ? props.to : '';
    let location = _.has(props, 'location') ? props.location : '';
    let goto = ()=>{
        if(to !== ""){
            history.push(to);
        }
    };    
    if (to !== "" && location !== "" && to  === location){
        className = className + " active";
    }
    return (
            <ListItem
                   onClick={}
                  {...props} 
            />
    );    
}; 
export default activeListItemFunction;