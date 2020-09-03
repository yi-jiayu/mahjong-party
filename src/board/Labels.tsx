import React, { FunctionComponent } from "react";
import { Player } from "../mahjong";

type LabelProps = {
  seat: number;
  dealer: number;
  players: Player[];
  scores: number[];
};

const Label: FunctionComponent<{
  isDealer: boolean;
  name: string;
  score: number;
}> = ({ isDealer, name, score }) => {
  return (
    <div>
      {isDealer && "★ "}
      {name}
      {": "}
      <span className="score">{20000 + score * 100}</span>
    </div>
  );
};

const Labels: FunctionComponent<LabelProps> = ({
  seat,
  dealer,
  players,
  scores,
}) => {
  const [bottom, right, top, left] = [
    seat,
    (seat + 1) % 4,
    (seat + 2) % 4,
    (seat + 3) % 4,
  ];
  return (
    <>
      <div className="label-bottom">
        <Label
          isDealer={bottom === dealer}
          name={players[bottom].name}
          score={scores[bottom]}
        />
      </div>
      <div className="label-right">
        <Label
          isDealer={right === dealer}
          name={players[right].name}
          score={scores[right]}
        />
      </div>
      <div className="label-top">
        <Label
          isDealer={top === dealer}
          name={players[top].name}
          score={scores[top]}
        />
      </div>
      <div className="label-left">
        <Label
          isDealer={left === dealer}
          name={players[left].name}
          score={scores[left]}
        />
      </div>
    </>
  );
};

export default Labels;
