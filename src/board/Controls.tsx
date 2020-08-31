import React, { FunctionComponent } from "react";
import { ActionCallback, ActionType, Phase, Round } from "../mahjong";

const Controls: FunctionComponent<{
  round: Round;
  pendingAction: ActionType | null;
  setPendingAction: React.Dispatch<React.SetStateAction<ActionType | null>>;
  actions: Set<ActionType>;
  dispatchAction: ActionCallback;
}> = ({ round, pendingAction, setPendingAction, actions, dispatchAction }) => {
  if (round.phase === Phase.Finished) {
    return (
      <div>
        <button type="button" onClick={() => dispatchAction(ActionType.NextRound)}>
          Next round
        </button>
      </div>
    );
  }
  if (pendingAction === null) {
    return (
      <div>
        <button
          type="button"
          disabled={!actions.has(ActionType.Draw)}
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
          disabled={!actions.has(ActionType.Draw)}
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
        <button type="button" onClick={() => dispatchAction(ActionType.Hu)}>
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

export default Controls;
