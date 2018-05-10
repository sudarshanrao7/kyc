import { combineReducers } from 'redux';
import appMenu from './app_menu_reducer';
import progressReducer from './progress_reducer';

export default combineReducers({
                                appMenu,
                                progressReducer,
                            });