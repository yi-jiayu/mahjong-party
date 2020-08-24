import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import NotFound from "./NotFound";
import Board, { Rack } from "./Board";
import ReadOnlyBoard from "./ReadOnlyBoard";
import { DIRECTIONS } from "./mahjong";

function Lobby({ roomId, players, doAction }) {
  const addBot = async () => {
    await fetch(`/api/rooms/${roomId}/bots`, {
      method: "post",
      credentials: "include",
    });
  };

  return (
    <>
      <h1>{roomId}</h1>
      <p>Current players:</p>
      <ul>
        {players.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {players.length < 4 && <button onClick={addBot}>Add bot</button>}
      {players.length === 4 && (
        <button onClick={() => doAction("start", null)}>Start game</button>
      )}
    </>
  );
}

export function RoundOver({ players, round, results, doAction }) {
  const { current_turn: winner } = round;
  return (
    <>
      <h2>Round over!</h2>
      {winner === -1 ? "It was a draw!" : `${players[winner]} won!`}
      {winner !== -1 && <Rack tiles={round.hands[winner].revealed} />}
      <button type="button" onClick={() => doAction("next round")}>
        Next round
      </button>
      <div>
        <h3>Previous round results</h3>
        <table className="results">
          <thead>
            <tr>
              <th>Round</th>
              <th>Dealer</th>
              <th>Wind</th>
              <th>Winner</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {[...results]
              .reverse()
              .map(({ dealer, prevailing_wind, winner, points }, i) => (
                <tr key={results.length - i}>
                  <td>{results.length - i}</td>
                  <td>{players[dealer]}</td>
                  <td>{DIRECTIONS[prevailing_wind]}</td>
                  <td>{winner !== -1 ? players[winner] : "No winner"}</td>
                  <td>{points}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Room() {
  const { roomId } = useParams();
  const [room, setRoom] = useState({
    seat: -1,
    nonce: 0,
    players: [],
    round: null,
    results: [],
  });
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const eventSource = new EventSource(`/api/rooms/${roomId}/live`);
    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        setPhase(-1);
      }
    };
    eventSource.onmessage = async (e) => {
      const { seat, nonce, phase, players, round, results } = JSON.parse(
        e.data
      );
      // room has to be set before phase
      setRoom({ seat, nonce, players, round, results });
      setPhase(phase);
    };
    return () => eventSource.close();
  }, [roomId]);

  const doAction = async (type, tiles, melds) => {
    const action = {
      nonce: room.nonce,
      type,
      tiles,
      melds,
    };
    return await fetch(`/api/rooms/${roomId}/actions`, {
      method: "post",
      credentials: "include",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(action),
    });
  };

  switch (phase) {
    case 0:
      return (
        <Lobby roomId={roomId} players={room.players} doAction={doAction} />
      );
    case 1:
      if (room.seat !== -1) {
        return (
          <Board
            nonce={room.nonce}
            players={room.players}
            round={room.round}
            seat={room.seat}
            doAction={doAction}
          />
        );
      } else {
        return <ReadOnlyBoard players={room.players} round={room.round} />;
      }
    case 2:
      return (
        <RoundOver
          players={room.players}
          round={room.round}
          results={room.results}
          doAction={doAction}
        />
      );
    default:
      return <NotFound />;
  }
}

export default Room;
