import { combineReducers } from 'redux';
import auth from './auth/reducers/index';
import core from './core/reducers/index';
import eform from './eform/reducers/index';
import notificationReducer from './notifications/reducers/notification_reducer';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

const kycReducers = {
    auth,
    core,
    eform,
};

let appReducer = combineReducers({ 
    ...kycReducers,
    notificationReducer,
    form: formReducer,
    routing: routerReducer, 
});

const initialState = appReducer({}, {});
const rootReducer = (state, action) => {
    if (action.type === 'AUTH_USER_LOGOUT') {
         state = initialState;
    }
    return appReducer(state, action);
  };

export default rootReducer;
