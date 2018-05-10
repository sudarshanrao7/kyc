import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Template from "./templates/home_container.rt";
import store,{history} from '../../redux/store';
import { verifyToken } from '../../redux/auth/network/auth_network';
import Utils from '../../utils/utils';
import BaseComponent from '../../utils/common_components/basecomponent';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import MenuAction from '../../redux/core/actions/menu_state_creator';
import Applications from '../../eform/components/eform_list'


class HomeContainer extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        this.returnMyApplications = this.returnMyApplications.bind(this);
    };

    componentDidMount(){
        history.push("/my");
    }

    returnMyApplications(routeProps){
        let props = {...this.props};
        let updatedMatch = {
            ...props.match,
            ...routeProps.match,
        };
        props.match = updatedMatch;
        return (
            <Applications {...props}   /> 
        );
    }

    returnPendingApplications(routeProps){
        let props = {...this.props};
        let updatedMatch = {
            ...props.match,
            ...routeProps.match,
        };
        props.match = updatedMatch;
        props.show_all = true;
        return (
            <Applications {...props}   /> 
        );
    }


    render() {
        if (!this.props.isAuthenticated) {
            return (<div className="row center-xs m-t-25">
                <ProgressBar type='circular' mode='indeterminate' multicolor />
            </div>);
        }
        return Template.apply(this);
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            verifyToken,
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
const HomeContainerConnected = connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
export default HomeContainerConnected;
