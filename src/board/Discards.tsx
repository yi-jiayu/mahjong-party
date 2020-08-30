import React, { FunctionComponent } from "react";
import Tile from "./Tile";

const Discards: FunctionComponent<{ discards: string[] }> = ({ discards }) => {
  return (
    <div className="centre">
      {discards.map((tile, index) => (
        <Tile tile={tile} key={tile + index} />
      ))}
    </div>
  );
};

export default Discards;
