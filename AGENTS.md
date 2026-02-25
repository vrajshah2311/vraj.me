# AGENTS.md

## Cursor Cloud specific instructions

This is a single Next.js 14 portfolio website (not a monorepo). No external databases, Docker, or environment variables are required for local development.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Next.js Dev Server | `npm run dev` | 3000 | The only service; serves all pages and assets |

### Key commands

See `package.json` scripts; the standard ones apply:

- **Lint**: `npm run lint`
- **Build**: `npm run build`
- **Dev**: `npm run dev`

### Caveats

- There is no test framework configured (no jest, vitest, playwright, etc.). Lint and build are the only automated checks.
- Lint produces warnings about `<img>` usage (recommending Next.js `<Image />`) — these are expected and not errors.
- The `lib/database.ts` file exists but the API routes that import it (`app/api/`) are not present in the repo. This is expected.
- `@vercel/analytics` and `@vercel/speed-insights` are dependencies but only activate when deployed to Vercel; they are no-ops locally.
