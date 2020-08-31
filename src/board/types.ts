import { MouseEventHandler } from "react";
import { TileBag } from "../mahjong";

export type TileClickCallback = (
  tile: string,
  index: number
) => MouseEventHandler;

export type TilesAction =
  | { type: "sort" }
  | { type: "update"; tiles: TileBag }
  | { type: "remove"; index: number }
  | { type: "move"; from: number; to: number };

export type DraggedTile = {
  type: "tile";
  tile: string;
  index: number;
};
