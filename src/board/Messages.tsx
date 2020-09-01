import React, {
  CSSProperties,
  FunctionComponent,
  useEffect,
  useRef,
} from "react";
import { Event, EventType, Player } from "../mahjong";
import Tile from "./Tile";
import { FixedSizeList } from "react-window";

const Message: FunctionComponent<{
  players: Player[];
  event: Event;
  style: CSSProperties;
}> = ({ players, event, style }) => {
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
    <div style={style} className="message">
      <span style={{ marginRight: "8px" }}>
        {timestamp.toLocaleTimeString()} {message}
      </span>
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
  const ref = useRef<FixedSizeList>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollToItem(events.length - 1);
    }
  });

  return (
    <FixedSizeList
      ref={ref}
      itemSize={32}
      height={160}
      itemCount={events.length}
      width={"100%"}
      className="messages">
      {({ index, style }) => (
        <Message players={players} event={events[index]} style={style} />
      )}
    </FixedSizeList>
  );
};

export default Messages;
