import React, { FunctionComponent } from "react";
import { Player } from "../mahjong";

type LabelProps = {
  seat: number;
  players: Player[];
  scores: number[];
};

const Label: FunctionComponent<LabelProps> = ({ seat, players, scores }) => {
  return (
    <div>
      {seat === 0 && "★ "}
      {players[seat].name}
      {": "}
      <span className="score">{20000 + scores[seat] * 100}</span>
    </div>
  );
};

const Labels: FunctionComponent<LabelProps> = ({ seat, players, scores }) => {
  return (
    <>
      <div className="label-bottom">
        <Label seat={seat} scores={scores} players={players} />
      </div>
      <div className="label-right">
        <Label seat={(seat + 1) % 4} scores={scores} players={players} />
      </div>
      <div className="label-top">
        <Label seat={(seat + 2) % 4} scores={scores} players={players} />
      </div>
      <div className="label-left">
        <Label seat={(seat + 3) % 4} scores={scores} players={players} />
      </div>
    </>
  );
};

export default Labels;
