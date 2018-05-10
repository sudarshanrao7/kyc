import React from 'react';
import Button from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';

const TooltipButton = Tooltip(Button);
const TooltipFunction = (props)=>{
    return (
          <TooltipButton {...props} />  
    );
};
export default TooltipFunction;