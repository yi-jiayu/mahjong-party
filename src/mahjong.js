export const ACTION_DISCARD = 'discard';
export const ACTION_DRAW = 'draw';

export function canPeng(tiles, tile) {
  return tiles.filter(t => t === tile).length >= 2;
}