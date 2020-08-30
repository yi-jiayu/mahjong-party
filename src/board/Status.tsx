import React, { FunctionComponent } from "react";
import { Phase, Round } from "../mahjong";

const Status: FunctionComponent<{
  players: { name: string }[];
  round: Round;
}> = ({ players, round }) => {
  const { seat, turn, phase, last_action_time } = round;
  const timestamp = new Date(last_action_time);
  let message: string;
  if (phase === Phase.Finished) {
    message = "Waiting for next round to begin...";
  } else {
    const name = players[turn].name;
    message = `Waiting for ${seat === turn ? "you" : name} to ${
      phase === Phase.Draw ? "draw" : "discard"
    }...`;
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
