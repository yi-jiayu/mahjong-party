import React, { SyntheticEvent, useState } from "react";
import { Link, Route, Switch, useHistory } from "react-router-dom";

import styles from "./Home.module.css";

function HostGame() {
  const history = useHistory();
  const [name, setName] = useState("");

  const hostGame = async (e: SyntheticEvent) => {
    e.preventDefault();
    const resp = await fetch("/api/rooms", {
      method: "post",
      credentials: "include",
      body: `name=${name}`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    const { room_id: roomId } = await resp.json();
    history.replace(`/rooms/${roomId}`);
  };

  return (
    <>
      <h2>Host a new game</h2>
      <form onSubmit={hostGame} autoComplete="off">
        <label htmlFor="input_HostGame_name">Your name</label>
        <input
          type="text"
          name="name"
          id="input_HostGame_name"
          onChange={(e) => setName(e.target.value)}
          pattern="[0-9A-Za-z]+"
          required
        />
        <div>
          <input type="submit" value="Host" />
        </div>
      </form>
      <Link to="/">Back</Link>
    </>
  );
}

function JoinGame() {
  const history = useHistory();

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const joinGame = async (e: SyntheticEvent) => {
    e.preventDefault();
    const resp = await fetch(`/api/rooms/${room}`, {
      method: "post",
      credentials: "include",
      body: `name=${encodeURIComponent(name)}`,
      headers: { "content-type": "application/x-www-form-urlencoded" },
    });
    if (resp.status === 200) {
      history.replace(`/rooms/${room}`);
    }
  };

  return (
    <>
      <h2>Join an existing game</h2>
      <form onSubmit={joinGame} autoComplete="off">
        <label htmlFor="input_JoinGame_name">Your name</label>
        <input
          type="text"
          name="name"
          id="input_HostGame_name"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="input_JoinGame_roomId">Room ID</label>
        <input
          type="text"
          name="room"
          id="input_HostGame_room"
          onChange={(e) => setRoom(e.target.value)}
        />
        <div>
          <input type="submit" value="Join" />
        </div>
      </form>
      <Link to="/">Back</Link>
    </>
  );
}

function About() {
  return (
    <>
      <h2>About Mahjong Party</h2>
      <p>Mahjong Party is a work in progress.</p>
      <p>
        Find Mahjong Party on GitHub:{" "}
        <a href="https://github.com/yi-jiayu/mahjong-party">
          https://github.com/yi-jiayu/mahjong-party
        </a>
        .
      </p>
      <p>
        All mahjong tile images are sourced from{" "}
        <a
          href="https://commons.wikimedia.org/wiki/Category:SVG_Oblique_illustrations_of_Mahjong_tiles"
          title="via Wikimedia Commons">
          Cangjie6
        </a>{" "}
        / <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA</a>.
      </p>
      <Link to="/">Back</Link>
    </>
  );
}

export default function Home() {
  return (
    <main className={styles.main}>
      <Switch>
        <Route exact path="/">
          <div className={styles.party}>
            <span role="img" aria-label="Mahjong Party">
              🀄🎉
            </span>
            <span role="img" aria-label="Mahjong Party">
              🎈🎊
            </span>
          </div>
          <h1>Mahjong Party</h1>
          <p>Play Singaporean mahjong online with friends!</p>
          <Link to="/tutorial">Tutorial</Link>
          <Link to="/host">Host game</Link>
          <Link to="/join">Join game</Link>
          <Link to="/about">About</Link>
        </Route>
        <Route path="/host">
          <HostGame />
        </Route>
        <Route path="/join">
          <JoinGame />
        </Route>
        <Route path="/about">
          <About />
        </Route>
      </Switch>
    </main>
  );
}
