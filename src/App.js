import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useHistory
} from "react-router-dom";

import Room from './Room';
import NotFound from "./NotFound";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {self: {}}
  }

  async componentDidMount() {
    const resp = await fetch('http://localhost:8080/self', {credentials: "include"});
    const self = await resp.json();
    this.setState({self});
  }

  render() {
    return (
        <Router>
          <div>
            <Switch>
              <Route exact path="/">
                <Home self={this.state.self}/>
              </Route>
              <Route path="/rooms">
                <Rooms/>
              </Route>
              <Route path="*">
                <NotFound/>
              </Route>
            </Switch>
          </div>
        </Router>
    );
  }
}

function JoinRoom() {
  let history = useHistory();
  let [roomId, setRoomId] = useState('');

  const joinRoom = async e => {
    e.preventDefault();
    const resp = await fetch(`http://localhost:8080/rooms/${roomId}/players`, {method: 'post', credentials: "include"});
    if (resp.status === 200) {
      history.push(`/rooms/${roomId}`);
    }
  };

  return <div>
    <form onSubmit={joinRoom}>
      <label>Room ID:
        <input type="text" value={roomId} onChange={e => setRoomId(e.target.value)}/>
      </label>
      <input type="submit" value="Join room"/>
    </form>
  </div>;
}

function Home({self}) {
  let history = useHistory();

  const createRoom = async () => {
    const resp = await fetch('http://localhost:8080/rooms', {method: 'post', credentials: "include"});
    const {room_id: roomId} = await resp.json();
    history.push(`/rooms/${roomId}`);
  };

  return <>
    <h1>Mahjong</h1>
    <p>{self.name ? `Welcome, ${self.name}!` : 'Welcome!'}</p>
    <div>
      <button onClick={createRoom}>Create room</button>
    </div>
    <JoinRoom/>
  </>;
}

function Rooms() {
  let match = useRouteMatch();

  return <>
    <Switch>
      <Route path={`${match.path}/:roomId`}>
        <Room/>
      </Route>
    </Switch>
  </>;
}

export default App;