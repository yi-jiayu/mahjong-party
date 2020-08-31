import React, { FunctionComponent } from "react";
import Tile from "./Tile";
import { useDrop } from "react-dnd";
import { DraggedTile } from "./types";

const Discards: FunctionComponent<{
  discards: string[];
  canDiscard: boolean;
  discardTile: (tile: string) => void;
}> = ({ discards, canDiscard, discardTile }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "tile",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
    drop: ({ tile }: DraggedTile) => {
      if (canDiscard) {
        discardTile(tile);
      }
    },
  });
  return (
    <div
      ref={drop}
      className="centre"
      style={{ opacity: canDiscard && isOver ? 0.5 : 1 }}>
      {discards.map((tile, index) => (
        <Tile tile={tile} key={tile + index} />
      ))}
    </div>
  );
};

export default Discards;
