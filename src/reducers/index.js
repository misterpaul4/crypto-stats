import { combineReducers } from 'redux';
import DarkModeReducer from './darkmode';
import UpdateCryptoReducer from './cryptos';
import filterReducer from './filter';

const rootReducer = combineReducers({
  darkmode: DarkModeReducer,
  cryptos: UpdateCryptoReducer,
  filter: filterReducer,
});

export default rootReducer;
