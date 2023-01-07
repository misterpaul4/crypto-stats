import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Header from "../component/Header";
import "../css/index.css";
import "antd/dist/reset.css";
import AppWrapper from "../containers/AppWrapper";

const Routes = () => (
  <BrowserRouter>
    <Header />
    <Switch>
      <Route exact path="/" component={AppWrapper} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
