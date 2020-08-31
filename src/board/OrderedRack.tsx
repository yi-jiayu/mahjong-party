import React from "react";

import { TileClickCallback } from "./types";
import Tile from "./Tile";

export default function OrderedRack({
  tiles,
  onTileClick,
  selecting,
  selected,
}: {
  tiles: string[];
  selecting?: boolean;
  selected?: number[];
  onTileClick?: TileClickCallback;
}) {
  const elements = tiles.map((tile, index) => (
    <Tile
      tile={tile}
      key={tile + index}
      selected={selected?.includes(index)}
      onClick={onTileClick ? onTileClick(tile, index) : undefined}
    />
  ));
  return (
    <div className={selecting ? "rack selecting" : "rack"}>{elements}</div>
  );
}
