use serde::{Deserialize, Serialize};
use std::{collections::HashSet, sync::Mutex};
use tauri::State;
use utils::{call_all, Record};

pub mod trie_node;
pub mod utils;
pub mod word_definitions;

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
fn find_word(input: DataToPass) -> HashSet<Record> {
    if input.clone().input.is_empty() {
        return HashSet::new();
    }
    let result = call_all(&input.input, &input.option_type);
    result
}

#[derive(Default, Serialize, Deserialize)]

struct AppState {
    pub audio_played: bool,
}

struct SharedState(Mutex<AppState>);

// Check if the audio has been played
#[tauri::command]
fn check_audio_played(state: State<SharedState>) -> bool {
    let state = state.0.lock().unwrap();
    state.audio_played
}

// Set the audio as played
#[tauri::command]
fn set_audio_played(state: State<SharedState>) {
    let mut state = state.0.lock().unwrap();
    state.audio_played = true;
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .manage(SharedState(Mutex::new(AppState::default())))
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            find_word,
            check_audio_played,
            set_audio_played,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
