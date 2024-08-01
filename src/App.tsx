import { createForm, SubmitHandler } from '@modular-forms/solid';
import * as R from 'remeda';
import { createSignal, Show } from 'solid-js';
import { BaseRoomConfig, joinRoom, Room } from 'trystero';
import './App.css';
import { GameBoard } from './GameBoard';
import { GameState, useGameState } from './GameState';

type RoomForm = {
  roomName: string;
};

const config: BaseRoomConfig = {
  appId: 'guiding-light',
  password: '1odja0du1ß23uedjqßaj1ß',
};

type SerializableGameState = Pick<
  GameState,
  'secrets' | 'secretsRevealed' | 'tilesLeft' | 'placedTiles'
>;

const handleRoomJoin = (room: Room) => {
  console.log('Room changed', room.getPeers());
  room.onPeerJoin((peerId) => console.log(`${peerId} joined`));
  room.onPeerLeave((peerId) => console.log(`${peerId} left`));

  const [sendGameState, getGameState] =
    room.makeAction<SerializableGameState>('sendGame');

  useGameState.subscribe((state, prevState) => {
    const {
      updateGame: _,
      startGame: __,
      toggleSecrets: ___,
      ...serializableState
    } = state;
    const { updateGame, startGame, toggleSecrets, ...prevSerializableState } =
      prevState;
    if (!R.isDeepEqual(prevState, state)) {
      console.log('Sending game state', state);
      sendGameState(serializableState);
    }
  });

  getGameState((state) => {
    console.log('Received game state', state);
    const updateGame = useGameState((state) => state.updateGame);
    updateGame(state);
  });
};

export const App = () => {
  const [room, setRoom] = createSignal<Room | null>(null);

  const [, { Form, Field }] = createForm<RoomForm>();

  const handleSubmit: SubmitHandler<RoomForm> = async (values) => {
    const room = joinRoom(config, values.roomName);
    handleRoomJoin(room);
    setRoom(room);
  };

  return (
    <Show
      when={true}
      fallback={
        <Form
          onSubmit={handleSubmit}
          class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div class="mb-4">
            <label
              class="block text-gray-700 text-lg font-bold mb-2"
              for="username"
            >
              Name des Spiels
            </label>

            <Field name="roomName">
              {(_field, props) => (
                <input
                  {...props}
                  class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Spielname"
                />
              )}
            </Field>
          </div>
          <div class="flex items-center justify-center">
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Beitreten
            </button>
          </div>
        </Form>
      }
    >
      <GameBoard />
    </Show>
  );
};

export default App;
