import { For } from "solid-js";

export function Skeleton() {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  return (
    <div
      role="status"
      class="max-w-full ms-2 p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
    >
      <For each={data}>
        {(_item, _index) => (
          <div class="flex items-center justify-between">
            <div>
              <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
              <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
          </div>
        )}
      </For>
      <span class="sr-only">Loading...</span>
    </div>
  );
}
