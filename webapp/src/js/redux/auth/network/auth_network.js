import Axios from '../../../utils/network/axios';
import {  PACKAGE } from './../constants/constants';
import Utils from '../../../utils/utils';
import {showProgress, hideProgress} from '../../core/actions/progress_creator';
import authActionCreator from  '../actions/auth_creator';
import {history} from "../../../redux/store";

const verifyToken = () => {
    return (dispatch) => {
        dispatch(showProgress());
        const url = "/"  + PACKAGE + "/authenticate";
        return Axios.get(url, {})
        .then((response) => {
            dispatch(hideProgress());
            dispatch(authActionCreator.updateAuthUser(response['user']));
            dispatch(authActionCreator.authSuccess(response));
            return response;
        })
        .catch((error) => {    
            dispatch(hideProgress());
            dispatch(authActionCreator.authFailure(error));
            throw error;
        });
    };
};

const login = (email, password) => {
    return (dispatch) => {
        dispatch(showProgress());        
        const url = "/"  + PACKAGE + "/login";
        return Axios.post(url, { email: email, password: password })
            .then((response) =>  {
            console.log("grrrr");    
            localStorage.setItem('token',response['token']);
            dispatch(authActionCreator.updateAuthUser(response['user']));
            dispatch(authActionCreator.authSuccess(response));
            dispatch(hideProgress());   
            history.push("/my")
            return response;      
        })
        .catch((error) => { 
            dispatch(hideProgress());   
            if (error.response && error.response.status && error.response.status === 400) {
                Utils.showErrorAlert(error.response.data.reason);
            }
            dispatch(authActionCreator.authFailure(error));
            throw error;
        });
    };
};










export {
    login,
    verifyToken,
};

