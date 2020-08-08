export const ACTION_DISCARD = 'discard';
export const ACTION_DRAW = 'draw';

export const tiles = {
  CAT: "01猫",
  RAT: "02老鼠",
  ROOSTER: "03公鸡",
  CENTIPEDE: "04蜈蚣",
  GENTLEMEN_1: "05梅",
  GENTLEMEN_2: "06兰",
  GENTLEMEN_3: "07菊",
  GENTLEMEN_4: "08竹",
  SEASONS_1: "09春",
  SEASONS_2: "10夏",
  SEASONS_3: "11秋",
  SEASONS_4: "12冬",
  DOTS_1: "13一筒",
  DOTS_2: "14二筒",
  DOTS_3: "15三筒",
  DOTS_4: "16四筒",
  DOTS_5: "17五筒",
  DOTS_6: "18六筒",
  DOTS_7: "19七筒",
  DOTS_8: "20八筒",
  DOTS_9: "21九筒",
  BAMBOO_1: "22一索",
  BAMBOO_2: "23二索",
  BAMBOO_3: "24三索",
  BAMBOO_4: "25四索",
  BAMBOO_5: "26五索",
  BAMBOO_6: "27六索",
  BAMBOO_7: "28七索",
  BAMBOO_8: "29八索",
  BAMBOO_9: "30九索",
  CHARACTERS_1: "31一万",
  CHARACTERS_2: "32二万",
  CHARACTERS_3: "33三万",
  CHARACTERS_4: "34四万",
  CHARACTERS_5: "35五万",
  CHARACTERS_6: "36六万",
  CHARACTERS_7: "37七万",
  CHARACTERS_8: "38八万",
  CHARACTERS_9: "39九万",
  WINDS_EAST: "40东风",
  WINDS_SOUTH: "41南风",
  WINDS_WEST: "42西风",
  WINDS_NORTH: "43北风",
  DRAGONS_RED: "44红中",
  DRAGONS_GREEN: "45青发",
  DRAGONS_WHITE: "46白板",
}

const validSequences = [
  [tiles.DOTS_1, tiles.DOTS_2, tiles.DOTS_3],
  [tiles.DOTS_2, tiles.DOTS_3, tiles.DOTS_4],
  [tiles.DOTS_3, tiles.DOTS_4, tiles.DOTS_5],
  [tiles.DOTS_4, tiles.DOTS_5, tiles.DOTS_6],
  [tiles.DOTS_5, tiles.DOTS_6, tiles.DOTS_7],
  [tiles.DOTS_6, tiles.DOTS_7, tiles.DOTS_8],
  [tiles.DOTS_7, tiles.DOTS_8, tiles.DOTS_9],
  [tiles.BAMBOO_1, tiles.BAMBOO_2, tiles.BAMBOO_3],
  [tiles.BAMBOO_2, tiles.BAMBOO_3, tiles.BAMBOO_4],
  [tiles.BAMBOO_3, tiles.BAMBOO_4, tiles.BAMBOO_5],
  [tiles.BAMBOO_4, tiles.BAMBOO_5, tiles.BAMBOO_6],
  [tiles.BAMBOO_5, tiles.BAMBOO_6, tiles.BAMBOO_7],
  [tiles.BAMBOO_6, tiles.BAMBOO_7, tiles.BAMBOO_8],
  [tiles.BAMBOO_7, tiles.BAMBOO_8, tiles.BAMBOO_9],
  [tiles.CHARACTERS_1, tiles.CHARACTERS_2, tiles.CHARACTERS_3],
  [tiles.CHARACTERS_2, tiles.CHARACTERS_3, tiles.CHARACTERS_4],
  [tiles.CHARACTERS_3, tiles.CHARACTERS_4, tiles.CHARACTERS_5],
  [tiles.CHARACTERS_4, tiles.CHARACTERS_5, tiles.CHARACTERS_6],
  [tiles.CHARACTERS_5, tiles.CHARACTERS_6, tiles.CHARACTERS_7],
  [tiles.CHARACTERS_6, tiles.CHARACTERS_7, tiles.CHARACTERS_8],
  [tiles.CHARACTERS_7, tiles.CHARACTERS_8, tiles.CHARACTERS_9],
]

export function availableChows(tiles_, tile) {
  const uniqueTiles = new Set();
  for (const t of tiles_) {
    if (t >= tiles.DOTS_1 && t <= tiles.CHARACTERS_9) {
      uniqueTiles.add(t);
    }
  }
  const available = [];
  for (const t1 of uniqueTiles) {
    for (const t2 of uniqueTiles) {
      if (t1 === t2) {
        continue;
      }
      const seq = [t1, t2, tile];
      seq.sort();
      const [a1, b1, c1] = seq;
      for (const [a2, b2, c2] of validSequences) {
        if (a1 === a2 && b1 === b2 && c1 === c2) {
          available.push(seq);
        }
      }
    }
  }
  return available;
}