import React from 'react';
import {sendReactError} from '../../redux/core/network/file_upload';
import store,{history} from '../../redux/store';
import Axios from '../network/axios';
import Utils from '../utils';


class BaseComponent extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
    };  

    componentDidCatch(error,info){
        if(__DEV__) {
            Utils.showErrorAlert("Oops.. Looks like we have an error. Check Console!");
            console.log(error);
            console.log(error.stack);
            console.log(info);
        }
     }
}
export default BaseComponent;
