import Axios from '../../../utils/network/axios';
import {showProgress, hideProgress} from '../../core/actions/progress_creator';
import Utils from '../../../utils/utils';

const uploadFiles = (params) => {
    return (dispatch) => {
        dispatch(showProgress());
        const url = "/core/file_upload";
        return Axios.post(url, params).then((response) => {
            dispatch(hideProgress());
            Utils.showSuccessAlert("Successfully Uploaded!");
            return response;
        }).catch((error) => {
            dispatch(hideProgress());
            if (error.response && error.response.status && error.response.status === 400) {
                Utils.showErrorAlert(error.response.data.reason);
            }
            throw error;
        });
    };
};

const deleteFile = (params) => {
    return (dispatch) => {
        dispatch(showProgress());
        const url = "/core/file_delete";
        return Axios.post(url, params).then((response) => {
            dispatch(hideProgress());
            Utils.showSuccessAlert("Successfully deleted!");
            return response;
        }).catch((error) => {
            dispatch(hideProgress());
            if (error.response && error.response.status && error.response.status === 400) {
                Utils.showErrorAlert(error.response.data.reason);
            }
            throw error;
        });
    };
};

export {
    uploadFiles,
    deleteFile
};