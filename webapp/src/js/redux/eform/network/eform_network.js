import Axios from '../../../utils/network/axios';
import {  PACKAGE } from './../constants/constants';
import Utils from '../../../utils/utils';
import {showProgress, hideProgress} from '../../core/actions/progress_creator';
import eformActionCreator from  '../actions/eform_action';
import {history} from "../../../redux/store";


const getApplicationList = (params) => {
    return (dispatch) => {
        dispatch(showProgress());
        let  url = "/"  + PACKAGE + "/";
        if (params.show_all === false){
             //spot fix for some weird axios bug, bool get converted to string...
            delete params["show_all"];
        }

        return Axios.get(url, {params})
        .then((response) => {
            dispatch(eformActionCreator.eformListFill(response['data'],response['paginate_info']));
            dispatch(hideProgress());
            return response;
        })
        .catch((error) => {    
            dispatch(hideProgress());
            if (error.response && error.response.status && (error.response.status === 400 || error.response.status === 404)) {
                Utils.showErrorAlert(error.response.data.reason);
            }
            throw error;
        });
    };
};

const getApplicationFormDetails = (pk,get_supporting_data=false) => {
    return (dispatch) => {
        dispatch(showProgress());
        let  url = "/"  + PACKAGE + "/"+pk+"/";
        if (get_supporting_data){
            url = url + "?get_supporting_data=1";
        }
        return Axios.get(url, {})
        .then((response) => {
            let supporting_data = _.has(response,"supporting_data") ? response["supporting_data"] : {};
            dispatch(eformActionCreator.eformInstanceFill(response['data'],supporting_data));
            dispatch(hideProgress());
            return response;
        })
        .catch((error) => {    
            dispatch(hideProgress());
            if (error.response && error.response.status && (error.response.status === 400 || error.response.status === 404)) {
                Utils.showErrorAlert(error.response.data.reason);
            }
            throw error;
        });
    };
};

const createApplicationForm = (params) => {
    return (dispatch) => {
        dispatch(showProgress());
        let  url = "/"  + PACKAGE + "/";
        return Axios.post(url, params)
        .then((response) => {
            Utils.showSuccessAlert("Submitted Application Form!");
            dispatch(hideProgress());
            return response;
        })
        .catch((error) => {    
            dispatch(hideProgress());
            if (error.response && error.response.status && (error.response.status === 400 || error.response.status === 404)) {
                Utils.showErrorAlert(error.response.data.reason);
            }
            throw error;
        });
    };
};

const updateApplicationForm = (params) => {
    return (dispatch) => {
        dispatch(showProgress());
        const pk = params["id"];
        let  url = "/"  + PACKAGE + "/"+pk+"/";
        return Axios.put(url, params)
        .then((response) => {
            Utils.showSuccessAlert("Application Form Updated Successfully!");
            dispatch(hideProgress());
            return response;
        })
        .catch((error) => {    
            dispatch(hideProgress());
            if (error.response && error.response.status && (error.response.status === 400 || error.response.status === 404)) {
                Utils.showErrorAlert(error.response.data.reason);
            }
            throw error;
        });
    };
};

const approveApplicationForm = (params) => {
    return (dispatch) => {
        dispatch(showProgress());
        const pk = params["id"];
        let  url = "/"  + PACKAGE + "/"+pk+"/";
        return Axios.patch(url, params)
        .then((response) => {
            Utils.showSuccessAlert("Application Form Updated Successfully!");
            dispatch(hideProgress());
            return response;
        })
        .catch((error) => {    
            dispatch(hideProgress());
            if (error.response && error.response.status && (error.response.status === 400 || error.response.status === 404)) {
                Utils.showErrorAlert(error.response.data.reason);
            }
            throw error;
        });
    };
};

export {
    getApplicationList,
    getApplicationFormDetails,
    createApplicationForm,
    updateApplicationForm,
    approveApplicationForm
};