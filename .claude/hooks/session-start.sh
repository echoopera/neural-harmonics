#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

# This project is a static HTML app with no local dependencies.
# All libraries (React, Tailwind, Babel) are loaded from CDNs at runtime.
echo "Session ready: no dependencies to install for static HTML project."
