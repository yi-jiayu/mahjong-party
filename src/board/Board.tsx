import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  ActionCallback,
  ActionType,
  RoundPhase,
  Player,
  Round,
} from "../mahjong";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./board.css";
import "./tiles.css";

import { TileClickCallback, TilesAction } from "./types";
import SortableRack from "./SortableRack";
import SelectableRack from "./SelectableRack";
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

const reduceTiles = (
  state: Array<{ tile: string; id: number }>,
  action: TilesAction
) => {
  switch (action.type) {
    case "move":
      return produce(state, (draft) => {
        draft.splice(action.from, 1);
        draft.splice(action.to, 0, state[action.from]);
      });
    case "update":
      const remaining = { ...action.tiles };
      let tiles = state.reduce((tiles, { tile }) => {
        if (remaining[tile] > 0) {
          remaining[tile]--;
          return [...tiles, tile];
        }
        return tiles;
      }, [] as string[]);
      tiles = tiles.concat(
        Object.entries(remaining).flatMap(([tile, count]) =>
          new Array(count).fill(tile)
        )
      );
      return tiles.map((tile, index) => ({ tile, id: index }));
    case "remove":
      return produce(state, (draft) => {
        draft.splice(action.index, 1);
      });
    case "sort":
      return produce(state, (draft) => {
        draft.sort(({ tile: a }, { tile: b }) => (a < b ? -1 : a > b ? 1 : 0));
      });
  }
};

const Board: FunctionComponent<{
  nonce: number;
  players: Player[];
  round: Round;
  dispatchAction: ActionCallback;
  links?: ReactElement;
}> = ({ nonce, players, round, dispatchAction, links, children }) => {
  const {
    seat,
    dealer,
    hands,
    discards,
    turn,
    phase,
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

  const discardTile = (tile: string, index: number) => {
    dispatchTiles({ type: "remove", index });
    dispatchAction(ActionType.Discard, [tile]);
  };
  const discardLastTile = () =>
    discardTile(tiles[tiles.length - 1].tile, tiles.length - 1);

  let tileClickCallback: TileClickCallback | undefined;
  switch (pendingAction) {
    case ActionType.Discard:
      tileClickCallback = (tile, index) => () => discardTile(tile, index);
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

  let ownTiles: ReactElement;
  const finished = hands[seat].finished;
  if (finished !== undefined) {
    ownTiles = <Tiles tiles={finished} />;
  } else if (pendingAction === null) {
    ownTiles = (
      <SortableRack
        tiles={tiles}
        moveTile={(from, to) => dispatchTiles({ type: "move", from, to })}
      />
    );
  } else {
    ownTiles = (
      <SelectableRack
        tiles={tiles}
        selecting={pendingAction === ActionType.Chi}
        selected={selected.indexes}
        onTileClick={tileClickCallback}
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="table">
        {children}
        <Info players={players} round={round}>
          {links}
        </Info>
        <Labels players={players} dealer={dealer} seat={seat} scores={scores} />
        <div className="bottom">
          <Tiles tiles={hands[seat].flowers} />
          <Melds melds={hands[seat].revealed} />
          <div className="tutorial-your_tiles">{ownTiles}</div>
        </div>
        <Hands round={round} />
        <Discards
          discards={discards}
          canDiscard={turn === seat && phase === RoundPhase.Discard}
          discardTile={discardTile}
        />
        <div className="underneath">
          <Controls
            round={round}
            isReservedDuration={isReservedDuration}
            pendingAction={pendingAction}
            setPendingAction={setPendingAction}
            tilesAreSorted={tiles.every(
              ({ tile }, i) => i === 0 || tiles[i - 1].tile <= tile
            )}
            sortTiles={() => dispatchTiles({ type: "sort" })}
            discardLastTile={discardLastTile}
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
    </DndProvider>
  );
};

export default Board;
