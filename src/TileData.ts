export type TileData = {
  x: number;
  y: number;
  word?: string;
  type?: 'treasure' | 'water' | 'trap' | 'curse' | 'amulet' | 'exit';
};

export const isSameTile = (a: TileData, b: TileData) =>
  a.x === b.x && a.y === b.y;

export const isAdjacent = (a: TileData, b: TileData) => {
  if (isSameTile(a, b)) {
    return false;
  }
  const xDiff = Math.abs(a.x - b.x);
  const yDiff = Math.abs(a.y - b.y);
  return xDiff <= 1 && yDiff <= 2;
};
