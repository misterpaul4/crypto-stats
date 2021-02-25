import { combineReducers } from 'redux';
import DarkModeReducer from './darkmode';
import UpdateCryptoReducer from './cryptos';
import filterReducer from './filter';
import SortReducer from './sort';

const rootReducer = combineReducers({
  darkmode: DarkModeReducer,
  cryptos: UpdateCryptoReducer,
  filter: filterReducer,
  sort: SortReducer,
});

export default rootReducer;
