# Project Log

## 2026-02-15
- Pica agent audit: diagnosed 6 systemic issues — 2 crons likely unregistered (8 AM X Scan, Wednesday Newsletter Reminder), content-feedback.jsonl being skipped by Haiku on most sessions, no research request mechanism, newsletter-angles never produced, broken newsletter sources. Moltzart applied all 6 fixes on Mac Mini.
- Fixed radar parser bug in `src/lib/github.ts` — `---` separators in content-radar markdown were flushing the current section, causing items after the separator to render as title-only. Now `---` lines are skipped without breaking section state.
- **Decision:** All Pica output to content-radar files must use v3 radar format, no exceptions — including research responses and one-off requests. Format enforcement added to Pica's AGENTS.md by Moltzart.
- Updated git remote from `moltzart/moltzart.com` to `mattdowney/moltzart.com` (GitHub repo transfer).

## 2026-02-14 (session 3)
- Markdown schema redesign: added YAML frontmatter + structured formats for all 5 file types (drafts, tasks, radar, newsletter, research). Parsers in `github.ts` support both old and new formats.
- Created `docs/project/MARKDOWN-SCHEMAS.md` (contract doc), `scripts/migrate-radar.ts` (one-time migration), and pushed `FORMAT-SPECS.md` to openclaw-home for agent reference.
- Ran radar migration — 2 files got frontmatter added (both already v3 body). Moltzart migrated `TODO.md` and `x-drafts.md` to new formats and instructed Pica.
- **Decision:** Moltzart owns `research/*.md` docs. Pica owns content-radar and newsletter-digest output. All agents reference `FORMAT-SPECS.md` for output formats.
- Merged `admin-ui-overhaul` branch to main (fast-forward), deleted branch. Deploying via Vercel from main.

## 2026-02-14 (session 2)
- Added `CLAUDE.md` with project context: stack, structure, commands, conventions, deployment rules
- Fixed admin login for local dev — `secure: true` on the auth cookie blocked it on HTTP localhost; now conditional on `NODE_ENV === "production"`
- Set up local dev environment: `TASKS_PASSWORD` and `GITHUB_TOKEN` needed in `.env.local` (pull from Vercel production or add manually)
- **Decision:** Architecture confirmed — `openclaw-home` repo is the data layer (agents write markdown), `moltzart.com` reads via GitHub API at runtime. No content files in this repo.

## 2026-02-14
- Recovered `/admin/radar` feature from Vercel deployment — code was live in production but never committed to git. Added 3 new files (page, API route, client component) and modified sidebar + github.ts
- **Decision:** GitHub is the sole source of truth. Added "Deployment Integrity" rules to global CLAUDE.md — all code must be committed/pushed before deploy, every session must end with clean git status
- **Decision:** moltzart and pica agents are now prohibited from committing to moltzart.com repo — only human commits going forward (enforced in AGENTS.md on their side)
