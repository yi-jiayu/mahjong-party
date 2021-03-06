import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useRouteMatch,
} from "react-router-dom";

import "./App.css";
import Home from "./Home";
import NotFound from "./NotFound";
import Tutorial from "./Tutorial";
import Subscription from "./room/Subscription";

function App() {
  return (
    <Router>
      <Route
        path="/"
        render={({ location }) => {
          if (typeof window.ga === "function") {
            window.ga("set", "page", location.pathname + location.search);
            window.ga("send", "pageview");
          }
        }}
      />
      <div>
        <Switch>
          <Route exact path={["/", "/host", "/join", "/about"]}>
            <Home />
          </Route>
          <Route path="/rooms">
            <Rooms />
          </Route>
          <Route path="/tutorial">
            <Tutorial />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Rooms() {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${match.path}/`}>
        <NotFound />
      </Route>
      <Route path={`${match.path}/:roomId`}>
        <Subscription />
      </Route>
    </Switch>
  );
}

export default App;
