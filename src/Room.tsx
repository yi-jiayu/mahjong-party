import React, { SyntheticEvent, useEffect, useState } from "react";
import styles from "./App.module.css";
import { useHistory, useParams } from "react-router-dom";
import produce from "immer";
import NotFound from "./NotFound";
import Board from "./board/Board";
import { ActionType, Round } from "./mahjong";

const PHASE_NOT_FOUND = -1;
const PHASE_LOBBY = 0;
const PHASE_IN_PROGRESS = 1;

interface Player {
  name: string;
}

interface Room {
  inside: boolean;
  nonce: number;
  phase: number;
  players: Player[];
  round?: Round;
}

function JoinRoom({ roomId }: { roomId: string }) {
  const [name, setName] = useState("");

  const joinRoom = async (e: SyntheticEvent) => {
    e.preventDefault();
    await fetch(`/api/rooms/${roomId}/players`, {
      method: "post",
      credentials: "include",
      body: `name=${encodeURIComponent(name)}`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
  };

  return (
    <form onSubmit={joinRoom}>
      <input
        type="text"
        name="name"
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
        style={{ marginRight: "8px" }}
      />
      <input type="submit" value="Join room" />
    </form>
  );
}

function Lobby({
  roomId,
  room,
  startGame,
}: {
  roomId: string;
  room: Room;
  startGame: () => void;
}) {
  const history = useHistory();
  const { players, inside } = room;

  const leaveRoom = async () => {
    const resp = await fetch(`/api/rooms/${roomId}/players`, {
      method: "delete",
      credentials: "include",
    });
    if (resp.ok) {
      history.push("/");
    }
  };

  const addBot = async () => {
    const resp = await fetch(`/api/rooms/${roomId}/bots`, {
      method: "post",
      credentials: "include",
    });
    if (!resp.ok) {
      const reason = await resp.text();
      alert(reason);
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
          {players.length < 2 && <li>(empty)</li>}
          {players.length < 3 && <li>(empty)</li>}
          {players.length < 4 && <li>(empty)</li>}
        </ul>
      </div>
      {inside ? (
        <div className={styles.buttonRow}>
          <button type="button" onClick={leaveRoom}>
            Leave room
          </button>
          <button
            type="button"
            disabled={players.length === 4}
            onClick={addBot}>
            Add bot
          </button>
          <button
            type="button"
            disabled={players.length < 4}
            onClick={startGame}>
            Start game
          </button>
        </div>
      ) : (
        <JoinRoom roomId={roomId} />
      )}
    </main>
  );
}

export default function Room() {
  const { roomId }: { roomId: string } = useParams();
  const [room, setRoom] = useState<Room>({
    inside: false,
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

  const dispatch = async (type: ActionType, tiles: string[] = []) => {
    const resp = await fetch(`/api/rooms/${roomId}/actions`, {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nonce: room.nonce, type: type, tiles: tiles }),
    });
    if (!resp.ok) {
      const reason = await resp.text();
      alert(reason);
    }
  };

  switch (room.phase) {
    case PHASE_LOBBY:
      return (
        <Lobby
          roomId={roomId}
          room={room}
          startGame={() => dispatch(ActionType.NextRound)}
        />
      );
    case PHASE_IN_PROGRESS:
      if (room.round) {
        return (
          <Board
            nonce={room.nonce}
            players={room.players}
            round={room.round}
            dispatchAction={dispatch}
          />
        );
      }
      break;
    case PHASE_NOT_FOUND:
      return <NotFound />;
  }
}
