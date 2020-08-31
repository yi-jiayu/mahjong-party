import React, { FunctionComponent } from "react";
import {
  ActionCallback,
  ActionType,
  MeldType,
  Phase,
  Round,
  sequences,
} from "../mahjong";

function allowedActions(round: Round): Set<ActionType> {
  const { seat, turn, phase, discards, hands, draws_left } = round;
  const previousTurn = (turn + 3) % 4;
  const lastDiscard = discards.length > 0 && discards[discards.length - 1];
  const canDraw = turn === seat && phase === Phase.Draw;
  const canDiscard = turn === seat && phase === Phase.Discard;
  const canChi =
    canDraw &&
    lastDiscard &&
    sequences.hasOwnProperty(lastDiscard) &&
    sequences[lastDiscard].some((seq) =>
      seq.every((tile) => hands[seat].concealed.hasOwnProperty(tile))
    );
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
  const canHu = canDiscard || canHuFromDiscard;
  const canEnd = canDiscard && draws_left <= 0;

  const actions = new Set<ActionType>();
  canDraw && actions.add(ActionType.Draw);
  canChi && actions.add(ActionType.Chi);
  canDiscard && actions.add(ActionType.Discard);
  canPong && actions.add(ActionType.Pong);
  canGang && actions.add(ActionType.Gang);
  canHu && actions.add(ActionType.Hu);
  canEnd && actions.add(ActionType.EndRound);
  return actions;
}

const Controls: FunctionComponent<{
  round: Round;
  isReservedDuration: boolean;
  pendingAction: ActionType | null;
  setPendingAction: React.Dispatch<React.SetStateAction<ActionType | null>>;
  tilesAreSorted: boolean;
  sortTiles: () => void;
  dispatchAction: ActionCallback;
}> = ({
  round,
  isReservedDuration,
  pendingAction,
  setPendingAction,
  tilesAreSorted,
  sortTiles,
  dispatchAction,
}) => {
  if (round.phase === Phase.Finished) {
    return (
      <div>
        <button
          type="button"
          onClick={() => dispatchAction(ActionType.NextRound)}>
          Next round
        </button>
      </div>
    );
  }
  if (pendingAction === null) {
    const actions = allowedActions(round);
    return (
      <div>
        {actions.has(ActionType.EndRound) ? (
          <button
            type="button"
            onClick={() => dispatchAction(ActionType.EndRound)}>
            End round
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={!actions.has(ActionType.Draw) || isReservedDuration}
              onClick={() => dispatchAction(ActionType.Draw)}>
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
              disabled={!actions.has(ActionType.Chi) || isReservedDuration}
              onClick={() => setPendingAction(ActionType.Chi)}>
              Chi
            </button>
            <button
              type="button"
              disabled={!actions.has(ActionType.Pong)}
              onClick={() => dispatchAction(ActionType.Pong)}>
              Pong
            </button>
            <button
              type="button"
              disabled={!actions.has(ActionType.Gang)}
              onClick={
                round.phase === Phase.Discard
                  ? () => setPendingAction(ActionType.Gang)
                  : () => dispatchAction(ActionType.Gang)
              }>
              Gang
            </button>
          </>
        )}
        <button
          type="button"
          disabled={!actions.has(ActionType.Hu)}
          onClick={() => dispatchAction(ActionType.Hu)}>
          Hu
        </button>
        <button type="button" disabled={tilesAreSorted} onClick={sortTiles}>
          Sort tiles
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

export default Controls;
