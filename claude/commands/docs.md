---
allowed-tools:
  - Bash(curl:*)
description: Fetch the LLM-friendly markdown docs for a Clay component (or the catalogue index when called bare).
argument-hint: <component-slug> | (empty for catalogue)
---

The user asked for Clay component docs. Argument: `$ARGUMENTS`

Use `curl -fsSL <url>` (Bash tool) so the raw markdown lands in context
verbatim. **Do not** use WebFetch: it passes content through a
summarising LLM and the user invoked this command to read the docs
unmodified.

## What to fetch

- If `$ARGUMENTS` is empty or whitespace, fetch the catalogue index at
  `https://clay.brika.dev/llms.txt`. Show a concise list of available
  components grouped by their category headings, then tell the user to
  re-run `/clay:docs <slug>` for any specific component.
- Otherwise, validate `$ARGUMENTS` as a kebab-case slug (lowercase
  letters, digits, and hyphens only, e.g. `button`, `dropdown-menu`).
  If it doesn't match, ask the user to retry with a valid slug instead
  of running curl. With a valid slug, fetch
  `https://clay.brika.dev/components/<slug>.md`.

## What to do with the result

Drop the entire response into the conversation as-is: headings, props
table, code examples, accessibility notes, theme tokens. Do not
summarize, abbreviate, reformat, or strip sections unless the user
follows up with an explicit narrower question.

## On failure

- 404: the slug doesn't exist. Fetch the catalogue index instead and
  suggest the closest matching slug from the list.
- Network or other curl error: report the exit status and let the user
  decide whether to retry.
