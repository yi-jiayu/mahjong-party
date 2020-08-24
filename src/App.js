import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";

import "./App.css";
import Home from "./Home";
import Room from "./Room";
import NotFound from "./NotFound";
import Tutorial from "./Tutorial";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { self: {} };
  }

  async componentDidMount() {
    const resp = await fetch("/api/self", { credentials: "include" });
    const self = await resp.json();
    this.setState({ self });
  }

  render() {
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
            <Route exact path="/">
              <Home self={this.state.self} />
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
}

function Rooms() {
  let match = useRouteMatch();

  return (
    <>
      <Switch>
        <Route path={`${match.path}/:roomId`}>
          <Room />
        </Route>
      </Switch>
    </>
  );
}

export default App;
