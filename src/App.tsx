import {
  Accessor,
  createEffect,
  createResource,
  createSignal,
  JSX,
  Match,
  onCleanup,
  onMount,
  Setter,
  Show,
  Switch,
} from "solid-js";
import { For } from "solid-js";

import { invoke } from "@tauri-apps/api/core";
import { SearchButton } from "./components/search-button";
import { AppBar } from "./components/main-header";
import { OptionType } from "./model/search-button-prop";

type Record = {
  word: string;
  definition: string;
};

type DataToPass = {
  input: string;
  option_type: string;
};

async function fetchRecords(input: DataToPass): Promise<Record[]> {
  try {
    return await invoke("find_word", {
      input: input,
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    throw error; // Propagate the error so `createResource` can handle it
  }
}

function App() {
  const [input, setInput] = createSignal("");
  const [dataPass, setDataPass] = createSignal<DataToPass>({
    input: "",
    option_type: "",
  });

  const [isPlaying, setIsPlaying] = createSignal(false);
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);
  const [showDescription, setShowDescription] = createSignal(false);

  const toggleAudio = () => {
    const audio = new Audio("/dalek-explain.mp3");
    audio.play();
    setIsPlaying(true);

    audio.onended = () => setIsPlaying(false);
  };

  createEffect(async () => {
    const hasPlayed = await invoke<boolean>("check_audio_played");
    if (!hasPlayed) {
      toggleAudio();

      await invoke("set_audio_played");
    }
  });

  const toggleShowDescription = () => {
    setShowDescription(!showDescription());
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  //   async function findWord() {
  //     setLoading(true);
  //     setRecord(await invoke("find_word", { input: input() }));
  //     setLoading(false);
  //   }

  const [selectedOption, setSelectedOption] =
    createSignal<OptionType>("normal");
  const handleChange = (event: Event) => {
    const value = (event.target as HTMLSelectElement).value as OptionType;
    setSelectedOption(value);
  };

  const [records, { refetch }] = createResource(() => dataPass(), fetchRecords);
  const findWord = () => {
    if (input().trim()) {
      refetch(); // Trigger resource fetching with current input
    }
  };

  createEffect(() => {
    setDataPass({ input: input(), option_type: selectedOption() });
  });

  return (
    <main class="">
      <div class="flex flex-col space-y-3 h-screen px-2 py-7">
        <AppBar
          openDialog={openDialog}
          toggleAudio={toggleAudio}
          isPlaying={isPlaying}
          isDialogOpen={isDialogOpen}
          closeDialog={closeDialog}
          toggleShowDescription={toggleShowDescription}
          showDescription={showDescription}
        />
        <h1 class=" h-1/8 text-center mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-orange-800 from-sky-400">
            Scrabbled
          </span>{" "}
        </h1>

        <div class=" flex-grow overflow-y-scroll p-2 rounded-lg lg:w-6/12 lg:mx-auto scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-gray-500">
          <Show when={records.loading === true}>
            <p>Loading...</p>
          </Show>
          <Switch fallback={<p>No data...</p>}>
            <Match when={records.loading === false}>
              <ul class="pl-5 space-y-2">
                <For each={records()}>
                  {(item, index) => (
                    <li class="text-grey-500">
                      {index() + 1}: 🟫 {item.word} :{" "}
                      <Show when={showDescription() === true}>
                        {parseStringToHTML(item.definition)}
                      </Show>
                    </li>
                  )}
                </For>
              </ul>
            </Match>
          </Switch>
        </div>
        <div class=" h-1/8">
          <SearchButton
            find_word={findWord}
            setInput={setInput}
            selectedOption={selectedOption}
            handleChange={handleChange}
          />
        </div>
      </div>
    </main>
  );
}

export default App;

function parseStringToHTML(input: string): JSX.Element {
  // Split the input into lines by detecting patterns for paragraphs and lists
  const lines = input.split("\n").filter((line) => line.trim() !== "");

  // Extract and structure the content
  const firstLine = lines.shift(); // First line as the paragraph
  const listItems = lines.map((line) => line.trim().replace(/^\d+\.\s*/, "")); // Remove numbering

  return (
    <div>
      {/* Render the first paragraph */}
      <p>{firstLine}</p>

      {/* Render the list */}
      <ul>
        {listItems.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  );
}
