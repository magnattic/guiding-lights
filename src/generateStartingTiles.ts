import * as R from 'remeda';
import { tileConfig } from './GameBoard/tileConfig';
import { words } from './assets/wordList.json';
import { isAdjacent, isSameTile, TileData } from './TileData';

export const generateStartingTiles = (): TileData[] => {
  const startTile = R.sample(tileConfig, 1)[0]!;
  const adjacentTiles = tileConfig.filter((tile) =>
    isAdjacent(tile, startTile)
  );
  const randomTiles = [startTile, ...R.sample(adjacentTiles, 2)];
  const randomWords = R.sample(words, 3);
  return randomTiles.map((tile, index) => ({
    ...tile,
    word: randomWords[index],
  }));
};

export const generateSecrets = (startingTiles: TileData[]) => {
  const randomFreeTiles = R.shuffle(
    R.differenceWith(tileConfig, startingTiles, isSameTile)
  );
  const [treasureTiles, tilesAfterTreasure] = R.splitAt(randomFreeTiles, 3);
  const [waterTiles, tilesAfterWater] = R.splitAt(tilesAfterTreasure, 3);
  const [trapTiles, tilesAfterTrap] = R.splitAt(tilesAfterWater, 3);
  const [curseTiles, tilesAfterCurse] = R.splitAt(tilesAfterTrap, 3);
  const [amuletTiles, tilesAfterAmulet] = R.splitAt(tilesAfterCurse, 1);
  const [exitTiles] = R.splitAt(tilesAfterAmulet, 1);
  return [
    ...treasureTiles.map((tile) => ({
      ...tile,
      type: 'treasure' as const,
    })),
    ...waterTiles.map((tile) => ({ ...tile, type: 'water' as const })),
    ...trapTiles.map((tile) => ({ ...tile, type: 'trap' as const })),
    ...curseTiles.map((tile) => ({ ...tile, type: 'curse' as const })),
    ...amuletTiles.map((tile) => ({ ...tile, type: 'amulet' as const })),
    ...exitTiles.map((tile) => ({ ...tile, type: 'exit' as const })),
  ];
};
