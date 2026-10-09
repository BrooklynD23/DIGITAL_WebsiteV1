#!/usr/bin/env bash
# Starts the design-lab dev server on :3100 if it is not already answering. Safe to call concurrently.
set -euo pipefail
ROOT="/home/danny/worktrees/digital-design-lab"
LOG="$ROOT/design-lab/.server.log"
if curl -s -o /dev/null -m 5 http://localhost:3100/; then echo "server up"; exit 0; fi
exec 9>"$ROOT/design-lab/.server.lock"
flock -w 120 9
if curl -s -o /dev/null -m 5 http://localhost:3100/; then echo "server up"; exit 0; fi
cd "$ROOT"
nohup npx next dev -p 3100 >"$LOG" 2>&1 &
for _ in $(seq 1 60); do
  sleep 2
  if curl -s -o /dev/null -m 5 http://localhost:3100/; then echo "server started"; exit 0; fi
done
echo "server failed to start; see $LOG" >&2
exit 1
