#!/usr/bin/env node
/**
 * build.js — Scans entries/ and generates manifest.json
 *
 * Run: node build.js
 *
 * manifest.json is used by index.html to populate the sidebar and
 * know which entry files exist. It contains lean metadata only
 * (date, type, title, and month for summaries).
 *
 * To add an entry: create entries/YYYY-MM/YYYY-MM-DD.json, then run this script.
 * To remove an entry: delete its JSON file, then run this script.
 */

const fs   = require('fs');
const path = require('path');

const ENTRIES_DIR   = path.join(__dirname, 'entries');
const MANIFEST_PATH = path.join(__dirname, 'manifest.json');

if (!fs.existsSync(ENTRIES_DIR)) {
  console.error('No entries/ directory found.');
  process.exit(1);
}

const manifest = [];

// Sort month folders chronologically (YYYY-MM format sorts lexically)
const monthFolders = fs.readdirSync(ENTRIES_DIR)
  .filter(name => /^\d{4}-\d{2}$/.test(name))
  .sort();

for (const monthFolder of monthFolders) {
  const monthPath = path.join(ENTRIES_DIR, monthFolder);
  const stat = fs.statSync(monthPath);
  if (!stat.isDirectory()) continue;

  // Sort entry files chronologically
  const files = fs.readdirSync(monthPath)
    .filter(f => f.endsWith('.json'))
    .sort();

  for (const file of files) {
    const filePath = path.join(monthPath, file);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.error(`Error parsing ${filePath}: ${err.message}`);
      process.exit(1);
    }

    if (!data.date || !data.type || !data.title) {
      console.error(`Missing required fields (date, type, title) in ${filePath}`);
      process.exit(1);
    }

    const entry = { date: data.date, type: data.type, title: data.title };
    if (data.type === 'summary' && data.month) {
      entry.month = data.month;
    }

    manifest.push(entry);
  }
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
console.log(`✓ manifest.json written with ${manifest.length} entr${manifest.length === 1 ? 'y' : 'ies'}.`);
