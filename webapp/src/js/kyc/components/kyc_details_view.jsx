import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Template from "./templates/kyc_details_view.rt";
import store,{history} from '../../redux/store';
import Utils from '../../utils/utils';
import BaseComponent from '../../utils/common_components/basecomponent';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import PropTypes from 'prop-types';

class KYCDetailsView extends BaseComponent {
    render(){
        return Template.apply(this);
    }    
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
        },
        dispatch
    );
}
function mapStateToProps(state, ownProps) {
    return {
        isAuthenticated: state.auth.authReducer.isAuthenticated,
        user: state.auth.authReducer.user,
    };
}
const KYCDetailsViewConnected = connect(mapStateToProps, mapDispatchToProps)(KYCDetailsView);
export default KYCDetailsViewConnected;
