#!/usr/bin/env bash
#
# run.sh — quick test/dev launcher for the DIGITAL website (Next.js 14)
#
# Runs a set of pre-flight checks ("is everything good to go?") and then
# starts the app. By default it runs the checks and launches the dev server.
#
# Usage:
#   ./run.sh                Run checks, then start the dev server (default)
#   ./run.sh dev            Same as above
#   ./run.sh check          Run checks only, then exit (no server)
#   ./run.sh build          Run checks, then a production build (static export)
#   ./run.sh start          Run checks, build, then serve the production build
#   ./run.sh --skip-checks  Skip pre-flight checks (jump straight to the action)
#   ./run.sh -h | --help    Show this help
#
set -euo pipefail

# --- Locate project root (directory of this script) -------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# --- Pretty output ----------------------------------------------------------
if [[ -t 1 ]]; then
  RED=$'\033[0;31m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[1;33m'
  BLUE=$'\033[0;34m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  RED=""; GREEN=""; YELLOW=""; BLUE=""; BOLD=""; RESET=""
fi

FAILURES=0
pass()  { printf "  ${GREEN}✓${RESET} %s\n" "$1"; }
fail()  { printf "  ${RED}✗${RESET} %s\n" "$1"; FAILURES=$((FAILURES + 1)); }
warn()  { printf "  ${YELLOW}!${RESET} %s\n" "$1"; }
step()  { printf "\n${BOLD}${BLUE}==>${RESET} ${BOLD}%s${RESET}\n" "$1"; }

# --- Args -------------------------------------------------------------------
ACTION="dev"
SKIP_CHECKS=0
for arg in "$@"; do
  case "$arg" in
    dev|check|build|start) ACTION="$arg" ;;
    --skip-checks)         SKIP_CHECKS=1 ;;
    -h|--help)
      sed -n '2,20p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *)
      echo "${RED}Unknown argument:${RESET} $arg (try --help)" >&2
      exit 1 ;;
  esac
done

# ---------------------------------------------------------------------------
# Pre-flight checks
# ---------------------------------------------------------------------------
run_checks() {
  step "1/6  Toolchain"
  if command -v node >/dev/null 2>&1; then
    pass "node $(node --version)"
  else
    fail "node not found — install Node.js 18.17+"
  fi
  if command -v npm >/dev/null 2>&1; then
    pass "npm $(npm --version)"
  else
    fail "npm not found"
  fi

  step "2/6  Dependencies"
  if [[ -d node_modules && -d node_modules/next ]]; then
    pass "node_modules present"
  else
    warn "node_modules missing or incomplete — running 'npm install'"
    npm install
    if [[ -d node_modules/next ]]; then
      pass "dependencies installed"
    else
      fail "npm install did not produce node_modules/next"
    fi
  fi

  step "3/6  Critical files"
  CRITICAL_FILES=(
    "package.json"
    "next.config.js"
    "tsconfig.json"
    "tailwind.config.ts"
    "postcss.config.js"
    "app/layout.tsx"
    "app/page.tsx"
    "app/globals.css"
    "app/not-found.tsx"
    "lib/utils.ts"
    "lib/types.ts"
    "lib/data/siteConfig.ts"
    "lib/data/projects.ts"
    "lib/data/team.ts"
    "lib/data/involvement.ts"
  )
  for f in "${CRITICAL_FILES[@]}"; do
    if [[ -s "$f" ]]; then
      pass "$f"
    else
      fail "$f is missing or empty"
    fi
  done

  step "4/6  Routes (app pages)"
  ROUTE_PAGES=(
    "app/page.tsx"
    "app/about/page.tsx"
    "app/contact/page.tsx"
    "app/get-involved/page.tsx"
    "app/pillars/page.tsx"
    "app/projects/page.tsx"
    "app/projects/[slug]/page.tsx"
    "app/team/page.tsx"
  )
  for p in "${ROUTE_PAGES[@]}"; do
    if [[ -s "$p" ]]; then
      pass "${p#app/}"
    else
      fail "route page missing: $p"
    fi
  done

  step "5/6  TypeScript type-check"
  if npx --no-install tsc --noEmit >/tmp/run-tsc.log 2>&1; then
    pass "tsc --noEmit clean"
  else
    fail "TypeScript errors (see below)"
    sed 's/^/      /' /tmp/run-tsc.log
  fi

  step "6/6  Lint"
  if npm run lint >/tmp/run-lint.log 2>&1; then
    pass "next lint clean"
  else
    warn "lint reported issues (non-blocking) — see /tmp/run-lint.log"
    sed 's/^/      /' /tmp/run-lint.log | tail -n 20
  fi

  echo
  if [[ "$FAILURES" -gt 0 ]]; then
    printf "${RED}${BOLD}✗ %d critical check(s) failed.${RESET} Fix the above before running.\n" "$FAILURES"
    return 1
  fi
  printf "${GREEN}${BOLD}✓ All critical checks passed.${RESET}\n"
  return 0
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
if [[ "$SKIP_CHECKS" -eq 0 ]]; then
  if ! run_checks; then
    exit 1
  fi
else
  warn "Skipping pre-flight checks (--skip-checks)"
fi

case "$ACTION" in
  check)
    echo "${GREEN}Checks complete.${RESET} (no server started)"
    ;;
  dev)
    step "Starting dev server  →  http://localhost:3000"
    exec npm run dev
    ;;
  build)
    step "Building production (static export → ./out)"
    exec npm run build
    ;;
  start)
    step "Building, then serving production"
    npm run build
    exec npm run start
    ;;
esac
