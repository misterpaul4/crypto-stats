/* eslint-disable max-len */
/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import Routes from './routes';

const displayModeInitialState = {
  darkmode: false,
};

const store = createStore(rootReducer, { darkmode: displayModeInitialState });

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
