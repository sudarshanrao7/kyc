import React from 'react';
import { Provider } from 'react-redux';
import {  Route, IndexRoute, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { history } from '../../redux/store';
import AppContainer from './app';


export default class Root extends React.Component {
    constructor(props, context) {
        super(props, context);
    };
    render() {
            return (
                <Provider store={this.props.store}>
                    <ConnectedRouter history={history} key={new Date().getMilliseconds()}>
                        <Switch>
                            <Route path="/" component={AppContainer} />
                        </Switch>    
                    </ConnectedRouter>
                </Provider>
            );
    }
}
