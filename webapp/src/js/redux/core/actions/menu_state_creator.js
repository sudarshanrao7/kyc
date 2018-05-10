

// Action Creators
const updateMenuOpen = (menu_open) => ({ type: 'UPDATE_MENU_OPEN', menu_open });
const updateMenuPinned = (pinned) => ({ type: 'UPDATE_MENU_PINNED', pinned });

let actionCreators = {
    updateMenuOpen: updateMenuOpen,
    updateMenuPinned: updateMenuPinned,
};

export default actionCreators;