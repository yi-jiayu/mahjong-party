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
  selected,
  inline,
}: {
  tile: string;
  onClick?: MouseEventHandler;
  selected?: boolean;
  inline?: boolean;
}) {
  const classes = ["tile"];
  selected && classes.push("selected");
  inline && classes.push("inline");
  return (
    <span className={classes.join(" ")} data-tile={tile} onClick={onClick} />
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

function OrderedRack({
  tiles,
  onTileClick,
  selecting,
  selected,
}: {
  tiles: TileBag;
  selecting?: boolean;
  selected?: number;
  onTileClick?: TileClickCallback;
}) {
  const [order, setOrder] = useState<string[]>(
    Object.entries(tiles).flatMap(([tile, count]) =>
      new Array(count).fill(tile)
    )
  );

  useEffect(() => {
    const remaining = Object.assign({}, tiles);
    let newOrder = order.reduce((ts, t) => {
      if (remaining[t] > 0) {
        remaining[t]--;
        return [...ts, t];
      }
      return ts;
    }, [] as string[]);
    newOrder = newOrder.concat(
      Object.entries(remaining).flatMap(([tile, count]) =>
        new Array(count).fill(tile)
      )
    );
    if (
      newOrder.length !== order.length ||
      newOrder.some((value, index) => value !== order[index])
    ) {
      setOrder(newOrder);
    }
  }, [order, tiles]);

  const elements = order.map((tile, index) => (
    <Tile
      tile={tile}
      key={tile + index}
      selected={selected === index}
      onClick={onTileClick ? onTileClick(tile, index) : undefined}
    />
  ));
  return (
    <div className={selecting ? "rack selecting" : "rack"}>{elements}</div>
  );
}

function Rack({ tiles }: { tiles: TileBag }) {
  const elements = Object.entries(tiles)
    .flatMap(([tile, count]) => new Array(count).fill(tile))
    .map((tile, index) => <Tile tile={tile} key={tile + index} />);
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
  const { seat, turn, phase, discards, hands } = round;
  const previousTurn = (turn + 3) % 4;
  const lastDiscard = discards.length > 0 && discards[discards.length - 1];
  const canDraw = turn === seat && phase === Phase.Draw;
  const canDiscard = turn === seat && phase === Phase.Discard;
  const canPong =
    seat !== previousTurn &&
    phase === Phase.Draw &&
    lastDiscard &&
    hands[seat].concealed[lastDiscard] > 1;
  const canGangFromDiscard =
    seat !== previousTurn &&
    phase === Phase.Draw &&
    lastDiscard &&
    hands[seat].concealed[lastDiscard] > 2;
  const canGangFromHand =
    canDiscard &&
    Object.entries(hands[seat].concealed).some(([_, count]) => count > 3);
  const canUpgradePongToGang =
    canDiscard &&
    hands[seat].revealed
      .filter(({ type }) => type === MeldType.Pong)
      .map(({ tiles: [tile] }) => tile)
      .some((tile) => hands[seat].concealed[tile] > 0);
  const canGang = canGangFromDiscard || canGangFromHand || canUpgradePongToGang;
  const canHuFromDiscard =
    seat !== previousTurn && phase === Phase.Draw && lastDiscard;
  const canHu = canDiscard && canHuFromDiscard;

  const actions = new Set<ActionType>();
  canDraw && actions.add(ActionType.Draw);
  canDiscard && actions.add(ActionType.Discard);
  canPong && actions.add(ActionType.Pong);
  canGang && actions.add(ActionType.Gang);
  canHu && actions.add(ActionType.Hu);
  return actions;
}

const Controls: FunctionComponent<{
  round: Round;
  pendingAction: ActionType | null;
  setPendingAction: React.Dispatch<React.SetStateAction<ActionType | null>>;
  actions: Set<ActionType>;
  dispatch: ActionCallback;
}> = ({ round, pendingAction, setPendingAction, actions, dispatch }) => {
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
        <button
          type="button"
          disabled={!actions.has(ActionType.Draw)}
          onClick={() => setPendingAction(ActionType.Chi)}>
          Chi
        </button>
        <button
          type="button"
          disabled={!actions.has(ActionType.Pong)}
          onClick={() => dispatch(ActionType.Pong)}>
          Pong
        </button>
        <button
          type="button"
          disabled={!actions.has(ActionType.Gang)}
          onClick={
            round.phase === Phase.Discard
              ? () => setPendingAction(ActionType.Gang)
              : () => dispatch(ActionType.Gang)
          }>
          Gang
        </button>
        <button type="button" onClick={() => dispatch(ActionType.Hu)}>
          Hu
        </button>
      </div>
    );
  }
  let message;
  switch (pendingAction) {
    case ActionType.Discard:
      message = "Select a tile to discard. ";
      break;
    case ActionType.Chi:
      message = "Select two tiles to chi. ";
      break;
    case ActionType.Gang:
      message = "Select a tile to gang. ";
      break;
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
}> = ({ round }) => {
  const { seat, hands } = round;
  return (
    <>
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
  const { seat, hands, discards } = round;

  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);
  const [selected, setSelected] = useState<{ tile: string; index: number }>({
    tile: "",
    index: -1,
  });

  let tileClickCallback: TileClickCallback | undefined;
  switch (pendingAction) {
    case ActionType.Discard:
      tileClickCallback = (tile) => () => dispatch(ActionType.Discard, [tile]);
      break;
    case ActionType.Chi:
      tileClickCallback = (tile, index) => () => {
        const { index: selectedIndex, tile: selectedTile } = selected;
        if (selectedIndex === index) {
          setSelected({ tile: "", index: -1 });
        } else if (selectedIndex === -1) {
          setSelected({ index, tile });
        } else {
          setSelected({ tile: "", index: -1 });
          dispatch(ActionType.Chi, [selectedTile, tile]);
        }
      };
      break;
    case ActionType.Gang:
      tileClickCallback = (tile) => () => dispatch(ActionType.Gang, [tile]);
      break;
  }

  useEffect(() => {
    setPendingAction(null);
    setSelected({ tile: "", index: -1 });
  }, [nonce]);

  return (
    <div className="table">
      <Info players={players} round={round} />
      <Labels players={players} seat={seat} />
      <div className="bottom">
        <Tiles tiles={hands[seat].flowers} />
        <Melds melds={hands[seat].revealed} />
        <OrderedRack
          tiles={hands[seat].concealed}
          selecting={pendingAction === ActionType.Chi}
          selected={selected.index}
          onTileClick={tileClickCallback}
        />
      </div>
      <Hands round={round} />
      <Discards discards={discards} />
      <div className="controls">
        <Controls
          round={round}
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
