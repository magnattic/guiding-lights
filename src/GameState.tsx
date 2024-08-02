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
  selectTile: (tile: TileData) => void;
  placeTile: (tile: TileData) => void;
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
  placeTile: (tile) =>
    set((state) => {
      if (state.tilesLeft === 0) return state;
      if (state.currentHint === null) return state;
      const baseState: Partial<GameState> = {
        tilesLeft: state.tilesLeft - 1,
        placedTiles: [
          ...state.placedTiles,
          { ...tile, word: state.currentHint! },
        ],
        selectedTile: null,
        currentHint: null,
      };
      switch (tile.type) {
        case 'treasure':
          return {
            ...baseState,
            foundSecrets: {
              ...state.foundSecrets,
              treasures: state.foundSecrets.treasures + 1,
            },
          };
        case 'water':
          return {
            ...baseState,
            foundSecrets: {
              ...state.foundSecrets,
              water: state.foundSecrets.water + 1,
            },
            tilesLeft: state.waterLimit,
          };
        case 'trap':
          return {
            ...baseState,
            foundSecrets: {
              ...state.foundSecrets,
              traps: state.foundSecrets.traps + 1,
            },
          };
        case 'curse':
          return {
            ...baseState,
            foundSecrets: {
              ...state.foundSecrets,
              curses: state.foundSecrets.curses + 1,
            },
          };
        case 'amulet':
          return {
            ...baseState,
            foundSecrets: { ...state.foundSecrets, amulet: true },
          };
        case 'exit':
          return {
            ...baseState,
            foundSecrets: { ...state.foundSecrets, exit: true },
          };
        default:
          return baseState;
      }
    }),
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
  selectTile: (tile: TileData) => set({ selectedTile: tile }),
  giveHint: (hint) => set({ currentHint: hint }),
  toggleSecrets: () =>
    set((state) => ({ secretsRevealed: !state.secretsRevealed })),
  updateGame: (gameState) => set(gameState),
}));
