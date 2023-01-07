import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "../css/index.css";
import "antd/dist/reset.css";
import { PATHS } from "../paths";
import FavouritesPage from "../pages/Favourites";
import Header from "../app/component/Header";
import CryptocurrencyPage from "../pages/Cryptocurrencies";

const Routes = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route exact path="/" component={CryptocurrencyPage} />
      <Route exact path={PATHS.favourites} component={FavouritesPage} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
