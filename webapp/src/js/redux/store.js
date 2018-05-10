import thunkMiddleware from 'redux-thunk';
import { createStore, compose, applyMiddleware } from 'redux';
import {  routerMiddleware } from 'react-router-redux';
import rootReducer from './root_reducer';
import Utils from '../utils/utils';
import stateImmutable from "redux-immutable-state-invariant";
import createHistory from 'history/createBrowserHistory';

const defaultState = {};
const history = createHistory();
let middleware = [thunkMiddleware,routerMiddleware(history)];

let store = {};
if(__DEV__) {
    middleware.push(stateImmutable());
    const devFreeze = applyMiddleware(...middleware);
    const devEnhancer = compose(devFreeze, window.devToolsExtension ? window.devToolsExtension() : f => f);    
    store = createStore(rootReducer, defaultState, devEnhancer);
}
else {
    store = createStore(rootReducer, defaultState, applyMiddleware(...middleware));
}


if (module && module.hot && __DEV__ && process.env.BROWSER) {
    module.hot.accept('./root_reducer', () => {
      const nextReducer = require('./root_reducer').default;
      store.replaceReducer(nextReducer);
    });
}

export { history };
export default store;
