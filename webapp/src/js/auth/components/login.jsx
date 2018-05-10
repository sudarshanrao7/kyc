import BaseComponent from '../../utils/common_components/basecomponent';
import LoginTemplate from "./templates/login";
import { reduxForm } from 'redux-form';
import store,{history} from '../../redux/store';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { login } from '../../redux/auth/network/auth_network';
import Utils from '../../utils/utils';

class Login extends BaseComponent {
    constructor(props, context) {
        super(props, context);
        this.doLogin = this.doLogin.bind(this);
    }
    componentWillMount() {
        if (this.props.isAuthenticated) {
            history.push('/');
        }
    }

    doLogin(data) {
        this.props.login(data.email, data.password);
    }

    render() {
        return LoginTemplate.apply(this);
    }
}
const validate = (values) => {
    const errors = {};
    const requiredFields = ['email', 'password'];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required';
        }
    });
    //Need to install  validator, using regex for now
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address!';
    }
    return errors;
};

const LoginForm = reduxForm({ form: 'login', validate })(Login);
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        login,
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.authReducer.isAuthenticated,
        user: state.auth.authReducer.user,
    };
}

const LoginConnected = connect(mapStateToProps, mapDispatchToProps)(LoginForm);
export default LoginConnected;
