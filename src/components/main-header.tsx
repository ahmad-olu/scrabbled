import { Accessor, For, Show } from "solid-js";

export type AppBarProp = {
  openDialog: () => void;
  toggleAudio: () => void;
  isPlaying: Accessor<boolean>;
  isDialogOpen: Accessor<boolean>;
  closeDialog: () => void;
  toggleShowDescription: () => void;
  showDescription: Accessor<boolean>;
};

export function AppBar(prop: AppBarProp) {
  return (
    <>
      <div class="h-1/8 flex items-center max-w-sm mx-auto space-x-4">
        <button
          onClick={prop.openDialog}
          // class="text-lg font-bold text-red-900 animate-pulse"
          class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 font-bold text-red-900 animate-pulse transition"
          aria-label="Open Dialog"
        >
          Explain
        </button>
        <button
          onClick={prop.toggleAudio}
          class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
          aria-label="Toggle Sound"
        >
          {prop.isPlaying() ? (
            //   <FiVolume2 class="w-6 h-6" />
            <div class="w-6 h-6">🔊</div>
          ) : (
            <div class="w-6 h-6">🔇</div>
          )}
        </button>

        <button
          onClick={prop.toggleShowDescription}
          class="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
          aria-label="Toggle Sound"
        >
          {prop.showDescription() ? (
            //   <FiVolume2 class="w-6 h-6" />
            <div class="w-6 h-6">📖</div>
          ) : (
            <div class="w-6 h-6">📕</div>
          )}
        </button>
      </div>
      <Dialog closeDialog={prop.closeDialog} isDialogOpen={prop.isDialogOpen} />
    </>
  );
}

type DialogPop = {
  closeDialog: () => void;
  isDialogOpen: Accessor<boolean>;
};

type DataForDialog = {
  title: string;
  description: string;
};

function Dialog(prop: DialogPop) {
  let data: DataForDialog[] = [
    {
      title: "Explain",
      description:
        "This option provides an explanation of the app's key features and functionality. It covers how to use the app to find words, manage filters, and understand the available modes.",
    },
    {
      title: "🔊 / 🔇",
      description:
        "This option plays or stops the explanation soundtrack. Click the icon to toggle between playing and stopping the audio guide.",
    },
    {
      title: "📖 / 📕",
      description:
        "This option toggles the display of descriptions for each feature. 📖 shows the details, while 📕 hides them for a cleaner interface.",
    },
    {
      title: "Normal, Prefix, Suffix, Pattern",
      description:
        "This is the filter option:\n" +
        "- **Normal**: Finds possible words using the given characters.\n" +
        "- **Prefix**: Finds words that start with the provided characters.\n" +
        "- **Suffix**: Finds words that end with the provided characters.\n" +
        "- **Pattern**: Shows patterns using `_` or `?` as placeholders. For example:\n" +
        "  - Input: `ca_` or `ca?` finds words like 'cat' or 'cap'.\n" +
        "  - Input: `a_e` or `a?e` finds words like 'ace' or 'ape'.",
    },
  ];
  return (
    <Show when={prop.isDialogOpen() === true}>
      <div
        class="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center z-50"
        aria-modal="true"
        role="dialog"
      >
        <div class="bg-white rounded-lg p-6 w-4/5 shadow-lg">
          <h2 class="text-xl font-mono font-bold text-gray-700 mb-4">
            HOW I WORK
          </h2>
          {/* line-through */}
          <ul class="list-decimal pl-5 space-y-2">
            <For each={data}>
              {(item, _index) => (
                <li class="text-grey-500">
                  {item.title} := {item.description}
                </li>
              )}
            </For>
          </ul>
          <button
            onClick={prop.closeDialog}
            class="p-2.5 mt-8 ms-2 w-32 text-sm font-medium text-white bg-gray-800 rounded-lg border border-r-4 border-gray-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-gray-300 "
          >
            Close
          </button>
        </div>
      </div>
    </Show>
  );
}
