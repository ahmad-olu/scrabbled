use std::fs::read;

use tauri::{path::BaseDirectory, Manager};
use trie_node::{build_tries, find_matches_with_pattern, find_prefix_matches, find_suffix_matches};
use utils::{find_words_with_definitions, preprocess_words, read_dataset, Record};

pub mod trie_node;
pub mod utils;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn find_word(input: &str, handle: tauri::AppHandle) -> Vec<Record> {
    let resource_path = handle
        .path()
        .resolve("assets/data/dict.csv", BaseDirectory::Resource)
        .unwrap();

    let word_entries = read_dataset(&resource_path).unwrap();

    let word_map = preprocess_words(word_entries);

    let matches = find_words_with_definitions(&word_map, input);

    let mut res: Vec<Record> = Vec::new();

    for (word, definition) in matches {
        res.push(Record { word, definition });
    }

    // Build prefix and suffix tries
    let word_entries = read_dataset(&resource_path).unwrap();
    let (prefix_trie, suffix_trie) = build_tries(word_entries);

    // Prefix Search
    let prefix_matches = find_prefix_matches(&prefix_trie, input);
    for entry in &prefix_matches {
        res.push(entry.to_owned());
    }

    // Suffix Search

    let suffix_matches = find_suffix_matches(&suffix_trie, input);
    for entry in &suffix_matches {
        res.push(entry.to_owned());
    }

    // Pattern Matching
    let matches = find_matches_with_pattern(&prefix_trie, input);
    for entry in matches {
        res.push(entry);
    }

    res
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, find_word])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
