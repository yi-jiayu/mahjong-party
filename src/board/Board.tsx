import React, { useEffect, useReducer, useState } from "react";
import { ActionCallback, ActionType, Player, Round } from "../mahjong";

import "./board.css";
import "./tiles.css";

import { TileClickCallback, TilesAction } from "./types";
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
import produce from "immer";

type SelectedState = { tiles: string[]; indexes: number[] };
type SelectedAction =
  | { type: "reset" }
  | { type: "click"; tile: string; index: number };

const reduceSelected = (
  selected: SelectedState,
  action: SelectedAction
): SelectedState => {
  if (
    action.type === "reset" ||
    (selected.indexes.length === 1 && selected.indexes[0] === action.index)
  ) {
    return { tiles: [], indexes: [] };
  } else if (selected.indexes.length === 0) {
    return { tiles: [action.tile], indexes: [action.index] };
  } else {
    return {
      tiles: [...selected.tiles, action.tile],
      indexes: [...selected.indexes, action.index],
    };
  }
};

const reduceTiles = (state: string[], action: TilesAction) => {
  switch (action.type) {
    case "update":
      const remaining = { ...action.tiles };
      state = state.reduce((tiles, tile) => {
        if (remaining[tile] > 0) {
          remaining[tile]--;
          return [...tiles, tile];
        }
        return tiles;
      }, [] as string[]);
      return state.concat(
        Object.entries(remaining).flatMap(([tile, count]) =>
          new Array(count).fill(tile)
        )
      );
    case "remove":
      return produce(state, (draft) => {
        draft.splice(action.index, 1);
      });
    case "sort":
      return produce(state, (draft) => {
        draft.sort();
      });
  }
};

export default function Board({
  nonce,
  players,
  round,
  dispatchAction,
}: {
  nonce: number;
  players: Player[];
  round: Round;
  dispatchAction: ActionCallback;
}) {
  const {
    seat,
    hands,
    discards,
    events,
    scores,
    last_action_time,
    reserved_duration,
  } = round;
  const concealed = hands[seat].concealed;

  const [pendingAction, setPendingAction] = useState<ActionType | null>(null);
  const [selected, dispatchSelected] = useReducer(reduceSelected, {
    tiles: [],
    indexes: [],
  });
  const [isReservedDuration, setIsReservedDuration] = useState(false);
  const [tiles, dispatchTiles] = useReducer(
    reduceTiles,
    reduceTiles([], { type: "update", tiles: concealed })
  );

  let tileClickCallback: TileClickCallback | undefined;
  switch (pendingAction) {
    case ActionType.Discard:
      tileClickCallback = (tile) => () =>
        dispatchAction(ActionType.Discard, [tile]);
      break;
    case ActionType.Chi:
      tileClickCallback = (tile, index) => () =>
        dispatchSelected({ type: "click", tile, index });
      break;
    case ActionType.Gang:
      tileClickCallback = (tile) => () =>
        dispatchAction(ActionType.Gang, [tile]);
      break;
  }

  useEffect(() => {
    if (pendingAction === ActionType.Chi && selected.tiles.length === 2) {
      dispatchAction(ActionType.Chi, selected.tiles);
      dispatchSelected({ type: "reset" });
    }
  }, [pendingAction, selected, dispatchAction]);

  useEffect(() => {
    const delayBeforeDrawing =
      last_action_time + reserved_duration - Date.now();
    if (delayBeforeDrawing > 0) {
      setIsReservedDuration(true);
      const timer = setTimeout(() => {
        setIsReservedDuration(false);
      }, delayBeforeDrawing);
      return () => window.clearTimeout(timer);
    }
  }, [last_action_time, reserved_duration]);

  useEffect(() => {
    setPendingAction(null);
    dispatchSelected({ type: "reset" });
  }, [nonce]);

  useEffect(() => {
    dispatchTiles({ type: "update", tiles: concealed });
  }, [concealed]);

  return (
    <div className="table">
      <Info players={players} round={round} />
      <Labels players={players} seat={seat} scores={scores} />
      <div className="bottom">
        <Tiles tiles={hands[seat].flowers} />
        <Melds melds={hands[seat].revealed} />
        <OrderedRack
          tiles={tiles}
          selecting={pendingAction === ActionType.Chi}
          selected={selected.indexes}
          onTileClick={tileClickCallback}
        />
      </div>
      <Hands round={round} />
      <Discards discards={discards} />
      <div className="controls">
        <Controls
          round={round}
          isReservedDuration={isReservedDuration}
          pendingAction={pendingAction}
          setPendingAction={setPendingAction}
          dispatchTiles={dispatchTiles}
          dispatchAction={dispatchAction}
        />
        <Messages players={players} events={events} />
        <Status
          players={players}
          round={round}
          isReservedDuration={isReservedDuration}
        />
      </div>
    </div>
  );
}
