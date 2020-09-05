import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { ActionType, Room as RoomType, RoomPhase } from "../mahjong";
import Lobby from "./Lobby";
import Board from "../board/Board";
import Results from "./Results";
import { Helmet } from "react-helmet";

export default function Room({ room }: { room: RoomType }) {
  const { url } = useRouteMatch();

  const dispatch = async (type: ActionType, tiles: string[] = []) => {
    const resp = await fetch(`/api/rooms/${room.id}/actions`, {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nonce: room.nonce, type: type, tiles: tiles }),
    });
    if (!resp.ok) {
      const reason = await resp.text();
      alert(reason);
    }
  };

  return (
    <Switch>
      <Route path={`${url}/lobby`}>
        {room.phase === RoomPhase.InProgress ? (
          <Redirect to={`${url}/`} />
        ) : (
          <>
            <Helmet>
              <title>Lobby | {room.id} | Mahjong Party</title>
            </Helmet>
            <Lobby
              roomId={room.id}
              room={room}
              startGame={() => dispatch(ActionType.NextRound)}
            />
          </>
        )}
      </Route>
      <Route path={`${url}/results`}>
        <Results room={room} />
      </Route>
      <Route path={url}>
        {room.phase === RoomPhase.InProgress ? (
          <>
            <Helmet>
              <title>{room.id} | Mahjong Party</title>
            </Helmet>
            <Board
              nonce={room.nonce}
              players={room.players}
              round={room.round}
              dispatchAction={dispatch}
            />
          </>
        ) : room.phase === RoomPhase.Lobby ? (
          <Redirect to={`${url}/lobby`} />
        ) : (
          <Redirect to={`${url}/results`} />
        )}
      </Route>
    </Switch>
  );
}
