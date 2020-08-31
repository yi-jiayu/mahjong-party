import { MouseEventHandler } from "react";
import { TileBag } from "../mahjong";

export type TileClickCallback = (
  tile: string,
  index: number
) => MouseEventHandler;

export type TilesAction =
  | { type: "sort" }
  | { type: "update"; tiles: TileBag }
  | { type: "remove"; index: number };
