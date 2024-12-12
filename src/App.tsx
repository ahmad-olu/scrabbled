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

type OptionType = "normal" | "prefix" | "suffix" | "pattern";
const options: OptionType[] = ["normal", "prefix", "suffix", "pattern"];

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
  //   const [record, setRecord] = createSignal<Record[]>([]);
  //   const [loading, setLoading] = createSignal<boolean>(false);
  const [input, setInput] = createSignal("");
  const [dataPass, setDataPass] = createSignal<DataToPass>({
    input: "",
    option_type: "",
  });

  //FIXME audio not working
  const [isPlaying, setIsPlaying] = createSignal(true);
  let audio: HTMLAudioElement;
  const [isDialogOpen, setIsDialogOpen] = createSignal(false);

  //TODO? create a signal to hide description

  const toggleAudio = () => {
    if (isPlaying()) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Failed to play audio:", err));
    }
    setIsPlaying(!isPlaying());
  };

  onMount(() => {
    audio = new Audio("assets/dalek-explain.mp3"); // Ensure the path matches your asset location
    audio.loop = true; // Loop the audio
    audio.play().catch((err) => console.error("Failed to play audio:", err));

    // Cleanup on unmount
    onCleanup(() => {
      audio.pause();
      //  audio = null;
    });
  });

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
        <div class="h-1/8 flex items-center max-w-sm mx-auto space-x-4">
          <button
            onClick={openDialog}
            // class="text-lg font-bold text-red-900 animate-pulse"
            class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-red-900 animate-pulse transition"
            aria-label="Open Dialog"
          >
            Explain
          </button>
          <button
            onClick={toggleAudio}
            class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
            aria-label="Toggle Sound"
          >
            {isPlaying() ? (
              //   <FiVolume2 class="w-6 h-6" />
              <div class="w-6 h-6">🔊</div>
            ) : (
              <div class="w-6 h-6">🔇</div>
            )}
          </button>
        </div>
        {isDialogOpen() && (
          <div
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            aria-modal="true"
            role="dialog"
          >
            <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h2 class="text-xl font-semibold text-gray-700 mb-4">
                HOW I WORK
              </h2>
              <p class="text-gray-600 mb-6">
                You clicked the blinking button. Here is some content in the
                dialog.
              </p>
              <button
                onClick={closeDialog}
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        )}
        <h1 class=" h-1/8 text-center mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
          <span class="text-transparent bg-clip-text bg-gradient-to-r to-orange-800 from-sky-400">
            Scrabbled
          </span>{" "}
        </h1>

        <div class=" flex-grow overflow-y-scroll p-2 rounded-lg lg:w-6/12 lg:mx-auto scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-gray-500">
          {/* {records.loading && <p>Loading...</p>}
          {records.error && <p>Error: {records.error.message}</p>}
          {records() && <p>data: {records.length}</p>}
          <For each={records()}>
            {(item, _index) => <li class="text-grey-500">{item.word}</li>}
          </For> */}
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
                      {parseStringToHTML(item.definition)}
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

type SearchButtonProp = {
  find_word: () => void;
  //   input?: Accessor<string>;
  setInput: Setter<string>;
  selectedOption: Accessor<OptionType>;
  handleChange: (event: Event) => void;
};

function SearchButton(prop: SearchButtonProp) {
  return (
    <form
      class="flex items-center max-w-sm mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        prop.find_word();
      }}
    >
      <label for="simple-search" class="sr-only">
        Search
      </label>
      <div class="relative w-full">
        <input
          type="text"
          id="simple-search"
          class="bg-gray-200 border border-gray-900 text-gray-900 text-sm rounded-lg focus:ring-gray-500 focus:border-gray-500 block w-full ps-3 p-2.5  "
          placeholder="Search for matching words..."
          onChange={(e) => prop.setInput(e.currentTarget.value)}
          required
        />
      </div>
      <div class="ps-2">
        {/* <label for="option-select">Select Type: </label> */}
        <select
          id="option-select"
          value={prop.selectedOption()}
          onChange={prop.handleChange}
          class="ps-0.5 text-sm font-medium rounded-lg border border-r-4 h-11"
        >
          {options.map((option) => (
            <option value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        class="p-2.5 ms-2 text-sm font-medium text-white bg-gray-800 rounded-lg border border-r-4 border-gray-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-gray-300 "
      >
        <h6>search</h6>
        <span class="sr-only">Search</span>
      </button>
    </form>
  );
}

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
