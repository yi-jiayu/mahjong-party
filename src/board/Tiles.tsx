import Tile from "./Tile";
import React from "react";

export default function Tiles({ tiles }: { tiles: string[] }) {
  const elements = tiles.map((tile, index) => (
    <Tile tile={tile} key={tile + index} />
  ));
  return <div className="rack">{elements}</div>;
}
