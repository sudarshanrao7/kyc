import React from 'react';
import Button from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';

const TooltipWrapper = Tooltip('div');
const TooltipFunction = (props) => {
    const className = _.has(props, 'className') ? props.className : "";
    return (
        <TooltipWrapper {...props} className={className} />  
    );
};

export default TooltipFunction;