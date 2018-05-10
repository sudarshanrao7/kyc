import React from 'react';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import {resetNotification} from '../../redux/notifications/actions/notification_creator';
import store,{history} from '../../redux/store';
class Notification extends React.PureComponent   {

    constructor(props) {
        super(props);
        this.addAlert = this.addAlert.bind(this);
    }

    componentWillReceiveProps(nextprops) {
        if (this.props.notification.message !== nextprops.notification.message &&
            nextprops.notification.message !== "") {
            this.addAlert(nextprops.notification);
            store.dispatch(resetNotification());
        }
    }

    render() {
        return (
            <ToastContainer 
            className="toast-container toast-top-right"
            ref="toastrcontainer"
            position="top-right"
            type="default"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
          />
        );
    }

    addAlert(message) {
        if(message.type === "error"){
           toast.error(
                message.message
            );
        }else if(message.type === "success"){
            toast.success(
                message.message,
            );
        }else if(message.type === "warning"){
            toast.warning(
                message.message,
            );
        }else if(message.type === "info"){
            toast.info(
                message.message,
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        notification: state.notificationReducer
    };
}

const ConnectedNotification = connect(mapStateToProps)(Notification);
export default ConnectedNotification;