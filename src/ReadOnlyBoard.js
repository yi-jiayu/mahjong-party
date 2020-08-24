import React from "react";
import { Rack, Status } from "./Board";

export default function ReadOnlyBoard({ players, round }) {
  const { hands, discards } = round;

  return (
    <>
      <div className="table">
        <Status round={round} />
        <div className="labelBottom">
          <div>
            <div>East</div>
            <div>{players[0]}</div>
          </div>
        </div>
        <div className="bottom">
          <Rack tiles={hands[0].flowers} />
          <Rack tiles={hands[0].revealed} />
          <Rack tiles={hands[0].concealed} />
        </div>
        <div className="labelRight">
          <div>
            <div>South</div>
            <div>{players[1]}</div>
          </div>
        </div>
        <div className="right">
          <Rack tiles={hands[1].flowers} />
          <Rack tiles={hands[1].revealed} />
          <Rack tiles={hands[1].concealed} />
        </div>
        <div className="labelTop">
          <div>
            <div>West</div>
            <div>{players[2]}</div>
          </div>
        </div>
        <div className="top">
          <Rack tiles={hands[2].concealed} />
          <Rack tiles={hands[2].revealed} />
          <Rack tiles={hands[2].flowers} />
        </div>
        <div className="labelLeft">
          <div>
            <div>North</div>
            <div>{players[3]}</div>
          </div>
        </div>
        <div className="left">
          <Rack tiles={hands[3].concealed} />
          <Rack tiles={hands[3].revealed} />
          <Rack tiles={hands[3].flowers} />
        </div>
        <div className="discards">
          {discards.map((tile, index) => (
            <span className="tile" data-tile={tile} key={tile + index} />
          ))}
        </div>
      </div>
    </>
  );
}
