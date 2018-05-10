let initialState = {
    isAuthenticated: false,
    user: {},
};
export default function auth(state = initialState, action) {
    switch (action.type) {        
        case "AUTH_LOGIN_SUCCESS":
            return Object.assign({}, state, {
                isAuthenticated: true,
                isTokenAvailable: true
            });
        case "AUTH_FAILURE":
            return Object.assign({}, initialState);
        case "AUTH_UPDATE_USER":
            return Object.assign({}, state, { user: action.user });
        default:
            return state;
    }
}
