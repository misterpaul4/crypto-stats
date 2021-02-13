import { combineReducers } from 'redux';
import DarkModeReducer from './darkmode';

const rootReducer = combineReducers({
  darkmode: DarkModeReducer,
});

export default rootReducer;
