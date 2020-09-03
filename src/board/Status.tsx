import React, { FunctionComponent } from "react";
import { Phase, Round } from "../mahjong";

const Status: FunctionComponent<{
  players: { name: string }[];
  round: Round;
  isReservedDuration: boolean;
}> = ({ players, round, isReservedDuration }) => {
  const { seat, turn, phase, last_action_time, reserved_duration } = round;
  const name = seat === turn ? "you" : players[turn].name;
  let timestamp = new Date(last_action_time);
  let message: string;
  if (round.finished) {
    if (phase === Phase.Draw && isReservedDuration) {
      message = "Waiting to see if anyone else can hu...";
    } else {
      message = "Waiting for next round to begin...";
    }
  } else {
    switch (phase) {
      case Phase.Draw:
        if (isReservedDuration) {
          message = `Giving everyone a chance to react...`;
        } else {
          timestamp = new Date(last_action_time + reserved_duration);
          message = `Waiting for ${name} to draw...`;
        }
        break;
      case Phase.Discard:
        message = `Waiting for ${name} to discard...`;
        break;
    }
  }
  return (
    <div>
      <strong>
        <span>{timestamp.toLocaleTimeString()}</span> {message}
      </strong>
    </div>
  );
};

export default Status;
