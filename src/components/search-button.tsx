import { options, SearchButtonProp } from "../model/search-button-prop";

export function SearchButton(prop: SearchButtonProp) {
  return (
    <form
      class="flex items-center max-w-sm mx-auto fixed bottom-0 left-0 right-0 bg-white p-2 shadow-md"
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
