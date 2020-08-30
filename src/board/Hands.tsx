import React, { FunctionComponent } from "react";
import { Round } from "../mahjong";
import Tiles from "./Tiles";
import Melds from "./Melds";
import Rack from "./Rack";

const Hands: FunctionComponent<{
  round: Round;
}> = ({ round }) => {
  const { seat, hands } = round;
  return (
    <>
      <div className="right">
        <div className="hand-right">
          <Tiles tiles={hands[(seat + 1) % 4].flowers} />
          <Melds melds={hands[(seat + 1) % 4].revealed} />
          <Rack tiles={hands[(seat + 1) % 4].concealed} />
        </div>
      </div>
      <div className="top">
        <Rack tiles={hands[(seat + 2) % 4].concealed} />
        <Melds melds={hands[(seat + 2) % 4].revealed} />
        <Tiles tiles={hands[(seat + 2) % 4].flowers} />
      </div>
      <div className="left">
        <div className="hand-left">
          <Rack tiles={hands[(seat + 3) % 4].concealed} />
          <Melds melds={hands[(seat + 3) % 4].revealed} />
          <Tiles tiles={hands[(seat + 3) % 4].flowers} />
        </div>
      </div>
    </>
  );
};

export default Hands;