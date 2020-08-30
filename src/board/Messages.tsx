import React, { FunctionComponent } from "react";
import { Event, EventType, Player } from "../mahjong";
import Tile from "./Tile";

const Message: FunctionComponent<{
  players: Player[];
  event: Event;
}> = ({ players, event }) => {
  const timestamp = new Date(event.time);
  let tiles = event.tiles || [];
  let name = players[event.seat].name;
  let message: string;
  switch (event.type) {
    case EventType.Start:
      message = `Round started.`;
      break;
    case EventType.Draw:
      message = `${name} drew a tile.`;
      break;
    case EventType.Discard:
      message = `${name} discarded `;
      break;
    case EventType.Chi:
      message = `${name} chi-ed `;
      break;
    case EventType.Pong:
      message = `${name} pong-ed `;
      break;
    case EventType.Gang:
      message = `${name} gang-ed `;
      break;
    case EventType.Hu:
      message = `Round over. ${name} won!`;
      break;
    case EventType.End:
      message = `Round over. Nobody won.`;
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
