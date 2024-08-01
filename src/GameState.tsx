import { createWithSignal } from 'solid-zustand';
import {
  generateSecrets,
  generateStartingTiles,
} from './generateStartingTiles';
import { TileData } from './TileData';

export type GameState = {
  tilesLeft: number;
  placedTiles: TileData[];
  secrets: TileData[];
  secretsRevealed: boolean;
  waterLimit: number;
  treasuresFound: number;
  waterFound: number;
  trapsFound: number;
  cursesFound: number;
  amuletFound: boolean;
  exitFound: boolean;
  placeTile: () => void;
  startGame: () => void;
  toggleSecrets: () => void;
  updateGame: (gameState: Partial<GameState>) => void;
};

export const useGameState = createWithSignal<GameState>((set) => ({
  tilesLeft: 0,
  placedTiles: [],
  secrets: [],
  secretsRevealed: false,
  waterLimit: 0,
  treasuresFound: 0,
  waterFound: 0,
  trapsFound: 0,
  cursesFound: 0,
  amuletFound: false,
  exitFound: false,
  placeTile: () => set((state) => ({ tilesLeft: state.tilesLeft - 1 })),
  startGame: () => {
    const startingTiles = generateStartingTiles();
    set({
      tilesLeft: 7,
      placedTiles: startingTiles,
      secrets: generateSecrets(startingTiles),
      waterLimit: 7,
      treasuresFound: 0,
      waterFound: 0,
      trapsFound: 0,
      cursesFound: 0,
      amuletFound: false,
      exitFound: false,
    });
  },
  toggleSecrets: () =>
    set((state) => ({ secretsRevealed: !state.secretsRevealed })),
  updateGame: (gameState) => set(gameState),
}));
