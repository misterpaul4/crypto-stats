import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from '../component/App';
import Header from '../component/Header';
import '../css/index.css';

const Routes = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route exact path="/" component={App} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
