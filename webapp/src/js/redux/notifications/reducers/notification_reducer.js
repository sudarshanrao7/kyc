const initialState = {
    message: "",
    title: "",
    type: "",
};

export default function notification(state=initialState, action){
    switch (action.type) {
        case 'NOTIFICATION_RECEIVE_MESSAGE':
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
};

