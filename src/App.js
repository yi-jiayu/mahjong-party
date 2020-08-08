import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useParams,
  useHistory
} from "react-router-dom";

import Board from './Board';

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

function Lobby({roomId, players}) {
  const startGame = async () => {
    await fetch(`http://localhost:8080/rooms/${roomId}/start`, {method: 'post', credentials: "include"});
  }

  return <>
    <h1>{roomId}</h1>
    <p>Current players:</p>
    <ul>
      {players.map(p => <li key={p}>{p}</li>)}
    </ul>
    {players.length === 4 && <button onClick={startGame}>Start game</button>}
  </>;
}

function Room() {
  const {roomId} = useParams();
  const [players, setPlayers] = useState([]);
  const [phase, setPhase] = useState(0);
  const [round, setRound] = useState(null);
  const [self, setSelf] = useState({});

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:8080/rooms/${roomId}/live`);
    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        setPhase(-1);
      }
    }
    eventSource.onmessage = async e => {
      const {phase, players, round} = JSON.parse(e.data);
      setPlayers(players);
      setRound(round);
      setPhase(phase);
      if (phase === 1) {
        const resp = await fetch(`http://localhost:8080/rooms/${roomId}/self`, {credentials: "include"})
        const self = await resp.json();
        setSelf(self);
      }
    };
    return () => eventSource.close();
  }, [roomId])

  switch (phase) {
    case 0:
      return <Lobby roomId={roomId} players={players}/>;
    case 1:
      return <Board players={players} round={round} self={self}/>
    default:
      return <NotFound/>
  }
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