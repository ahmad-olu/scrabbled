// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// * versionCode = (version.major * 1,000,000) + (version.minor * 1,000) + (version.patch)
// 1.2.3
// * versionCode = (1 * 1,000,000) + (2 * 1,000) + 3 = 1,002,003

//versionCode = 2,100,000,000
fn main() {
    scrabbled_lib::run()
}
