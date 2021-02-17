import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from '../containers/App';
import Header from '../component/Header';
import CryptoPage from '../component/CryptoPage';
import '../css/index.css';

const Routes = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/cryptostat/:id" component={CryptoPage} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
