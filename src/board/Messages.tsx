import React, {
  CSSProperties,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Event, EventType, Player } from "../mahjong";
import Tile from "./Tile";
import { FixedSizeList } from "react-window";
import SpeechSynthesisQueue from "./queue";
import { TILES } from "./speech";

function messageFor(event: Event, players: Player[]) {
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
    case EventType.Flower:
      message = `${name} got a flower `;
      break;
    case EventType.Bitten:
      message = `${name} got a bite `;
      break;
  }
  return message;
}

const Message: FunctionComponent<{
  players: Player[];
  event: Event;
  style: CSSProperties;
}> = ({ players, event, style }) => {
  const timestamp = new Date(event.time);
  let tiles = event.tiles || [];
  const message = messageFor(event, players);
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
  soundOn: boolean;
}> = ({ players, events, soundOn }) => {
  const ref = useRef<FixedSizeList>(null);
  const queue = useRef(new SpeechSynthesisQueue());
  const [offset, setOffset] = useState(events.length);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollToItem(events.length - 1);
    }
  });

  useEffect(() => {
    if (offset < events.length) {
      if (soundOn) {
        for (const event of events.slice(offset)) {
          let message = messageFor(event, players);
          if (event.tiles) {
            message += " " + event.tiles.map((tile) => TILES[tile]).join(" ");
          }
          queue.current.push(message);
        }
      }
      setOffset(events.length);
    }
  }, [offset, events, soundOn, players]);

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
