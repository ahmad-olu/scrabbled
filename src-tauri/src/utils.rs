use std::{
    collections::{HashMap, HashSet},
    error::Error,
    fs::File,
    path::PathBuf,
};

use serde::{Deserialize, Serialize};
use tauri::{path::BaseDirectory, Manager};

use crate::{
    trie_node::{build_tries, find_matches_with_pattern, find_prefix_matches, find_suffix_matches},
    word_definitions::{WordDefinition, WORDS},
};

#[derive(Debug, Deserialize, Serialize, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Record {
    pub word: String,
    pub definition: String,
}

fn convert_to_vec(words: &[WordDefinition]) -> Vec<Record> {
    words
        .iter() // Iterate over the slice
        .map(|wd| Record {
            word: wd.word.to_string(),
            definition: wd.definition.to_string(),
        })
        .collect() // Collect the mapped items into a Vec
}

// pub fn read_dataset(file_path: &PathBuf) -> Result<Vec<WordDefinition>, Box<dyn Error>> {
//     let file = File::open(file_path).map_err(|e| e)?;
//     let mut rdr = csv::Reader::from_reader(file);
//     let mut entries = Vec::new();
//     for result in rdr.deserialize() {
//         let record: WordDefinition = result?;
//         entries.push(record);
//     }
//     Ok(entries)
// }

pub fn preprocess_words(entries: &[WordDefinition]) -> HashMap<String, Vec<(String, String)>> {
    let mut word_map = HashMap::new();

    for entry in entries {
        let mut chars: Vec<char> = entry.word.chars().collect();
        chars.sort_unstable();
        let key: String = chars.into_iter().collect();

        word_map
            .entry(key)
            .or_insert(vec![])
            .push((String::from(entry.word), String::from(entry.definition)));
    }

    word_map
}

pub fn find_words_with_definitions(
    word_map: &HashMap<String, Vec<(String, String)>>,
    input: &str,
) -> Vec<(String, String)> {
    let mut chars: Vec<char> = input.chars().collect();
    chars.sort_unstable();
    let key: String = chars.into_iter().collect();

    word_map.get(&key).cloned().unwrap_or_default()
}

//type OptionType = "normal" | "prefix" | "suffix" | "pattern";

pub fn call_all(input: &str, option_type: &str) -> HashSet<Record> {
    let word_entries = WORDS;
    let mut res = HashSet::<Record>::new();

    if option_type == "normal" {
        let word_map = preprocess_words(word_entries);

        let matches = find_words_with_definitions(&word_map, input);

        for (word, definition) in matches {
            res.insert(Record { word, definition });
        }
    } else {
        // Build prefix and suffix tries
        let word_entries = WORDS;
        let (prefix_trie, suffix_trie) = build_tries(convert_to_vec(word_entries));
        match option_type {
            "prefix" => {
                // Prefix Search
                let prefix_matches = find_prefix_matches(&prefix_trie, input);
                for entry in &prefix_matches {
                    res.insert(entry.to_owned());
                }
            }
            "suffix" => {
                // Suffix Search
                let suffix_matches = find_suffix_matches(&suffix_trie, input);
                for entry in &suffix_matches {
                    res.insert(entry.to_owned());
                }
            }
            "pattern" => {
                // Pattern Matching
                let matches = find_matches_with_pattern(&prefix_trie, input);
                for entry in matches {
                    res.insert(entry);
                }
            }
            _ => {}
        }
    }

    res
}

//---------------------

// #[derive(Debug, thiserror::Error)]
// pub enum Error {
//     // #[error("Failed to read file: {0}")]
//     // Io(#[from] std::io::Error),
//     // #[error("File is not valid utf8: {0}")]
//     // Utf8(#[from] std::string::FromUtf8Error),

//     // TODO: Replace the above error entries with more appropriate ones here
// }

// impl serde::Serialize for Error {
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//         S: serde::ser::Serializer,
//     {
//         serializer.serialize_str(self.to_string().as_ref())
//     }
// }

//---------------
