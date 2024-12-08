use std::{collections::HashMap, error::Error, fs::File, path::PathBuf};

use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Record {
    pub word: String,
    pub definition: String,
}

pub fn read_dataset(file_path: &PathBuf) -> Result<Vec<Record>, Box<dyn Error>> {
    let file = File::open(file_path)?;
    let mut rdr = csv::Reader::from_reader(file);
    let mut entries = Vec::new();

    for result in rdr.deserialize() {
        let record: Record = result?;
        entries.push(record);
    }
    Ok(entries)
}

pub fn preprocess_words(entries: Vec<Record>) -> HashMap<String, Vec<(String, String)>> {
    let mut word_map = HashMap::new();

    for entry in entries {
        let mut chars: Vec<char> = entry.word.chars().collect();
        chars.sort_unstable();
        let key: String = chars.into_iter().collect();

        word_map
            .entry(key)
            .or_insert(vec![])
            .push((entry.word.clone(), entry.definition.clone()));
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
