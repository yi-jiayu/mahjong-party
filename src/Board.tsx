import React, {
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import {
  ActionCallback,
  ActionType,
  Meld,
  MeldType,
  Phase,
  Player,
  Round,
  TileBag,
} from "./mahjong";

import "./board.css";
import "./tiles.css";

const WINDS = ["East", "South", "West", "North"];

function Tile({
  tile,
  onClick,
  inline = false,
}: {
  tile: string;
  onClick?: MouseEventHandler;
  inline?: boolean;
}) {
  return (
    <span
      className={inline ? "tile inline" : "tile"}
      data-tile={tile}
      onClick={onClick}
    />
  );
}

function Tiles({ tiles }: { tiles: string[] }) {
  const elements = tiles.map((tile, index) => (
    <Tile tile={tile} key={tile + index} />
  ));
  return <div className="rack">{elements}</div>;
}

function Melds({ melds }: { melds: Meld[] }) {
  const tiles = melds.flatMap(({ type, tiles }) => {
    switch (type) {
      case MeldType.Chi:
        return tiles;
      case MeldType.Pong:
        return [tiles[0], tiles[0], tiles[0]];
      case MeldType.Gang:
        return [tiles[0], tiles[0], tiles[0], tiles[0]];
      case MeldType.Eyes:
        return [tiles[0], tiles[0]];
    }
  });
  return <Tiles tiles={tiles} />;
}

type TileClickCallback = (tile: string, index: number) => MouseEventHandler;

function Rack({
  tiles,
  onTileClick,
}: {
  tiles: TileBag;
  onTileClick?: TileClickCallback;
}) {
  const elements = Object.entries(tiles)
    .flatMap(([tile, count]) => new Array(count).fill(tile))
    .map((tile, index) => (
      <Tile
        tile={tile}
        key={tile + index}
        onClick={onTileClick ? onTileClick(tile, index) : undefined}
      />
    ));
  return <div className="rack">{elements}</div>;
}

const Label: FunctionComponent<{ seat: number }> = ({ seat, children }) => {
  return (
    <>
      <span>{children}</span>
      {seat === 0 && <span title="Dealer">&nbsp;&#9733;</span>}
    </>
  );
};

const Labels: FunctionComponent<{
  seat: number;
  players: Array<{ name: string }>;
}> = ({ seat, players }) => {
  return (
    <>
      <div className="label-bottom">
        <Label seat={seat}>{players[seat].name}</Label>
      </div>
      <div className="label-right">
        <Label seat={(seat + 1) % 4}>{players[(seat + 1) % 4].name}</Label>
      </div>
      <div className="label-top">
        <Label seat={(seat + 2) % 4}>{players[(seat + 2) % 4].name}</Label>
      </div>
      <div className="label-left">
        <Label seat={(seat + 3) % 4}>{players[(seat + 3) % 4].name}</Label>
      </div>
    </>
  );
};

const Status: FunctionComponent<{
  players: { name: string }[];
  round: Round;
}> = ({ players, round }) => {
  const { seat, turn, phase } = round;
  return (
    <div>
      <strong>
        {new Date().toLocaleTimeString()} Waiting for{" "}
        {seat === turn ? "you" : players[turn].name} to{" "}
        {phase === Phase.Draw ? "draw" : "discard"}...
      </strong>
    </div>
  );
};

const Info: FunctionComponent<{ players: Player[]; round: Round }> = ({
  players,
  round,
}) => {
  const { wind, dealer, draws_left } = round;
  return (
    <div className="info">
      <span className="infobox">Prevailing wind: {WINDS[wind]}</span>
      <span className="infobox">Dealer: {players[dealer].name}</span>
      <span className="infobox">Draws left: {draws_left}</span>
    </div>
  );
};

const Discards: FunctionComponent<{ discards: string[] }> = ({ discards }) => {
  return (
    <div className="centre">
      {discards.map((tile, index) => (
        <Tile tile={tile} key={tile + index} />
      ))}
    </div>
  );
};

function allowedActions(round: Round): Set<ActionType> {
  const { seat, turn, phase } = round;
  const canDraw = turn === seat && phase === Phase.Draw;
  const canDiscard = turn === seat && phase === Phase.Discard;

  const actions = new Set<ActionType>();
  canDraw && actions.add(ActionType.Draw);
  canDiscard && actions.add(ActionType.Discard);
  return actions;
}

const Controls: FunctionComponent<{
  pendingAction: ActionType | null;
  setPendingAction: React.Dispatch<React.SetStateAction<ActionType | null>>;
  actions: Set<ActionType>;
  dispatch: ActionCallback;
}> = ({ pendingAction, setPendingAction, actions, dispatch }) => {
  if (pendingAction === null) {
    return (
      <div>
        <button
          type="button"
          disabled={!actions.has(ActionType.Draw)}
          onClick={() => dispatch(ActionType.Draw)}>
          Draw
        </button>
        <button
          type="button"
          disabled={!actions.has(ActionType.Discard)}
          onClick={() => setPendingAction(ActionType.Discard)}>
          Discard
        </button>
      </div>
    );
  }
  let message;
  switch (pendingAction) {
    case ActionType.Discard:
      message = "Select a tile to discard. ";
  }
  return (
    <div>
      {message && (
        <span>
          <strong>{message}</strong>
        </span>
      )}
      <button type="button" onClick={() => setPendingAction(null)}>
        Cancel
      </button>
    </div>
  );
};

const Hands: FunctionComponent<{
  round: Round;
  tileClickCallback?: TileClickCallback;
}> = ({ round, tileClickCallback }) => {
  const { seat, hands } = round;

  return (
    <>
      <div className="bottom">
        <Tiles tiles={hands[seat].flowers} />
        <Melds melds={hands[seat].revealed} />
        <Rack tiles={hands[seat].concealed} onTileClick={tileClickCallback} />
      </div>
      <div className="right">
        <div className="hand-right">
          <Tiles tiles={hands[(seat + 1) % 4].flowers} />
          <Melds melds={hands[(seat + 1) % 4].revealed} />
          <Rack tiles={hands[(seat + 1) % 4].concealed} />
        </div>
      </div>
      <div className="top">
        <Rack tiles={hands[(seat + 2) % 4].concealed} />
        <Melds melds={hands[(seat + 2) % 4].revealed} />
        <Tiles tiles={hands[(seat + 2) % 4].flowers} />
      </div>
      <div className="left">
        <div className="hand-left">
          <Rack tiles={hands[(seat + 3) % 4].concealed} />
          <Melds melds={hands[(seat + 3) % 4].revealed} />
          <Tiles tiles={hands[(seat + 3) % 4].flowers} />
        </div>
      </div>
    </>
  );
};

export default function Board({
  nonce,
  players,
  round,
  dispatch,
}: {
  nonce: number;
  players: Player[];
  round: Round;
  dispatch: ActionCallback;
}) {
  const { seat, discards } = round;

  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);

  let tileClickCallback: TileClickCallback | undefined;
  switch (pendingAction) {
    case ActionType.Discard:
      tileClickCallback = (tile) => () => dispatch(ActionType.Discard, [tile]);
  }

  useEffect(() => {
    setPendingAction(null);
  }, [nonce]);

  return (
    <div className="table">
      <Info players={players} round={round} />
      <Labels players={players} seat={seat} />
      <Hands round={round} tileClickCallback={tileClickCallback} />
      <Discards discards={discards} />
      <div className="controls">
        <Controls
          pendingAction={pendingAction}
          setPendingAction={setPendingAction}
          actions={allowedActions(round)}
          dispatch={dispatch}
        />
        <div className="messages">
          <div>
            13:38 {players[0].name} chi-ed: <Tile tile="13一筒" inline />
            <Tile tile="14二筒" inline />
            <Tile tile="15三筒" inline />
          </div>
          <div>
            13:34 {players[1].name} drew a tile and got a flower:{" "}
            <Tile tile="01猫" inline />
          </div>
          <div>
            13:34 {players[2].name} discarded: <Tile tile="43北风" inline />
          </div>
          <div>
            13:37 {players[1].name} discarded: <Tile tile="45青发" inline />
          </div>
        </div>
        <Status players={players} round={round} />
      </div>
    </div>
  );
}
