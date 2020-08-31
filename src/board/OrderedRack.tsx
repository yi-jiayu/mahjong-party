import { TileBag } from "../mahjong";
import React, { useEffect, useState } from "react";

import { TileClickCallback } from "./types";
import Tile from "./Tile";

export default function OrderedRack({
  tiles,
  onTileClick,
  selecting,
  selected,
}: {
  tiles: TileBag;
  selecting?: boolean;
  selected?: number[];
  onTileClick?: TileClickCallback;
}) {
  const [order, setOrder] = useState<string[]>(
    Object.entries(tiles).flatMap(([tile, count]) =>
      new Array(count).fill(tile)
    )
  );

  useEffect(() => {
    const remaining = Object.assign({}, tiles);
    let newOrder = order.reduce((ts, t) => {
      if (remaining[t] > 0) {
        remaining[t]--;
        return [...ts, t];
      }
      return ts;
    }, [] as string[]);
    newOrder = newOrder.concat(
      Object.entries(remaining).flatMap(([tile, count]) =>
        new Array(count).fill(tile)
      )
    );
    if (
      newOrder.length !== order.length ||
      newOrder.some((value, index) => value !== order[index])
    ) {
      setOrder(newOrder);
    }
  }, [order, tiles]);

  const elements = order.map((tile, index) => (
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
