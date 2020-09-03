import React, { FunctionComponent } from "react";
import { Hand, Round } from "../mahjong";
import Tiles from "./Tiles";
import Melds from "./Melds";
import Rack from "./Rack";

function concealedOrFinished(hand: Hand) {
  if (hand.finished !== undefined) {
    return <Tiles tiles={hand.finished} />;
  } else {
    return <Rack tiles={hand.concealed} />;
  }
}

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
          {concealedOrFinished(hands[(seat + 1) % 4])}
        </div>
      </div>
      <div className="top">
        {concealedOrFinished(hands[(seat + 2) % 4])}
        <Melds melds={hands[(seat + 2) % 4].revealed} />
        <Tiles tiles={hands[(seat + 2) % 4].flowers} />
      </div>
      <div className="left">
        <div className="hand-left">
          {concealedOrFinished(hands[(seat + 3) % 4])}
          <Melds melds={hands[(seat + 3) % 4].revealed} />
          <Tiles tiles={hands[(seat + 3) % 4].flowers} />
        </div>
      </div>
    </>
  );
};

export default Hands;
