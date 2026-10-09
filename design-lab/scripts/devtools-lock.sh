#!/usr/bin/env bash
# Baton for the single shared chrome-devtools MCP browser. Parallel agents must hold it while driving the browser.
#   bash design-lab/scripts/devtools-lock.sh acquire <owner>   # exit 0 = you hold it, exit 1 = busy (prints holder)
#   bash design-lab/scripts/devtools-lock.sh release <owner>
# A lock older than 10 minutes is treated as stale and taken over.
set -uo pipefail
LOCK="/home/danny/worktrees/digital-design-lab/design-lab/.devtools.lock"
cmd="${1:-}"; owner="${2:-unknown}"
case "$cmd" in
  acquire)
    if mkdir "$LOCK" 2>/dev/null; then echo "$owner" >"$LOCK/owner"; echo "acquired by $owner"; exit 0; fi
    age=$(( $(date +%s) - $(stat -c %Y "$LOCK") ))
    if (( age > 600 )); then
      rm -rf "$LOCK" && mkdir "$LOCK" && echo "$owner" >"$LOCK/owner" && echo "acquired by $owner (stale lock taken over)" && exit 0
    fi
    echo "busy: held by $(cat "$LOCK/owner" 2>/dev/null) for ${age}s"; exit 1 ;;
  release)
    if [[ "$(cat "$LOCK/owner" 2>/dev/null)" == "$owner" ]]; then rm -rf "$LOCK"; echo "released"; else echo "not held by $owner"; fi ;;
  *) echo "usage: devtools-lock.sh acquire|release <owner>"; exit 2 ;;
esac
