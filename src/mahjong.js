export const ACTION_DISCARD = "discard";
export const ACTION_DRAW = "draw";

export const DIRECTIONS = ["East", "South", "West", "North"];

export function canPeng(tiles, tile) {
  return tiles.filter((t) => t === tile).length >= 2;
}
