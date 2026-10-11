#!/usr/bin/env bash
# Auto-commit and push any working-tree changes. Never fails the session.
cd "$(dirname "$0")/.." || exit 0

[ "$(git branch --show-current)" = "main" ] || exit 0

git add -A
git diff --cached --quiet && exit 0

if git diff --cached --name-only | grep -Eq '(^|/)\.env($|\.)|\.pem$|\.key$'; then
  git reset -q
  echo "autosync: refused, a secret-looking file is staged" >&2
  exit 0
fi

files=$(git diff --cached --name-only | head -5 | paste -sd, -)
git commit -q -m "Auto-sync: ${files}

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>" || exit 0
git push -q origin main || echo "autosync: push failed, will retry next time" >&2
exit 0
