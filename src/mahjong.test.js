import { tiles, availableChows } from "./mahjong";

it('should return all possible chows', function () {
  expect(availableChows(
      [tiles.BAMBOO_1, tiles.BAMBOO_2, tiles.BAMBOO_4, tiles.BAMBOO_5], tiles.BAMBOO_3)
  ).toEqual(expect.arrayContaining(
      [
        [tiles.BAMBOO_1, tiles.BAMBOO_2, tiles.BAMBOO_3],
        [tiles.BAMBOO_2, tiles.BAMBOO_3, tiles.BAMBOO_4],
        [tiles.BAMBOO_3, tiles.BAMBOO_4, tiles.BAMBOO_5]
      ]));
});