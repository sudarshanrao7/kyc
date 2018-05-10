let initialState = {
    isUpdatingServer: false,
};
export default function internetProgress(state = initialState, action) {
    switch (action.type) {
        case "SHOW_INTERNET_PROGRESS":
            return Object.assign({}, state, {
                isUpdatingServer: true
            });
        case "HIDE_INTERNET_PROGRESS":
            return Object.assign({}, state, {
                isUpdatingServer: false
            });
        default:
            return state;
    }
}
