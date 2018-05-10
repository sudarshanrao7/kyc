import {Route} from 'react-router-dom';

export default class AsyncRoute extends Route {  
    static defaultProps = {
        getComponents(location, callback) {
            System.import(this.async).then((mod) => {
                callback(null, mod.default);
            });
        },
        getChildRoutes (location, callback) {
            callback(null, this.children || []);
        }
    }
}