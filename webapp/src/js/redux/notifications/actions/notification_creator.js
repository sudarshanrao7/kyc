
export function resetNotification() {
    return {
        type: "NOTIFICATION_RECEIVE_MESSAGE",
        payload: Object.assign({}, {
            title: "",
            message: "",
            type: ""
        })
    };
}

export function displayNotification(title, message,type) {
    return {
        type: "NOTIFICATION_RECEIVE_MESSAGE",
        payload: Object.assign({}, {
            title: title,
            message: message,
            type: type,
        })
    };
}