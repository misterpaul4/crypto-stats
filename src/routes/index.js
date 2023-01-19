import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "../css/index.css";
import "antd/dist/reset.css";
import { PATHS } from "../paths";
import FavouritesPage from "../pages/Favourites";
import Header from "../app/component/Header";
import CryptocurrencyPage from "../pages/Cryptocurrencies";
import ExchangesPage from "../pages/Exchanges";
import CryptoDetails from "../pages/Cryptocurrencies/components/Details";

function Routes() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path={PATHS.home} component={CryptocurrencyPage} />
        <Route exact path={PATHS.favourites} component={FavouritesPage} />
        <Route exact path={PATHS.exchanges} component={ExchangesPage} />
        <Route exact path={PATHS.cryptoDetails()} component={CryptoDetails} />
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;
