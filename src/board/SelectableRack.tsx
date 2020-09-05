import React from "react";

import { TileClickCallback } from "./types";
import Tile from "./Tile";

export default function SelectableRack({
  tiles,
  onTileClick,
  selecting,
  selected,
}: {
  tiles: Array<{ tile: string; id: number }>;
  selecting?: boolean;
  selected?: number[];
  onTileClick?: TileClickCallback;
}) {
  const elements = tiles.map(({ tile, id }, index) => (
    <Tile
      tile={tile}
      key={id}
      selected={selected?.includes(index)}
      onClick={onTileClick ? onTileClick(tile, index) : undefined}
    />
  ));
  return (
    <div
      className={selecting ? "rack selectable selecting" : "rack selectable"}>
      {elements}
    </div>
  );
}
