use std::collections::HashMap;

use crate::utils::Record;

#[derive(Debug, Default)]
pub struct TrieNode {
    children: HashMap<char, TrieNode>,
    is_end_of_word: bool,
    word_data: Option<Record>, // Store word and definition
}

#[derive(Debug, Default)]
pub struct Trie {
    root: TrieNode,
}

impl Trie {
    pub fn new() -> Self {
        Trie {
            root: TrieNode::default(),
        }
    }

    pub fn insert(&mut self, entry: Record) {
        let mut current = &mut self.root;

        for c in entry.word.chars() {
            current = current.children.entry(c).or_insert_with(TrieNode::default);
        }

        current.is_end_of_word = true;
        current.word_data = Some(entry);
    }

    pub fn find_with_prefix(&self, prefix: &str) -> Vec<Record> {
        let mut current = &self.root;

        for c in prefix.chars() {
            if let Some(node) = current.children.get(&c) {
                current = node;
            } else {
                return vec![]; // Prefix not found
            }
        }

        let mut results = Vec::new();
        self.collect_words(current, &mut results);

        results
    }

    pub fn collect_words(&self, node: &TrieNode, results: &mut Vec<Record>) {
        if let Some(data) = &node.word_data {
            results.push(data.clone());
        }

        for child in node.children.values() {
            self.collect_words(child, results);
        }
    }
}

impl Trie {
    // Find all words matching a pattern with wildcards
    pub fn find_with_pattern(&self, pattern: &str) -> Vec<Record> {
        let mut results = Vec::new();
        self.match_pattern(&self.root, pattern, 0, &mut results);
        results
    }

    // Recursive function to match patterns
    pub fn match_pattern(
        &self,
        node: &TrieNode,
        pattern: &str,
        index: usize,
        results: &mut Vec<Record>,
    ) {
        // If we've reached the end of the pattern, collect words
        if index == pattern.len() {
            if let Some(word_data) = &node.word_data {
                results.push(word_data.clone());
            }
            return;
        }

        // Get the current character in the pattern
        let c = pattern.chars().nth(index).unwrap();

        if c == '_' || c == '?' {
            // Wildcard: Explore all possible branches
            for child in node.children.values() {
                self.match_pattern(child, pattern, index + 1, results);
            }
        } else if let Some(next_node) = node.children.get(&c) {
            // Match the character and proceed
            self.match_pattern(next_node, pattern, index + 1, results);
        }
    }
}

pub fn build_tries(entries: Vec<Record>) -> (Trie, Trie) {
    let mut prefix_trie = Trie::new();
    let mut suffix_trie = Trie::new();

    for entry in entries {
        prefix_trie.insert(entry.clone());

        // Insert reversed word into the suffix trie
        let mut reversed_entry = entry.clone();
        reversed_entry.word = entry.word.chars().rev().collect();
        suffix_trie.insert(reversed_entry);
    }

    (prefix_trie, suffix_trie)
}

pub fn find_prefix_matches(trie: &Trie, prefix: &str) -> Vec<Record> {
    trie.find_with_prefix(prefix)
}

pub fn find_suffix_matches(trie: &Trie, suffix: &str) -> Vec<Record> {
    let reversed_suffix: String = suffix.chars().rev().collect();
    let matches = trie.find_with_prefix(&reversed_suffix);

    matches
        .into_iter()
        .map(|mut entry| {
            entry.word = entry.word.chars().rev().collect();
            entry
        })
        .collect()
}

pub fn find_matches_with_pattern(trie: &Trie, pattern: &str) -> Vec<Record> {
    trie.find_with_pattern(pattern)
}
