#!/usr/bin/env bash
# Auto-commit all changes and push to origin after every Claude turn.
# Runs from the Stop hook. Silent no-op when there is nothing to commit.

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/..}" || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

git add -A
# Nothing staged -> nothing changed -> exit quietly
git diff --cached --quiet && exit 0

git commit -m "Auto-commit: update Catman ($(date '+%Y-%m-%d %H:%M:%S'))" >/dev/null 2>&1
git push origin HEAD >/dev/null 2>&1

exit 0
