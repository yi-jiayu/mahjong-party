import React, { useEffect, useState } from "react";
import {
  ActionCallback,
  ActionType,
  MeldType,
  Phase,
  Player,
  Round,
} from "../mahjong";

import "../board.css";
import "../tiles.css";

import { TileClickCallback } from "./types";
import OrderedRack from "./OrderedRack";
import Controls from "./Controls";
import Messages from "./Messages";
import Tiles from "./Tiles";
import Labels from "./Labels";
import Melds from "./Melds";
import Hands from "./Hands";
import Status from "./Status";
import Info from "./Info";
import Discards from "./Discards";

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
  const { seat, hands, discards, events } = round;

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
        <Messages players={players} events={events} />
        <Status players={players} round={round} />
      </div>
    </div>
  );
}
