---
allowed-tools:
  - Bash(curl:*)
description: Load a Clay component's docs into context and help the user with whatever they need to know about it.
argument-hint: <component-slug> | (empty for the catalogue)
---

The user wants help with a Clay component. Argument: `$ARGUMENTS`.

This command is a starting point for a conversation, not a docs dump.
You load the docs into your own context, then orient the user and ask
what they actually need. Drawing the wall of markdown into the chat is
hostile UX; the user invoked you to be useful, not to paste a manual.

## Step 1: load the docs into your context

Validate `$ARGUMENTS` as a kebab-case slug (lowercase letters, digits,
and hyphens only). If valid, fetch the page with the Bash tool:

```sh
curl -fsSL https://clay.brika.dev/components/<slug>.md
```

If `$ARGUMENTS` is empty or whitespace, fetch the catalogue index
instead:

```sh
curl -fsSL https://clay.brika.dev/llms.txt
```

The fetched content goes into your context, not into the user-visible
response. Read it carefully so you can answer follow-ups directly.

## Step 2: orient and ask

In one short paragraph, do three things:

1. Confirm which component (or catalogue) you just loaded.
2. Tell the user what's in scope: the major sections you saw (e.g.
   "5 variants, 3 sizes, 18 theme tokens, accessibility notes,
   asChild support") so they know what's available without reading
   the page themselves.
3. Ask what they want help with. Offer a short menu of likely
   intents: a usage snippet for a specific case, the prop signature,
   theme overrides, accessibility, comparison with another Clay
   component, or "just show me the full markdown" if they really do
   want the dump.

Then stop and wait for their answer. Do not pre-emptively summarize
or paginate the docs.

## Step 3: answer from the loaded context

When they respond, draw from the docs you fetched. If the docs don't
cover their question, fall back to:

- The live component source under `src/components/<slug>/<slug>.tsx`
  and `src/components/<slug>/tokens.ts` if the user has Clay's source
  checked out.
- A targeted re-fetch of the same docs URL if you need to re-read.
- The catalogue index when the user clearly wants a different
  component.

## Failure modes

- **Invalid slug**: don't run curl. Ask the user to retry with a
  kebab-case slug, or offer to list the catalogue.
- **404**: fetch the catalogue index and suggest the closest matching
  slug from the list.
- **Network error**: report the curl exit status and let the user
  decide whether to retry.
