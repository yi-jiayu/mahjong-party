import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useParams,
  useHistory
} from "react-router-dom";

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
              <Route path="/rooms">
                <Rooms/>
              </Route>
              <Route exact path="/">
                <Home self={this.state.self}/>
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

function NotFound() {
  return <h1>Not Found</h1>;
}

function Home({self}) {
  let history = useHistory();
  let [roomId, setRoomId] = useState('');

  const createRoom = async () => {
    const resp = await fetch('http://localhost:8080/rooms', {method: 'post', credentials: "include"});
    const {room_id: roomId} = await resp.json();
    history.push(`/rooms/${roomId}`);
  };

  const handleChange = ({target: {value}}) => {
    setRoomId(value);
  };

  const joinRoom = async e => {
    e.preventDefault();
    const resp = await fetch(`http://localhost:8080/rooms/${roomId}/players`, {method: 'post', credentials: "include"});
    if (resp.status === 200) {
      history.push(`/rooms/${roomId}`);
    }
  };

  return <>
    <h1>Mahjong</h1>
    <p>{self.name ? `Welcome, ${self.name}!` : 'Welcome!'}</p>
    <div>
      <button onClick={createRoom}>Create room</button>
    </div>
    <div>
      <form onSubmit={joinRoom}>
        <label>Room ID:
          <input type="text" value={roomId} onChange={handleChange}/>
        </label>
        <input type="submit" value="Join room"/>
      </form>
    </div>
  </>
      ;
}

function Room() {
  const {roomId} = useParams();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:8080/rooms/${roomId}/live`);
    eventSource.onmessage = e => {
      const {players} = JSON.parse(e.data);
      setPlayers(players.map(p => <li key={p}>{p}</li>));
      return () => eventSource.close();
    };
  }, [roomId])

  return <>
    <h1>{roomId}</h1>
    <p>Current players:</p>
    <ul>
      {players}
    </ul>
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