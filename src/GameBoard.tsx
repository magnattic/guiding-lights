import * as R from 'remeda';
import { createMemo, createSignal, For } from 'solid-js';
import { createWithSignal } from 'solid-zustand';
import { words } from './assets/wordList.json';
import { tileConfig } from './GameBoard/tileConfig';

type GameState = {
  availableTiles: number;
  placedTiles: TileData[];
  secrets: TileData[];
  placeTile: () => void;
  startGame: () => void;
};

type TileData = {
  x: number;
  y: number;
  word?: string;
  type?: 'treasure' | 'water' | 'trap' | 'curse' | 'amulet' | 'exit';
};

const isSameTile = (a: TileData, b: TileData) => a.x === b.x && a.y === b.y;

const isAdjacent = (a: TileData, b: TileData) => {
  if (isSameTile(a, b)) {
    return false;
  }
  const xDiff = Math.abs(a.x - b.x);
  const yDiff = Math.abs(a.y - b.y);
  return xDiff <= 1 && yDiff <= 2;
};

const generateStartingTiles = (): TileData[] => {
  const startTile = R.sample(tileConfig, 1)[0]!;
  const adjacentTiles = tileConfig.filter((tile) =>
    isAdjacent(tile, startTile)
  );
  console.log(startTile, adjacentTiles);
  const randomTiles = [startTile, ...R.sample(adjacentTiles, 2)];
  const randomWords = R.sample(words, 3);
  return randomTiles.map((tile, index) => ({
    ...tile,
    word: randomWords[index],
  }));
};

const generateSecrets = (startingTiles: TileData[]) => {
  const freeTiles = tileConfig.filter(
    (tile) =>
      !startingTiles.some((startingTile) => isSameTile(tile, startingTile))
  );
  const treasures = R.sample(freeTiles, 3);
  return treasures.map(
    (treasure) => ({ ...treasure, type: 'treasure' } satisfies TileData)
  );
};

const useGameState = createWithSignal<GameState>((set) => ({
  availableTiles: 0,
  placedTiles: [],
  secrets: [],
  placeTile: () =>
    set((state) => ({ availableTiles: state.availableTiles - 1 })),
  startGame: () => {
    const startingTiles = generateStartingTiles();
    set({
      availableTiles: 7,
      placedTiles: startingTiles,
      secrets: generateSecrets(startingTiles),
    });
  },
}));

export const GameBoard = () => {
  const availableTiles = useGameState((state) => state.availableTiles);
  const placedTiles = useGameState((state) => state.placedTiles);
  const secrets = useGameState((state) => state.secrets);
  const startGame = useGameState((state) => state.startGame);

  const boardTiles = createMemo((): TileData[] => {
    return tileConfig.map((tile) => {
      const placedTile = placedTiles().find((placedTile) =>
        isSameTile(placedTile, tile)
      );
      const secretTile = secrets().find((secret) => isSameTile(secret, tile));
      return placedTile ?? secretTile ?? tile;
    });
  });

  const onStartGame = () => {
    startGame();
  };

  return (
    <main>
      <button onClick={onStartGame}>Restart Game</button>
      <div>{availableTiles()} tiles left</div>
      <div class="hex-grid">
        <For each={boardTiles()}>
          {(item) => (
            <SvgTile x={item.x} y={item.y} word={item.word} type={item.type} />
          )}
        </For>
      </div>
    </main>
  );
};

const SvgTile = ({ x, y, word, type }: TileData) => {
  const [isHovered, setHovered] = createSignal(false);
  const hasWord = word !== undefined;
  const isTreasure = type === 'treasure';

  return (
    <div
      class={`flex justify-center items-center scale-130`}
      classList={{
        'stroke-white': !isTreasure,
        'stroke-black': hasWord,
        'stroke-yellow-400': isTreasure,
        'text-white': !hasWord,
        'text-black': hasWord,
      }}
      style={{ 'grid-row': y, 'grid-column': x }}
      draggable="true"
    >
      <svg
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        viewBox="0 0 84 84"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.0992 77L2.19922 42.5L22.0992 8H61.8992L81.7992 42.5L61.8992 77H22.0992Z"
          fill={word || isTreasure ? 'white' : 'transparent'}
          stroke-width={isHovered() ? 3 : hasWord ? 2 : 1}
        ></path>
      </svg>
      <div
        class="absolute"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {word ?? `${x},${y},${type ?? ''}`}
      </div>
    </div>
  );
};
