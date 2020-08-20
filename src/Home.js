import React, {useState} from "react";
import {Link, useHistory} from "react-router-dom";

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
      <input type="text" size="4" aria-label="Room ID" placeholder="Room ID" value={roomId}
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
    <div className="party">
      <span role="img" aria-label="Mahjong Party">🀄🎉</span>
      <span role="img" aria-label="Mahjong Party">🎈🎊</span>
    </div>
    <h1>Mahjong Party</h1>
    <p>Play Singaporean mahjong online with friends!</p>
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
    <p>Check out the tutorial to get started, or create a room and invite your friends to join you. Not enough players?
      Fill in the empty slots with bots!</p>
    <p>Mahjong Party is a work in progress.</p>
    <p>All mahjong tile images are sourced from <a
      href="https://commons.wikimedia.org/wiki/Category:SVG_Oblique_illustrations_of_Mahjong_tiles"
      title="via Wikimedia Commons">Cangjie6</a> / <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA</a>
    </p>
  </main>;
}