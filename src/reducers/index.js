import { combineReducers } from 'redux';
import DarkModeReducer from './darkmode';
import UpdateCryptoReducer from './cryptos';

const rootReducer = combineReducers({
  darkmode: DarkModeReducer,
  cryptos: UpdateCryptoReducer,
});

export default rootReducer;
