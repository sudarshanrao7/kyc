let initialState = {
    menu_open:true,
    pinned:true,
};
export default function menu(state = initialState, action) {
    switch (action.type) {
        case "UPDATE_MENU_OPEN":
            return Object.assign({}, state, {
                menu_open: action.menu_open,
            });        
        case "UPDATE_MENU_PINNED":
            return Object.assign({}, state, {
                 pinned: action.pinned,
            });
        default:
            return state;
    }
}
