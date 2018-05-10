import 'babel-polyfill';
import 'react-toolbox/lib/commons.scss';
import $ from 'jquery';
import  React  from 'react';
import  ReactDOM from 'react-dom';
import Root from './core/components/root';
import store from './redux/store';
import Utils from './utils/utils';
//import 'normalize.css';
import 'flexboxgrid/dist/flexboxgrid.css';
import {AppContainer} from 'react-hot-loader';
import reactable from './vendor/reactable/reactable.jsx';
import './vendor/reactable/reactable.less';
import  '../styles/index.less';

const router = (
<AppContainer>  
    <Root store={store} />
</AppContainer>
);


ReactDOM.render(router,
  document.getElementById('react-app')
);

if (module && module.hot && __DEV__) {
  module.hot.accept("./core/components/root", () => {
    const NextApp = require("./core/components/root").default;
    ReactDOM.render(
      <AppContainer>
        <NextApp store={store} />
      </AppContainer>
      ,
       document.getElementById('react-app')
    );
  });
} 
