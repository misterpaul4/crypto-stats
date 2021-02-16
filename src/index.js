/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';
import Routes from './routes';

const store = createStore(
  rootReducer,
  {
    darkmode: { darkmode: false },
    sort: { asc: false },
    filter: {
      filter: {
        filter: 'All',
        duration: null,
      },
    },
  },
);

// console.log(store.getState());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Routes />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
