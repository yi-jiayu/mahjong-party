import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";

import NotFound from "./NotFound";
import Board from "./Board";

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
  const [room, setRoom] = useState({players: [], round: null})
  const [phase, setPhase] = useState(0);
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
      // room has to be set before phase
      setRoom({players, round});
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
      return <Lobby roomId={roomId} players={room.players}/>;
    case 1:
      return <Board players={room.players} round={room.round} self={self}/>
    default:
      return <NotFound/>
  }
}

export default Room;