#!/usr/bin/env bash
# zip-docs.sh — bundle the docs/ markdown files into a distributable zip
set -euo pipefail

DOCS_DIR="$(dirname "$0")/docs"
OUTPUT="neural-harmonics-docs.zip"

if [ ! -d "$DOCS_DIR" ]; then
  echo "Error: docs/ directory not found at $DOCS_DIR" >&2
  exit 1
fi

zip -j "$OUTPUT" "$DOCS_DIR"/*.md

echo "Created $OUTPUT containing:"
unzip -l "$OUTPUT" | grep '\.md'
