import React, { FunctionComponent } from "react";
import { Phase, Round } from "../mahjong";

const Status: FunctionComponent<{
  players: { name: string }[];
  round: Round;
}> = ({ players, round }) => {
  const { seat, turn, phase, last_action_time } = round;
  return (
    <div>
      <strong>
        {new Date(last_action_time).toLocaleTimeString()} Waiting for{" "}
        {seat === turn ? "you" : players[turn].name} to{" "}
        {phase === Phase.Draw ? "draw" : "discard"}...
      </strong>
    </div>
  );
};

export default Status;
