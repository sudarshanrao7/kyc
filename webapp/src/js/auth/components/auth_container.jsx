import React from 'react';
import BaseComponent from '../../utils/common_components/basecomponent';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import { Switch, Route } from 'react-router-dom';
import LoginForm from './login';

const AuthContainer = (props) => {
    return (
        <Switch>
            <Route exact path={`${props.match.url}/login`} component={LoginForm} />            
        </Switch>
    );
};    
export default AuthContainer;
