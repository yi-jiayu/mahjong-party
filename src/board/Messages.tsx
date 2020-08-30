import React, { FunctionComponent } from "react";
import { Event, EventType, Player } from "../mahjong";
import Tile from "./Tile";

const Message: FunctionComponent<{
  players: Player[];
  event: Event;
}> = ({ players, event }) => {
  const timestamp = new Date(event.time);
  let message = `${players[event.seat].name} `;
  let tiles = event.tiles || [];
  switch (event.type) {
    case EventType.Draw:
      message += "drew a tile.";
      break;
    case EventType.Discard:
      message += "discarded ";
      break;
    case EventType.Chi:
      message += "chi-ed ";
      break;
    case EventType.Pong:
      message += "pong-ed ";
      break;
    case EventType.Gang:
      message += "gang-ed ";
      break;
  }
  return (
    <div className="message">
      <span>{timestamp.toLocaleTimeString()}</span> {message}
      {tiles.map((tile, index) => (
        <Tile tile={tile} inline={true} key={index} />
      ))}
    </div>
  );
};

const Messages: FunctionComponent<{
  players: Player[];
  events: Event[];
}> = ({ players, events }) => {
  return (
    <div className="messages">
      {events
        .map((event, index) => (
          <Message players={players} event={event} key={index} />
        ))
        .reverse()}
    </div>
  );
};

export default Messages;
