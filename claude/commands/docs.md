---
allowed-tools:
  - WebFetch
description: Fetch the LLM-friendly markdown docs for a Clay component (or the catalogue index when called bare).
argument-hint: <component-slug> | (empty for catalogue)
---

The user asked for Clay component docs. Argument: `$ARGUMENTS`

If `$ARGUMENTS` is empty or whitespace, fetch the catalogue index:
`https://clay.brika.dev/llms.txt`. Present a concise list of available
components, grouped by their category headings, and tell the user to
re-run `/clay:docs <slug>` for any specific component.

Otherwise, treat `$ARGUMENTS` as a kebab-case component slug
(e.g. `button`, `dropdown-menu`). Fetch:
`https://clay.brika.dev/components/<slug>.md`

Drop the full markdown into context: props table, examples, tokens,
accessibility notes. Do not summarize unless the user explicitly asks
for a summary; the user invoked this command to read the docs verbatim.

If the URL returns 404 (slug doesn't exist), fall back to the catalogue
index and suggest the closest matching slug from the list.
