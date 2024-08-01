import { range } from 'remeda';
import { Button } from './components/ui/button';
import { useGameState } from './GameState';
import { Hexagon } from './Hexagon';
import { For, Show } from 'solid-js';
import {
  TextField,
  TextFieldInput,
  TextFieldLabel,
} from './components/ui/text-field';
import { createForm, getValue, reset } from '@modular-forms/solid';

export const SideMenu = () => {
  const availableTiles = useGameState((state) => state.tilesLeft);
  const currentHint = useGameState((state) => state.currentHint);
  const startGame = useGameState((state) => state.startGame);
  const waterLimit = useGameState((state) => state.waterLimit);
  const foundSecrets = useGameState((state) => state.foundSecrets);

  return (
    <nav class="m-5 flex flex-col gap-5 w-[200px] items-center">
      <Button onClick={startGame}>Neues Spiel starten</Button>
      <div>
        <div class="flex relative h-32 w-32 p-4">
          <For each={range(0, availableTiles() > 0 ? availableTiles() : 1)}>
            {(index) => (
              <Hexagon
                class="fill-white stroke-black text-black text-4xl absolute h-full w-full"
                style={{
                  right: `${(availableTiles() - index) * 3}px`,
                  bottom: `${index * 3}px`,
                }}
              >
                {availableTiles()}
              </Hexagon>
            )}
          </For>
        </div>
        <div>Kacheln übrig</div>
      </div>

      <div class="w-full h-40 relative">
        <Show when={currentHint()} fallback={<div>Kein Hinweis</div>}>
          <Hexagon
            class="fill-white stroke-black text-black text-4xl absolute h-full w-full"
            svgProps={{ class: 'h-full w-full' }}
          >
            {currentHint()}
          </Hexagon>
        </Show>
      </div>

      <hr class="h-px bg-gray-200 border-0 dark:bg-gray-700" />

      <div class="flex flex-col">
        <div>Wasser Limit: {waterLimit()}</div>
        <div>Schätze: {foundSecrets().treasures} von 3</div>
        <div>Fallen: {foundSecrets().traps} von 3</div>
        <div>Wasser: {foundSecrets().water} von 3</div>
        <div>Flüche: {foundSecrets().curses} von 3</div>
        <div>Amulett: {foundSecrets().amulet ? 1 : 0} von 1</div>
        <div>Ausgang: {foundSecrets().exit ? 1 : 0} von 1</div>
      </div>

      <GuideMenu />
    </nav>
  );
};

const GuideMenu = () => {
  const toggleSecrets = useGameState((state) => state.toggleSecrets);
  const secrets = useGameState((state) => state.secrets);
  const secretsRevealed = useGameState((state) => state.secretsRevealed);
  const giveHint = useGameState((state) => state.giveHint);

  const [form, { Field }] = createForm<{ hint: string }>({
    initialValues: { hint: '' },
  });

  return (
    <>
      <Button onClick={toggleSecrets}>Geheimnisse {secrets().length}</Button>

      <Show when={secretsRevealed()}>
        <Field name="hint">
          {(field, props) => (
            <TextField class="grid w-full max-w-sm items-center gap-1.5">
              <TextFieldLabel for="word">Nächster Hinweis</TextFieldLabel>
              <TextFieldInput
                type="text"
                id="word"
                placeholder="Neues Wort"
                value={field.value}
                {...props}
              />
            </TextField>
          )}
        </Field>
        <Button
          variant="secondary"
          onClick={() => {
            const hint = getValue(form, 'hint');
            console.log(JSON.stringify(hint));
            if (hint && hint.length > 0) {
              giveHint(hint);
              reset(form, 'hint');
            }
          }}
        >
          Hinweis geben
        </Button>
      </Show>
    </>
  );
};
