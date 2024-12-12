import { Accessor, Setter } from "solid-js";

export type OptionType = "normal" | "prefix" | "suffix" | "pattern";
export const options: OptionType[] = ["normal", "prefix", "suffix", "pattern"];

export type SearchButtonProp = {
  find_word: () => void;
  //   input?: Accessor<string>;
  setInput: Setter<string>;
  selectedOption: Accessor<OptionType>;
  handleChange: (event: Event) => void;
};
