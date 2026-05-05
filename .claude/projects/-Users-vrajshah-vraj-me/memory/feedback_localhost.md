---
name: Always provide working localhost
description: User gets frustrated when localhost doesn't work - always restart dev server before sharing URL
type: feedback
---

Always restart the dev server before giving the user a localhost URL. The server frequently goes stale and shows broken pages or Internal Server Error. Kill the old process and run `npm run dev` fresh every time.

**Why:** User has been burned multiple times by stale dev servers showing broken/cached content.
**How to apply:** Before sharing localhost URL, always kill existing process on port 3000 and restart `npm run dev`.
