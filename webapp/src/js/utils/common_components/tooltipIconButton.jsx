import React from 'react';
import { IconButton } from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';

const TooltipIconButton = Tooltip(IconButton);
const TooltipFunction = (props) => {
    return (
          <TooltipIconButton {...props}  />  
    );
};
export default TooltipFunction;