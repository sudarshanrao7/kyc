import React from 'react';
import {Panel,Layout} from 'react-toolbox';
import store,{history} from '../../redux/store';
import Axios from '../network/axios';
import Utils from '../utils';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  

    componentDidCatch(error,info){
        if(__DEV__) {
            console.log(error);
            console.log("error stack *********");
            console.log(error.stack);
            console.log("error stack !!!!!!!!!!!");
            console.log(info);
            this.setState({ hasError: true,error:error});
            Utils.showErrorAlert("Oops.. Looks like we have an error. Check Console!");
        }else{
            Utils.showErrorAlert("Oops.. Looks like we have an error. Redirecting to home page");
            const url = "/1/home/client_error";
            let errorObject = {};
            errorObject["error"] = error.stack;
            errorObject["info"] = info;
            errorObject["props"] = this.props;
            console.log(errorObject);
            Axios.post(url, {error: JSON.stringify(errorObject)});
            history.push("/");
        }
     }


  
    render() {
      if (this.state.hasError) {
        return  ( 
            <Layout>
                <Panel className="full-panel bg-danger c-white" >
                        <h1 >Something went wrong.</h1>
                        <p>
                            {this.state.error.stack}
                        </p>
                </Panel>
            </Layout>
        );
      }
      return this.props.children;
    }
  }