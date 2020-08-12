import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import NotFound from "./NotFound";
import Board from "./Board";

function Lobby({roomId, players, doAction}) {
  return <>
    <h1>{roomId}</h1>
    <p>Current players:</p>
    <ul>
      {players.map(p => <li key={p}>{p}</li>)}
    </ul>
    {players.length === 4 && <button onClick={() => doAction('start', null)}>Start game</button>}
  </>;
}

function RoundOver({players, round}) {
  const {current_turn: winner} = round;
  return <>
    <h2>Round over!</h2>
    {players[winner]} won!
  </>;
}

function Room() {
  const {roomId} = useParams();
  const [room, setRoom] = useState({nonce: 0, players: [], round: null})
  const [phase, setPhase] = useState(0);
  const [self, setSelf] = useState({});

  useEffect(() => {
    const eventSource = new EventSource(`/api/rooms/${roomId}/live`);
    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        setPhase(-1);
      }
    }
    eventSource.onmessage = async e => {
      const {nonce, phase, players, round} = JSON.parse(e.data);
      // room has to be set before phase
      setRoom({nonce, players, round});
      setPhase(phase);
      if (phase === 1) {
        const resp = await fetch(`/api/rooms/${roomId}/self`, {credentials: "include"})
        const self = await resp.json();
        setSelf(self);
      }
    };
    return () => eventSource.close();
  }, [roomId])

  const doAction = async (type, tiles, melds) => {
    const action = {
      nonce: room.nonce,
      type,
      tiles,
      melds
    }
    return await fetch(`/api/rooms/${roomId}/actions`, {
      method: 'post',
      credentials: "include",
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(action),
    });
  }

  switch (phase) {
    case 0:
      return <Lobby roomId={roomId} players={room.players} doAction={doAction}/>;
    case 1:
      return <Board players={room.players} round={room.round} self={self} doAction={doAction}/>
    case 2:
      return <RoundOver players={room.players} round={room.round}/>
    default:
      return <NotFound/>
  }
}

export default Room;