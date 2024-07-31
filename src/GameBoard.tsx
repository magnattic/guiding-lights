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
  { x: 5, y: 2, word: 'piano' },

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
        {(item) => <SvgTile x={item().x} y={item().y} word={item().word} />}
      </Index>
    </div>
  );
};

const SvgTile = ({ x, y, word }: { x: number; y: number; word?: string }) => {
  const [isHovered, setHovered] = createSignal(false);
  const hasWord = word !== undefined;

  return (
    <div
      class={`text-black flex justify-center items-center scale-130 stroke-white`}
      style={{ 'grid-row': y, 'grid-column': x }}
      draggable="true"
    >
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 726 628"
        class="w-full h-full scale-130 drop-shadow-md"
      >
        <polygon
          points="723,314 543,625.769145 183,625.769145 3,314 183,2.230855 543,2.230855 723,314"
          fill={word ? 'white' : 'transparent'}
          stroke-width={isHovered() ? 20 : 10}
        />
      </svg> */}
      <svg
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        viewBox="0 0 84 84"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.0992 77L2.19922 42.5L22.0992 8H61.8992L81.7992 42.5L61.8992 77H22.0992Z"
          fill={word ? 'white' : 'transparent'}
          stroke-width={isHovered() ? 3 : 1}
          classList={{ 'stroke-black': hasWord }}
        ></path>
      </svg>
      <div
        class="absolute"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {word ?? `${x},${y}`}
      </div>
    </div>
  );
};
