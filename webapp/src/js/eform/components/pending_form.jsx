import React from 'react';
import Application from './eform';

const PendingApplication = (props) => {
    return (
        <Application {...props} previewMode={true} />
    );
}

export default PendingApplication;