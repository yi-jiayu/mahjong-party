import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import './home.css';

function JoinRoom() {
  let history = useHistory();
  let [roomId, setRoomId] = useState('');

  const joinRoom = async e => {
    e.preventDefault();
    const resp = await fetch(`/api/rooms/${roomId}/players`, {method: 'post', credentials: "include"});
    if (resp.status === 200) {
      history.push(`/rooms/${roomId}`);
    }
  };

  return <div>
    <form onSubmit={joinRoom}>
      <input type="text" aria-label="Room ID" placeholder="Room ID" value={roomId}
             onChange={e => setRoomId(e.target.value)}/>
      <input type="submit" value="Join room"/>
    </form>
  </div>;
}

export default function Home({self}) {
  let history = useHistory();

  const createRoom = async () => {
    const resp = await fetch('/api/rooms', {method: 'post', credentials: "include"});
    const {room_id: roomId} = await resp.json();
    history.push(`/rooms/${roomId}`);
  };

  return <main>
    <div className="party"><span role="img" aria-label="Mahjong Party">🀄🎉🎈🎊</span></div>
    <h1>Mahjong Party</h1>
    <p>{self.name ? `Welcome, ${self.name}!` : 'Welcome!'}</p>
    <div>
      <Link to="/tutorial">
        <button type="button">Tutorial</button>
      </Link>
    </div>
    <div>
      <button type="button" onClick={createRoom}>Create room</button>
    </div>
    <JoinRoom/>
  </main>;
}