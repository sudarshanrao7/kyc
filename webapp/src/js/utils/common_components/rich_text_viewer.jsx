import React from 'react';


const richTextViewer = (props)=>{
    const  value  = props.value; 
    let markup = {__html: value};
    return (
        <div {...props} value="" dangerouslySetInnerHTML={markup}   ></div>
    );    
}; 
export default richTextViewer;