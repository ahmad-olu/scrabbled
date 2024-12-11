use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use utils::{call_all, Record};

pub mod trie_node;
pub mod utils;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Debug, Deserialize, Serialize, Clone)]
struct DataToPass {
    input: String,
    option_type: String,
}

#[tauri::command]
fn find_word(input: DataToPass, handle: tauri::AppHandle) -> HashSet<Record> {
    if input.clone().input.is_empty() {
        return HashSet::new();
    }
    call_all(&input.input, &input.option_type, handle)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, find_word])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
