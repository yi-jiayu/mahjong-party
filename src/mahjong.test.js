import { canPeng } from "./mahjong";

it('should return whether a peng is possible', function () {
  expect(canPeng([1, 1], 1)).toBe(true);
  expect(canPeng([1, 2], 3)).toBe(false);
});