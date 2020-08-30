import { Meld, MeldType } from "../mahjong";
import Tiles from "./Tiles";
import React from "react";

export default function Melds({ melds }: { melds: Meld[] }) {
  const tiles = melds.flatMap(({ type, tiles }) => {
    switch (type) {
      case MeldType.Chi:
        return tiles;
      case MeldType.Pong:
        return [tiles[0], tiles[0], tiles[0]];
      case MeldType.Gang:
        return [tiles[0], tiles[0], tiles[0], tiles[0]];
      case MeldType.Eyes:
        return [tiles[0], tiles[0]];
    }
  });
  return <Tiles tiles={tiles} />;
}
