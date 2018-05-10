import React from 'react';
import Link from 'react-toolbox/lib/link';
import Tooltip from 'react-toolbox/lib/tooltip';

const TooltipLink = Tooltip(Link);
const TooltipFunction = (props)=>{
    return (
          <TooltipLink {...props} />  
    );
};
export default TooltipFunction;