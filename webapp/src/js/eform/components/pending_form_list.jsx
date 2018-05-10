import React from 'react';
import ApplicationList from './eform_list';

const PendingApplications = (props) => {
    return (
        <ApplicationList {...props} show_all={true} />
    );
}

export default PendingApplications;