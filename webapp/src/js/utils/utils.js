import Cookies from 'js-cookie';
import $ from 'jquery';
import Store from '../redux/store';
import {displayNotification as DisplayNotification} from '../redux/notifications/actions/notification_creator';
import moment from 'moment';

const utils = {
    getDevice: () => {
        return 'web';
    },
    showSuccessAlert: (message)=>{
         Store.dispatch(DisplayNotification('Success',message,"success"));    
    },
    showErrorAlert: (message) => {
        Store.dispatch(DisplayNotification('Failure',message,"error"));    
    },
    showInfoAlert: (message) => {
        Store.dispatch(DisplayNotification('Information',message,"info"));      
    },
    showWarningAlert: (message) => {
        Store.dispatch(DisplayNotification('Warning',message,"warning"));   
    },
    getCookieValue: (cname) => {
        const cookie = Cookies.get(cname);
        if (typeof cookie === 'undefined') {
            return "";
        }
        else {
            return cookie;
        }
    },
    setCookieValue:  (cname, cvalue,expires=6) => {
        Cookies.set(cname, cvalue, { expires: expires });
        let cookie = {};
        cookie[cname] = cvalue;
        return cookie;
    },
    removeCookieValue:  (cname) => {
        Cookies.remove(cname);
        return "";
    },

    formatServerDate: (date_object) => {
        if (!date_object) {
            return null;
        }
        return moment(date_object).format("YYYY-MM-DD");
    },
    parseServerDate: (date_string) => {
        if (_.isEmpty(date_string)) {
            return null;
        }
        return moment(date_string).seconds(0).milliseconds(0).toDate();
    },
    parseServerDateAsString: (date_string) => {
        if (_.isEmpty(date_string)) {
            return '';
        }
        return moment(date_string).format("DD MMM YYYY");
    },
    parseDateAsString: (date_object) => {
        if (!date_object) {
            return '';
        }
        return moment(date_object).format("DD MMM YYYY");
    },


    dateEquals: (d1, d2) => {
        return (d1.getFullYear() === d2.getFullYear()) &&
           (d1.getMonth() === d2.getMonth()) &&
           (d1.getDate() === d2.getDate());
    },

};
export default utils;
