import { createSignal, Index } from 'solid-js';

// Hexagon grid of 8 x 13
const board = [
  { x: 1, y: 4 },
  { x: 2, y: 3 },
  { x: 3, y: 2 },
  { x: 4, y: 1 },

  { x: 1, y: 6 },
  { x: 2, y: 5 },
  { x: 3, y: 4 },
  { x: 4, y: 3 },
  { x: 5, y: 2 },

  { x: 1, y: 8 },
  { x: 2, y: 7 },
  { x: 3, y: 6 },
  { x: 4, y: 5 },
  { x: 5, y: 4 },
  { x: 6, y: 3 },

  { x: 1, y: 10 },
  { x: 2, y: 9 },
  { x: 3, y: 8 },
  { x: 4, y: 7 },
  { x: 5, y: 6 },
  { x: 6, y: 5 },
  { x: 7, y: 4 },

  { x: 2, y: 11 },
  { x: 3, y: 10 },
  { x: 4, y: 9 },
  { x: 5, y: 8 },
  { x: 6, y: 7 },
  { x: 7, y: 6 },

  { x: 3, y: 12 },
  { x: 4, y: 11 },
  { x: 5, y: 10 },
  { x: 6, y: 9 },
  { x: 7, y: 8 },

  { x: 4, y: 13 },
  { x: 5, y: 12 },
  { x: 6, y: 11 },
  { x: 7, y: 10 },
];

export const GameBoard = () => {
  const [boardTiles, setBoardTiles] = createSignal(board);

  return (
    <div class="hex-grid">
      <Index each={boardTiles()}>
        {(item) => <SvgTile x={item().x} y={item().y} />}
      </Index>
    </div>
  );
};

const Tile = ({ x, y }: { x: number; y: number }) => {
  return (
    <div
      draggable="true"
      style={{ 'grid-row': y, 'grid-column': x }}
      class={` text-slate-700 flex justify-center items-center hexagon bg-slate-50 w-24 h-20 scale-x-150 scale-y-150`}
    >
      {x},{y}
    </div>
  );
};

const SvgTile = ({ x, y }: { x: number; y: number }) => {
  return (
    <div
      class="text-slate-700 flex justify-center items-center scale-130"
      style={{ 'grid-row': y, 'grid-column': x }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 726 628"
        class="w-full h-full scale-130"
      >
        <polygon
          points="723,314 543,625.769145 183,625.769145 3,314 183,2.230855 543,2.230855 723,314"
          fill="transparent"
          stroke="blue"
          stroke-width="10"
        />
      </svg>
      <div class="absolute">
        {x},{y}
      </div>
    </div>
  );
};
