import { TileBag } from "../mahjong";
import Tile from "./Tile";
import React from "react";

export default function Rack({ tiles }: { tiles: TileBag }) {
  const elements = Object.entries(tiles)
    .flatMap(([tile, count]) => new Array(count).fill(tile))
    .map((tile, index) => <Tile tile={tile} key={tile + index} />);
  return <div className="rack">{elements}</div>;
}
