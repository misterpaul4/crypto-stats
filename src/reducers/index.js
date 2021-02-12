import { combineReducers } from 'redux';
import DisplayModeReducer from './display';

const rootReducer = combineReducers({
  display: DisplayModeReducer,
});

export default rootReducer;
