import { createWithSignal } from 'solid-zustand';
import {
  generateSecrets,
  generateStartingTiles,
} from './generateStartingTiles';
import { TileData } from './TileData';

export type GameState = {
  tilesLeft: number;
  selectedTile: TileData | null;
  placedTiles: TileData[];
  currentHint: string | null;
  secrets: TileData[];
  secretsRevealed: boolean;
  waterLimit: number;
  foundSecrets: {
    treasures: number;
    water: number;
    traps: number;
    curses: number;
    amulet: boolean;
    exit: boolean;
  };
  placeTile: () => void;
  giveHint: (hint: string) => void;
  startGame: () => void;
  toggleSecrets: () => void;
  updateGame: (gameState: Partial<GameState>) => void;
};

const emptyState = {
  tilesLeft: 0,
  currentHint: null,
  selectedTile: null,
  placedTiles: [],
  secrets: [],
  secretsRevealed: false,
  waterLimit: 0,
  foundSecrets: {
    treasures: 0,
    water: 0,
    traps: 0,
    curses: 0,
    amulet: false,
    exit: false,
  },
};

export const useGameState = createWithSignal<GameState>((set) => ({
  ...emptyState,
  placeTile: () => set((state) => ({ tilesLeft: state.tilesLeft - 1 })),
  startGame: () => {
    const startingTiles = generateStartingTiles();
    set({
      ...emptyState,
      tilesLeft: 7,
      placedTiles: startingTiles,
      secrets: generateSecrets(startingTiles),
      waterLimit: 7,
    });
  },
  giveHint: (hint) => set({ currentHint: hint }),
  toggleSecrets: () =>
    set((state) => ({ secretsRevealed: !state.secretsRevealed })),
  updateGame: (gameState) => set(gameState),
}));
