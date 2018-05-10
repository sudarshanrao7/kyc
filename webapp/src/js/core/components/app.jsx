import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import  AppTemplate from "./templates/app";
import store,{history} from '../../redux/store';
import { push } from 'react-router-redux';
import { verifyToken } from '../../redux/auth/network/auth_network';
import Utils from '../../utils/utils';
import BaseComponent from '../../utils/common_components/basecomponent';
import Cookies from 'js-cookie';
import Axios from '../../utils/network/axios';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import authActionCreator from  '../../redux/auth/actions/auth_creator';


class App extends BaseComponent {

    constructor(props, context) {
        super(props, context);
        this.doLogout = this.doLogout.bind(this);
        this.state = {isTokenAvailable:false};
	};

    componentWillMount() {
		const token = Cookies.get("token");
		if (typeof token === 'undefined' || token === "") {
			store.dispatch(push('/auth/login'));
        } else {
            Axios.defaults.headers = {
				'Version': 1,
				'Accept':"application/json",
				'Content-type': "application/json",
				'Authorization': token
			};
            this.setState({isTokenAvailable: true});
            if (!this.props.isAuthenticated) {
                this.props.verifyToken().then((response) => {

                }).catch((error) => {
                       this.setState({isTokenAvailable: false});
                });
			}
        }
    }

    doLogout() {
        this.props.doLogout();
        localStorage.removeItem("token");
        this.setState({isTokenAvailable:false});
        history.push("/auth/login");    
    }


    render() {
        if(!this.props.isAuthenticated && this.state.isTokenAvailable){
            return (<div className="row center-xs m-t-25">
                    <ProgressBar  type='circular' mode='indeterminate' multicolor />
            </div>);
        } else{
			return AppTemplate.apply(this);
		}

    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({verifyToken,
        authActions:authActionCreator,
        doLogout:authActionCreator.doLogout,
	}, dispatch);
}
function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.authReducer.isAuthenticated,
        isUpdatingServer: state.core.progressReducer.isUpdatingServer,
        user: state.auth.authReducer.user,
    };
}
const MainApp = connect(mapStateToProps, mapDispatchToProps)(App);
export default MainApp;
