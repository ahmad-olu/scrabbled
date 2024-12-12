import { Accessor } from "solid-js";

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
            <div class="w-6 h-6">yes</div>
          ) : (
            <div class="w-6 h-6">No</div>
          )}
        </button>
      </div>
      {prop.isDialogOpen() && (
        <div
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div class="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">HOW I WORK</h2>
            <p class="text-gray-600 mb-6">
              You clicked the blinking button. Here is some content in the
              dialog.
            </p>
            <button
              onClick={prop.closeDialog}
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
