import React from 'react';
import {Route, Switch} from "react-router-dom";
import Wrapper from "../common/Wrapper";
import {
  FileHandlerAsync,
  NotFoundAsync,
  UsersHandlerAsync,
  WelcomeAsync
} from "../asyncPagesLoader";

function Application() {
  return (
    <Wrapper>
      <Switch>
        <Route exact path="/" component={WelcomeAsync} />
        <Route path="/files" component={FileHandlerAsync} />
        <Route path="/users" component={UsersHandlerAsync} />
        <Route component={NotFoundAsync} />
      </Switch>
  </Wrapper>
  );
}

export default Application;
