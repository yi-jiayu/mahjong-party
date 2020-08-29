import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import { useHistory, useParams } from "react-router-dom";
import produce from "immer";
import NotFound from "./NotFound";
import Board from "./Board";
import { Round } from "./mahjong";

const PHASE_NOT_FOUND = -1;
const PHASE_LOBBY = 0;
const PHASE_IN_PROGRESS = 1;

interface Player {
  name: string;
}

interface Room {
  nonce: number;
  phase: number;
  players: Player[];
  round?: Round;
}

function EmptySeat() {
  return (
    <li>
      <button disabled={true}>Empty</button>
    </li>
  );
}

function Lobby({
  roomId,
  players,
  startGame,
}: {
  roomId: string;
  players: Player[];
  startGame: () => void;
}) {
  const history = useHistory();

  const leaveRoom = async () => {
    const resp = await fetch(`/api/rooms/${roomId}/players`, {
      method: "delete",
      credentials: "include",
    });
    if (resp.ok) {
      history.push("/");
    }
  };

  return (
    <main>
      <h2>{roomId}</h2>
      <div>
        <h3>Players</h3>
        <ul>
          {players.map(({ name }) => (
            <li key={name}>{name}</li>
          ))}
          {players.length < 2 && <EmptySeat />}
          {players.length < 3 && <EmptySeat />}
          {players.length < 4 && <EmptySeat />}
        </ul>
      </div>
      <div className={styles.buttonRow}>
        <button type="button" onClick={leaveRoom}>
          Leave room
        </button>
        <button type="button" disabled={players.length < 4} onClick={startGame}>
          Start game
        </button>
      </div>
    </main>
  );
}

export default function Room() {
  const { roomId }: { roomId: string } = useParams();
  const [room, setRoom] = useState<Room>({
    nonce: 0,
    phase: PHASE_LOBBY,
    players: [],
  });

  useEffect(() => {
    document.title = `${roomId} | Mahjong Party`;
    const eventSource = new EventSource(`/api/rooms/${roomId}/live`);
    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        setRoom((room) =>
          produce(room, (draft) => {
            draft.phase = PHASE_NOT_FOUND;
          })
        );
      }
    };
    eventSource.onmessage = async (e) => {
      const room = JSON.parse(e.data);
      setRoom(room);
    };
    return () => eventSource.close();
  }, [roomId]);

  const startGame = async () => {
    await fetch(`/api/rooms/${roomId}/actions`, {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nonce: room.nonce, type: "next" }),
    });
  };

  switch (room.phase) {
    case PHASE_LOBBY:
      return (
        <Lobby roomId={roomId} players={room.players} startGame={startGame} />
      );
    case PHASE_IN_PROGRESS:
      if (room.round) {
        return <Board players={room.players} round={room.round} />;
      }
      break;
    case PHASE_NOT_FOUND:
      return <NotFound />;
  }
}
