import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import NotFound from "./NotFound";
import Board, { Rack } from "./Board";
import ReadOnlyBoard from "./ReadOnlyBoard";

function Lobby({roomId, players, doAction}) {
  const addBot = async () => {
    await fetch(`/api/rooms/${roomId}/bots`, {method: 'post', credentials: "include"})
  }

  return <>
    <h1>{roomId}</h1>
    <p>Current players:</p>
    <ul>
      {players.map(p => <li key={p}>{p}</li>)}
    </ul>
    {players.length < 4 && <button onClick={addBot}>Add bot</button>}
    {players.length === 4 && <button onClick={() => doAction('start', null)}>Start game</button>}
  </>;
}

export function RoundOver({players, round}) {
  const {current_turn: winner} = round;
  return <>
    <h2>Round over!</h2>
    {winner === -1 ? "It was a draw!" : `${players[winner]} won!`}
    {winner !== -1 && <Rack tiles={round.hands[winner].concealed}/>}
  </>;
}

function Room() {
  const {roomId} = useParams();
  const [room, setRoom] = useState({seat: -1, nonce: 0, players: [], round: null})
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource(`/api/rooms/${roomId}/live`);
    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        setPhase(-1);
      }
    }
    eventSource.onmessage = async e => {
      const {seat, nonce, phase, players, round} = JSON.parse(e.data);
      // room has to be set before phase
      setRoom({seat, nonce, players, round});
      setPhase(phase);
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
      if (room.seat !== -1) {
        return <Board nonce={room.nonce} players={room.players} round={room.round} seat={room.seat}
                      doAction={doAction}/>;
      } else {
        return <ReadOnlyBoard players={room.players} round={room.round}/>
      }
    case 2:
      return <RoundOver players={room.players} round={room.round}/>;
    default:
      return <NotFound/>;
  }
}

export default Room;