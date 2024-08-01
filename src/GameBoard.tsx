import { FaSolidHelicopter, FaSolidPersonFalling } from 'solid-icons/fa';
import { IoAperture, IoDiamond, IoSkull, IoWater } from 'solid-icons/io';
import {
  ComponentProps,
  createMemo,
  createSignal,
  For,
  JSX,
  splitProps,
} from 'solid-js';
import { tileConfig } from './GameBoard/tileConfig';
import { useGameState } from './GameState';
import { isSameTile, TileData } from './TileData';

export const GameBoard = () => {
  const placedTiles = useGameState((state) => state.placedTiles);
  const secrets = useGameState((state) => state.secrets);

  const boardTiles = createMemo((): TileData[] => {
    return tileConfig.map((tile) => {
      const placedTile = placedTiles().find((placedTile) =>
        isSameTile(placedTile, tile)
      );
      const secretTile = secrets().find((secret) => isSameTile(secret, tile));
      return placedTile ?? secretTile ?? tile;
    });
  });

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
      <SideMenu />
    </main>
  );
};

const SideMenu = () => {
  const availableTiles = useGameState((state) => state.tilesLeft);
  const startGame = useGameState((state) => state.startGame);
  const toggleSecrets = useGameState((state) => state.toggleSecrets);
  const secrets = useGameState((state) => state.secrets);

  return (
    <nav class="m-5 flex flex-col">
      <button onClick={startGame}>Neues Spiel starten</button>
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
