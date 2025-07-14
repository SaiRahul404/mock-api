#!/bin/bash

# === CONFIGURATION ===
TRANSLATION_DIR="i18n"           # Directory where Passolo saves .json files
TEMP_BRANCH="translation-temp"   # Branch that triggers the GitHub Action

# === Git Setup Check ===
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "❌ This is not a git repository. Please run inside your cloned repo."
  exit 1
fi

# === Check for JSON files ===
if [ -z "$(find "$TRANSLATION_DIR" -type f -name '*.json')" ]; then
  echo "❌ No .json files found in $TRANSLATION_DIR. Nothing to push."
  exit 1
fi

echo "🚀 Preparing to push translation files from $TRANSLATION_DIR to $TEMP_BRANCH..."

# === Create / Switch to the temp branch ===
git checkout -B "$TEMP_BRANCH"

# === Stage and commit all .json files ===
git add "$TRANSLATION_DIR"/*.json

if git diff --cached --quiet; then
  echo "⚠️ No changes to commit. Files already pushed?"
else
  git commit -m "chore: Upload Passolo-translated .json files to $TRANSLATION_DIR"
  echo "✅ Committed translation files."
fi

# === Push to GitHub ===
git push origin "$TEMP_BRANCH" --force
echo "✅ Pushed to remote branch '$TEMP_BRANCH'. GitHub Actions should now run."
