import axios from 'axios';
import Utils from '../utils';
import * as $ from 'jquery';
import authActions from '../../redux/auth/actions/auth_creator';
import webstore,{history} from '../../redux/store';
import {API_VERSION} from '../../core/constants/constants';

let DEVICE = Utils.getDevice();

const baseURL = "//" + window.location.host + "/api";
const commonParams = {};
//const baseURL = "http://localhost/api/" 

let Axios =  axios.create({
    baseURL: baseURL,
    timeout: 120000,
    headers: {
        'USER_AGENT': navigator.userAgent,
        'Accept': "application/json",
        'Content-type': "application/json",
        'Authorization': ''
    }
});


const setParam = async (name, value)  => {
    commonParams[name] = value;
};

const clearParam = async (name) => {
    delete commonParams[name];
};



Axios.interceptors.request.use((config) => {  
    if(! _.includes(config.url,window.location.host)){
        return config;
    }
    let update_url = config.url;
    let token = localStorage.getItem("token") || ""; 
    let data = {};
    config.headers.Authorization = token;
    if(Object.prototype.toString.call(config.data) === "[object FormData]"){
            for(let key in data){
                config.data.append(key, data[key]);
            }
            for(let key in commonParams){
                config.data.append(key, commonParams[key]);
            }
    } else {
        config.data = {...config.data,...data,...commonParams};
    }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });    

// Add a response interceptor
Axios.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    if (!error.response) {
        Utils.showErrorAlert("Network Error: Please check your internet connection & retry!");
    }else if (error.response) {
        if (parseInt(error.response.status) === 401) {
            localStorage.removeItem("token");
            webstore.dispatch(authActions.doLogout());
            history.push('/auth/login');
        }else if(parseInt(error.response.status) === 459){
            Utils.showInfoAlert("An updated web app is available. Reloading page to make your web experience better!");
            setTimeout(()=>{
                window.location.reload(true);
            },3000);
        }else if (parseInt(error.response.status) === 500) {
            console.log(error.response)
            Utils.showErrorAlert(error.response.data.reason);
        }
    }
    // Do something with response error   
    return Promise.reject(error);
    });


export {setParam,clearParam};
export default Axios;
