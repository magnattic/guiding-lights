import { FaSolidHelicopter, FaSolidPersonFalling } from 'solid-icons/fa';
import {
  IoAperture,
  IoDiamond,
  IoSearch,
  IoSkull,
  IoWater,
} from 'solid-icons/io';
import { createMemo, createSignal, For } from 'solid-js';
import { tileConfig } from './GameBoard/tileConfig';
import { useGameState } from './GameState';
import { Hexagon } from './Hexagon';
import { SideMenu } from './SideMenu';
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

const BoardTile = ({ x, y, word, type }: TileData) => {
  const [isHovered, setHovered] = createSignal(false);

  const secretsRevealed = useGameState((state) => state.secretsRevealed);
  const selectedTile = useGameState((state) => state.selectedTile);
  const selectTile = useGameState((state) => state.selectTile);

  const hasWord = word !== undefined;
  const revealedType = () => (secretsRevealed() || hasWord ? type : undefined);
  const isTreasure = () => revealedType() === 'treasure';
  const isWater = () => revealedType() === 'water';
  const isTrap = () => revealedType() === 'trap';
  const isCurse = () => revealedType() === 'curse';
  const isAmulet = () => revealedType() === 'amulet';
  const isExit = () => revealedType() === 'exit';
  const isSecret = () => !hasWord && revealedType() !== undefined;
  const isSelected = () => {
    const selected = selectedTile();
    return selected != null && isSameTile(selected, { x, y });
  };
  const placeTile = useGameState((state) => state.placeTile);

  return (
    <Hexagon
      classList={{
        'scale-130': true,
        'stroke-white': !hasWord,
        'stroke-black': hasWord,
        'stroke-yellow-500': isSelected(),
        'text-white': !hasWord,
        'text-black': hasWord,
        'fill-white': hasWord,
        'fill-yellow-400': isTreasure(),
        'fill-blue-400': isWater(),
        'fill-red-400': isTrap(),
        'fill-purple-400': isCurse(),
        'fill-green-400': isAmulet(),
        'fill-gray-400': isExit(),
        'fill-sky-500': isSelected(),
        'fill-transparent': !isSecret() && !hasWord,
        'stroke-[4]': isHovered() || isSelected(),
        'stroke-1': !isHovered(),
        'cursor-pointer': true,
      }}
      style={{ 'grid-row': y, 'grid-column': x }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (isSelected()) {
          placeTile({ x, y, word, type });
        } else if (!hasWord) {
          selectTile({ x, y });
        }
      }}
      pathClassList={{
        'opacity-60': isSecret() || isSelected(),
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
        {isSelected() && <IoSearch size={24} />}
      </div>
    </Hexagon>
  );
};
