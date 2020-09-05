import React, { SyntheticEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "../App.module.css";
import { Room } from "../mahjong";

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

export default function Lobby({
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
