import * as R from 'remeda';
import {
  ComponentProps,
  createMemo,
  createSignal,
  For,
  JSX,
  splitProps,
} from 'solid-js';
import { createWithSignal } from 'solid-zustand';
import { words } from './assets/wordList.json';
import { tileConfig } from './GameBoard/tileConfig';
import { IoAperture, IoDiamond, IoSkull, IoWater } from 'solid-icons/io';
import { FaSolidHelicopter, FaSolidPersonFalling } from 'solid-icons/fa';

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
  const randomTiles = [startTile, ...R.sample(adjacentTiles, 2)];
  const randomWords = R.sample(words, 3);
  return randomTiles.map((tile, index) => ({
    ...tile,
    word: randomWords[index],
  }));
};

const generateSecrets = (startingTiles: TileData[]) => {
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

type GameState = {
  availableTiles: number;
  placedTiles: TileData[];
  secrets: TileData[];
  secretsRevealed: boolean;
  placeTile: () => void;
  startGame: () => void;
  toggleSecrets: () => void;
};

const useGameState = createWithSignal<GameState>((set) => ({
  availableTiles: 0,
  placedTiles: [],
  secrets: [],
  secretsRevealed: false,
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
  toggleSecrets: () =>
    set((state) => ({ secretsRevealed: !state.secretsRevealed })),
}));

export const GameBoard = () => {
  const availableTiles = useGameState((state) => state.availableTiles);
  const placedTiles = useGameState((state) => state.placedTiles);
  const secrets = useGameState((state) => state.secrets);
  const startGame = useGameState((state) => state.startGame);
  const toggleSecrets = useGameState((state) => state.toggleSecrets);

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
    <main class="flex flex-row">
      <div class="hex-grid">
        <For each={boardTiles()}>
          {(item) => (
            <BoardTile
              x={item.x}
              y={item.y}
              word={item.word}
              type={item.type}
            />
          )}
        </For>
      </div>
      <nav class="m-5 flex flex-col">
        <button onClick={onStartGame}>Restart Game</button>
        <div class="flex relative h-40 w-30 p-4">
          <Hexagon
            class="fill-white stroke-black absolute h-full w-full top-[6px] left-[6px]"
            pathClassList={{ stack: true }}
          />
          <Hexagon
            class="fill-white stroke-black absolute h-full w-full top-[3px] left-[3px]"
            pathClassList={{ stack: true }}
          />
          <Hexagon
            class="fill-white stroke-black text-black text-4xl absolute top-0 left-0 h-full w-full"
            pathClassList={{ stack: true }}
          >
            {availableTiles()}
          </Hexagon>
        </div>
        <div>Kacheln übrig</div>
        <button onClick={toggleSecrets}>Geheimnisse {secrets().length}</button>
      </nav>
    </main>
  );
};

const BoardTile = ({ x, y, word, type }: TileData) => {
  const [isHovered, setHovered] = createSignal(false);

  const secretsRevealed = useGameState((state) => state.secretsRevealed);

  const hasWord = word !== undefined;
  const revealedType = () => (secretsRevealed() ? type : undefined);
  const isTreasure = () => revealedType() === 'treasure';
  const isWater = () => revealedType() === 'water';
  const isTrap = () => revealedType() === 'trap';
  const isCurse = () => revealedType() === 'curse';
  const isAmulet = () => revealedType() === 'amulet';
  const isExit = () => revealedType() === 'exit';
  const isSecret = () => !hasWord && revealedType() !== undefined;

  return (
    <Hexagon
      classList={{
        'scale-130': true,
        'stroke-white': !hasWord,
        'stroke-black': hasWord,
        'text-white': !hasWord,
        'text-black': hasWord,
        'fill-white': hasWord,
        'fill-yellow-400': isTreasure(),
        'fill-blue-400': isWater(),
        'fill-red-400': isTrap(),
        'fill-purple-400': isCurse(),
        'fill-green-400': isAmulet(),
        'fill-gray-400': isExit(),
        'fill-transparent': !isSecret() && !hasWord,
        'stroke-2': isHovered(),
        'stroke-1': !isHovered(),
      }}
      style={{ 'grid-row': y, 'grid-column': x }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      pathClassList={{
        'opacity-60': isSecret(),
        'opacity-80': hasWord,
      }}
    >
      {word}
      <div>
        {isCurse() && <IoSkull size={24} />}
        {isWater() && <IoWater size={24} />}
        {isTreasure() && <IoDiamond size={24} />}
        {isAmulet() && <IoAperture size={24} />}
        {isTrap() && <FaSolidPersonFalling size={24} />}
        {isExit() && <FaSolidHelicopter size={24} />}
      </div>
    </Hexagon>
  );
};

const Hexagon = (
  props: ComponentProps<'div'> & {
    children?: JSX.Element;
    svgProps?: JSX.SvgSVGAttributes<SVGSVGElement>;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    pathClassList?: Record<string, boolean | undefined>;
  }
) => {
  const [_local, others] = splitProps(props, [
    'children',
    'svgProps',
    'pathClassList',
    'onMouseEnter',
    'onMouseLeave',
    'class',
  ]);
  return (
    <div class={`flex justify-center items-center ${props.class}`} {...others}>
      <svg
        {...props.svgProps}
        viewBox="0 0 84 84"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.0992 77L2.19922 42.5L22.0992 8H61.8992L81.7992 42.5L61.8992 77H22.0992Z"
          classList={props.pathClassList}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
        ></path>
      </svg>
      <div
        class="absolute flex flex-col justify-center items-center"
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
      >
        {props.children}
      </div>
    </div>
  );
};
