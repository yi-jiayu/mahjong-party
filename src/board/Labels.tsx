import React, { FunctionComponent } from "react";

const Label: FunctionComponent<{ seat: number }> = ({ seat, children }) => {
  return (
    <>
      <span>{children}</span>
      {seat === 0 && <span title="Dealer">&nbsp;&#9733;</span>}
    </>
  );
};

const Labels: FunctionComponent<{
  seat: number;
  players: Array<{ name: string }>;
}> = ({ seat, players }) => {
  return (
    <>
      <div className="label-bottom">
        <Label seat={seat}>{players[seat].name}</Label>
      </div>
      <div className="label-right">
        <Label seat={(seat + 1) % 4}>{players[(seat + 1) % 4].name}</Label>
      </div>
      <div className="label-top">
        <Label seat={(seat + 2) % 4}>{players[(seat + 2) % 4].name}</Label>
      </div>
      <div className="label-left">
        <Label seat={(seat + 3) % 4}>{players[(seat + 3) % 4].name}</Label>
      </div>
    </>
  );
};

export default Labels;