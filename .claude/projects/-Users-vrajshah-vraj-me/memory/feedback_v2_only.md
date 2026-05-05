---
name: Only work on main page (v2)
description: v1 is deprecated - only update app/page.tsx, skip app/v2/page.tsx and app/v1/page.tsx
type: feedback
---

Stop duplicating changes across app/page.tsx and app/v2/page.tsx. The main page IS v2. Only edit app/page.tsx.

**Why:** User gets frustrated when changes are made in both files — it doubles the work, introduces inconsistencies, and reduces output quality.
**How to apply:** Only edit app/page.tsx for homepage changes. Ignore app/v1/page.tsx and app/v2/page.tsx entirely.
