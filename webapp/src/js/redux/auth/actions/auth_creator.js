// Action Creators
const authSuccess = (response) => ({ type: 'AUTH_LOGIN_SUCCESS', response });
const authFailure = (error) => ({ type: 'AUTH_FAILURE', error });
const updateAuthUser = (user) => ({ type: 'AUTH_UPDATE_USER', user });
const doLogout = () => ({ type: 'AUTH_USER_LOGOUT' });

let actionCreators = {
    authSuccess: authSuccess,
    authFailure: authFailure,
    updateAuthUser: updateAuthUser,
    doLogout:doLogout
};

export default actionCreators;