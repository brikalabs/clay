/**
 * Fills in the accessibility arrays for all component .demos.tsx files.
 * Run: bun scripts/fill-accessibility.ts
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIR = 'src/components';

const A11Y: Record<string, string[]> = {
  accordion: [
    'Triggers carry `aria-expanded` and `aria-controls` — no extra markup needed.',
    'Content panels are hidden from AT via `aria-hidden` when collapsed.',
    '`type="single" collapsible` lets the open item be closed; omit `collapsible` to always keep one open.',
    'Arrow keys and Home/End navigate between triggers when focus is inside the accordion.',
  ],
  alert: [
    'Root carries `role="alert"` so live-region announcements fire on mount.',
    '`AlertTitle` and `AlertDescription` are sibling elements — AT reads them as one block.',
    'Icon inside `AlertIcon` is marked `aria-hidden`; the text content carries the meaning.',
  ],
  'alert-dialog': [
    'Unlike `Dialog`, `AlertDialog` does not close on backdrop click — the user must explicitly respond.',
    'Focus defaults to the cancel action on open, reducing accidental destructive confirmations.',
    '`AlertDialogTitle` and `AlertDialogDescription` are announced immediately when the dialog opens.',
    'Only two outcomes are possible: confirm or cancel. Do not add other interactive elements.',
  ],
  'aspect-ratio': [
    'The container is purely presentational — no ARIA role or keyboard behavior.',
    'Content placed inside inherits normal focus order; ensure images carry meaningful `alt` text.',
  ],
  avatar: [
    '`AvatarImage` requires an `alt` attribute — use the user\'s name or leave empty (`alt=""`) for decorative use.',
    '`AvatarFallback` is visible only when the image fails or is missing; AT reads the fallback text.',
    'Status badge text should be wrapped in an `aria-label` when it conveys meaning (e.g. "Online").',
  ],
  badge: [
    'Renders as a `<span>` — purely informational, carries no interactive role.',
    'When used as a link with `asChild`, the accessible name comes from the badge text.',
    'Numeric count badges in tab triggers should be accompanied by a visually hidden description.',
  ],
  breadcrumb: [
    'Root renders `<nav aria-label="breadcrumb">` — no extra landmark markup needed.',
    '`BreadcrumbPage` renders `aria-current="page"` on the last item.',
    '`BreadcrumbEllipsis` is `aria-hidden="true"` — AT skips the visual indicator.',
    'Separator elements are presentational; AT does not read them.',
  ],
  'brika-logo': [
    'Purely decorative — `aria-hidden="true"` is applied automatically.',
    'When used as a link or button, supply `aria-label` on the interactive wrapper.',
  ],
  button: [
    'Focus ring uses `--ring` token for WCAG contrast.',
    '`disabled` removes pointer events and reduces opacity; it does not set `aria-disabled`.',
    'Icon-only buttons (`size="icon"`) REQUIRE an `aria-label` — there is no text fallback.',
    '`asChild` passes all button props (including `role` and `aria-*`) to the child element.',
  ],
  'button-group': [
    'The wrapper carries `role="group"` — add `aria-label` when the group\'s purpose is not clear from context.',
    'Each button inside the group keeps its individual focus ring and keyboard behavior.',
    'Icon-only buttons inside the group still require `aria-label`.',
  ],
  calendar: [
    'Full keyboard navigation: arrow keys move between days, Enter/Space selects, Page Up/Down change months.',
    'Screen readers announce the selected date and current month context.',
    'Disabled dates carry `aria-disabled` and are skipped by arrow key navigation.',
    'For range selection, AT announces the start and end dates as they are selected.',
  ],
  card: [
    'Card is a layout container with no implicit role — add `role="article"` for standalone content.',
    'Interactive cards (with the `interactive` prop) should also carry `tabIndex={0}` and `onKeyDown` for keyboard activation.',
    'Accent color is visual only — convey variant meaning through text or `aria-label` as well.',
  ],
  carousel: [
    'Root carries `role="region"` with a label; each slide has `role="group" aria-roledescription="slide"`.',
    'Previous/Next buttons include `sr-only` screen-reader labels.',
    'Left/Right arrow keys navigate slides while focus is inside the carousel.',
    'Autoplay should pause on hover and focus to respect user attention and `prefers-reduced-motion`.',
  ],
  chart: [
    'Charts are visual — provide a `<caption>` or adjacent text summary for screen readers.',
    'Recharts renders an SVG; ensure the wrapper has `role="img"` and `aria-label` describing the data.',
    'Tooltips visible on hover are not reliably announced by AT — critical data should also appear in text form.',
  ],
  checkbox: [
    'Built on Radix Checkbox — keyboard, focus, and ARIA state (`aria-checked`) are handled automatically.',
    'Indeterminate state surfaces as `checked="indeterminate"`; AT announces "mixed".',
    'Always pair with a visible label — wrap in `<label>` or use matching `htmlFor` / `id`.',
    'Disabled checkboxes are removed from the tab order.',
  ],
  'clay-logo': [
    'Purely decorative — `aria-hidden="true"` is applied automatically.',
    'When used inside a link or button, supply `aria-label` on the interactive wrapper.',
  ],
  'code-block': [
    'Code blocks are non-interactive regions; Tab moves through the copy button, not character by character.',
    'Copy button carries `aria-label="Copy code"` and should announce success state via a live region.',
    'Syntax highlighting is visual only; AT reads the raw code text without colour cues.',
  ],
  collapsible: [
    'Trigger carries `aria-expanded` automatically — no extra markup needed.',
    'Content carries `aria-hidden` when collapsed so AT skips it entirely.',
    'Animate height via CSS `overflow-hidden` + transition, not `display:none`, to preserve AT semantics.',
  ],
  command: [
    'Arrow keys navigate list items; Enter activates the focused item.',
    'The input is always focused while the list is visible — Tab closes the command palette.',
    'Grouped items announce their group heading; `CommandEmpty` is announced when no results match.',
    'Wrap in `CommandDialog` for modal use — adds focus trapping and Escape-to-close.',
  ],
  'context-menu': [
    'Trigger carries `aria-haspopup="menu"` automatically.',
    'Keyboard: Shift+F10 or the context-menu key opens the menu on the focused trigger.',
    'Arrow keys navigate items; Enter/Space activate; Escape dismisses.',
    'Destructive items should use `variant="destructive"` so the visual indication matches AT context.',
  ],
  dialog: [
    'Focus is trapped inside the dialog while open — Tab cycles only through its interactive elements.',
    'Escape and clicking the backdrop close the dialog and return focus to the trigger.',
    '`DialogTitle` is required and becomes the accessible name — use `sr-only` to visually hide it if needed.',
    'Scrollable content should be the scrollable region, not the entire dialog.',
  ],
  drawer: [
    'Focus is trapped inside the drawer while open.',
    'Escape dismisses the drawer; the drag handle is decorative and keyboard users dismiss with Escape.',
    '`DrawerTitle` is required for an accessible name.',
    'Ensure scrollable content inside the drawer is reachable by keyboard, not only by touch-drag.',
  ],
  'dropdown-menu': [
    'Arrow keys navigate items; Enter/Space activate; Escape closes and returns focus to the trigger.',
    'Checkbox items carry `aria-checked`; radio items carry `aria-checked` within a `role="group"`.',
    '`DropdownMenuShortcut` renders keyboard hints — these are visual only and not announced by AT.',
    'Destructive items should use `variant="destructive"` to make intent clear visually and in context.',
  ],
  'empty-state': [
    'Icon inside `EmptyStateIcon` is `aria-hidden` — title and description carry all meaning.',
    'Action buttons should have descriptive labels matching the specific task ("Clear search", not "Clear").',
    'Empty states announced as a live region can help AT users know when a list becomes empty dynamically.',
  ],
  'hover-card': [
    'Content opens on hover AND focus — keyboard users can trigger it via Tab.',
    'Not suitable for content that must be permanently reachable — use `Popover` for interactive content.',
    'Ensure the trigger is keyboard-focusable; an `asChild` link or button works well.',
  ],
  icon: [
    'Decorative by default — `aria-hidden="true"` is set when no `aria-label` is provided.',
    'Pass `aria-label` to make the icon carry standalone meaning (e.g. status indicator).',
    'Do not use an icon alone as a button label — always pair with `aria-label` on the button.',
  ],
  input: [
    'Always pair with a `<Label>` via matching `id` / `htmlFor` — never rely on `placeholder` as a label.',
    '`aria-invalid="true"` applies the destructive ring; pair with a visible error message linked via `aria-describedby`.',
    'Disabled inputs are removed from the tab order; use `readOnly` when the content must stay focusable.',
    'File inputs announce "Browse…" or similar on activation — ensure the label describes what to select.',
  ],
  'input-group': [
    'Addons are presentational — always pair the group with a `<Label>` that describes the full field.',
    'Icon-only addon buttons require an `aria-label`.',
    'The visible prefix (e.g. "https://") is part of the label context; announce it via `aria-label` on the input if needed.',
  ],
  'input-otp': [
    'Paste works out-of-the-box — pasting a code fills all slots.',
    'A single hidden `<input>` handles the value; each visible slot is a presentation of that input\'s characters.',
    'The active slot gets a focus ring matching the input\'s focus state.',
    'Numeric-only patterns should use `inputMode="numeric"` to bring up the numeric keyboard on mobile.',
  ],
  label: [
    'Renders a `<label>` element — clicking it focuses the associated input.',
    'Always link to the input via `htmlFor` matching the input\'s `id`.',
    'Required-field indicators (* or "required") should be inside the label or referenced via `aria-describedby`.',
    'Disabled labels inherit `opacity-50` visually; no ARIA change is needed.',
  ],
  menubar: [
    'Arrow keys navigate between top-level triggers; Enter/Space opens the dropdown.',
    'Escape closes the open dropdown; Tab moves focus outside the menubar entirely.',
    'Each `MenubarMenu` is a `role="menu"` with its trigger as `role="menuitem"`.',
    'Keyboard shortcuts shown in items are visual only — implement the actual shortcuts separately.',
  ],
  'navigation-menu': [
    'Arrow keys move between top-level items; Enter/Space opens flyout panels.',
    'Active link state is indicated via `data-active`; ensure `aria-current="page"` is also set for AT.',
    'Flyout panels are dismissed by moving focus outside or pressing Escape.',
    'Use `NavigationMenuLink` with `asChild` for router-link integration.',
  ],
  'overflow-list': [
    'Hidden items remain in the DOM — the indicator communicates the count to all users.',
    'The `activeKey` item is always visible; this preserves context for the current selection.',
    'Consider wrapping the indicator in a `Popover` or `Tooltip` to reveal hidden items on demand.',
  ],
  'page-header': [
    '`PageHeaderTitle` renders as `<h1>` by default — ensure only one `<h1>` per page.',
    'Action buttons should be descriptive: "New dashboard" not just "New".',
    'When used with a `Breadcrumb`, the breadcrumb provides location context the heading cannot.',
  ],
  'password-input': [
    'The reveal toggle carries `aria-label` that updates between "Show password" and "Hide password".',
    'The underlying input switches between `type="password"` and `type="text"` — AT announces the mode change.',
    '`aria-invalid="true"` triggers the destructive ring; pair with a visible error message.',
    'Autocomplete attributes (`autocomplete="current-password"`) improve password-manager integration.',
  ],
  popover: [
    'Focus moves into the popover when it opens — Tab navigates within it.',
    'Escape and clicking outside close the popover and return focus to the trigger.',
    'Use `Popover` over `HoverCard` when content must be keyboard-reachable.',
    'The trigger carries `aria-expanded` and `aria-controls` pointing to the panel.',
  ],
  progress: [
    'Carries `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` automatically.',
    'Pair with a visible label or `aria-label` so AT announces what is progressing.',
    'Indeterminate state should also carry an accessible description explaining the uncertainty.',
  ],
  'progress-display': [
    'Log entries update via a live region — AT announces new lines as they stream in.',
    'Error and success states should also be communicated via a `toast` or `alert` for AT users in background contexts.',
    'The scrollable log area should be reachable by keyboard when it overflows.',
  ],
  'radio-group': [
    'Arrow keys move selection within the group — Tab leaves the group entirely.',
    'Always pair items with visible `<Label htmlFor={id}>` elements.',
    'Disabled individual items carry `aria-disabled` and are skipped by arrow keys.',
    'Use `defaultValue` for uncontrolled initial selection; `value` + `onValueChange` for controlled.',
  ],
  resizable: [
    'The resize handle carries `role="separator"` and responds to arrow keys for keyboard resizing.',
    '`withHandle` renders a visible grip icon, improving discoverability of the resize affordance.',
    'Ensure panels have meaningful `aria-label` values when used as distinct content regions.',
  ],
  'scroll-area': [
    'The scrollable region carries `role="region"` — pair with `aria-label` for context.',
    'Custom scrollbars do not affect keyboard scrolling — arrow keys and Page Up/Down work normally.',
    'Horizontal scroll areas should be announced; users may not expect horizontal scrolling.',
  ],
  section: [
    '`SectionTitle` renders as `<h2>` by default — adjust via the `as` prop to maintain heading hierarchy.',
    'Actions in the header slot should have descriptive labels matching the operation.',
  ],
  'section-label': [
    'Renders as `<p>` by default — use `as="h3"` when it semantically introduces a group.',
    'Tone colors are visual only; pair with an icon that has a meaningful `aria-label` when tone conveys status.',
  ],
  select: [
    'Trigger carries `role="combobox"` and `aria-expanded` — no extra markup needed.',
    'Arrow keys navigate options; Home/End jump to first/last; typing ahead filters.',
    'Selected item receives `aria-selected="true"` and a visible check mark.',
    'Disabled items carry `aria-disabled="true"` and are skipped by arrow navigation.',
  ],
  separator: [
    'Renders `<hr>` with `role="separator"` — meaningful to AT when it divides distinct content sections.',
    'Pass `aria-orientation="vertical"` when used as a vertical divider between inline items.',
    'Purely decorative separators should carry `aria-hidden="true"`.',
  ],
  sheet: [
    'Focus is trapped inside the sheet while open.',
    'Escape dismisses the sheet and returns focus to the trigger.',
    '`SheetTitle` is required for an accessible name — use `sr-only` to visually hide it if the design omits a heading.',
    'The `side` prop ("top", "right", "bottom", "left") does not affect AT semantics.',
  ],
  sidebar: [
    '`SidebarProvider` exposes `collapsed` state via context — sync `aria-expanded` on the toggle button.',
    'The sidebar should have `role="navigation"` or `role="complementary"` depending on content.',
    'Keyboard shortcut (default `Cmd+B`) should be announced via `aria-keyshortcuts` on the trigger.',
    'Rail-collapsed state hides labels visually; ensure icon-only items still carry `aria-label`.',
  ],
  skeleton: [
    'Mark skeleton containers with `aria-hidden="true"` and `aria-busy="true"` on the parent.',
    'When content loads, remove the busy state and announce the result via a live region.',
    'Do not use `Skeleton` inside elements that carry interactive roles.',
  ],
  slider: [
    'Built on a native `<input type="range">` — all keyboard and AT semantics are native.',
    'Arrow keys adjust value by `step`; Home/End jump to `min`/`max`.',
    'Always provide a visible label linked via `htmlFor` or wrapped `<label>`.',
    '`SliderValue` pairing gives a numeric readout — include `unit` for percentage or currency.',
  ],
  switch: [
    'Carries `role="switch"` with `aria-checked` — AT announces "on" / "off" state.',
    'Pair with a `<Label>` — clicking the label also toggles the switch.',
    'Disabled switches carry `aria-disabled` and are removed from the tab order.',
    'Use `Switch` for binary on/off settings; use `Checkbox` for multi-select form fields.',
  ],
  table: [
    'Use `<TableCaption>` to describe the table — it becomes the accessible name via `aria-labelledby`.',
    'Sortable column headers should carry `aria-sort="ascending"` or `"descending"`.',
    'Action buttons in cells require `aria-label` that includes the row context (e.g. "Edit Alicia Reyes").',
    'The table responds to standard AT table-navigation keys (e.g. Ctrl+Alt+arrows in screen readers).',
  ],
  tabs: [
    'Arrow keys navigate between triggers inside the list — Tab moves focus to the active panel.',
    'Active panel carries `aria-labelledby` pointing to its trigger.',
    'Triggers carry `role="tab"` and `aria-selected`; the list carries `role="tablist"`.',
    'Vertical tabs require `orientation="vertical"` so AT uses the correct arrow key direction.',
  ],
  textarea: [
    'Always associate with a `<Label>` via matching `id` / `htmlFor`.',
    '`aria-invalid="true"` triggers the destructive ring; pair with a visible error message via `aria-describedby`.',
    'Disabled textareas are removed from the tab order — use `readOnly` when content must stay focusable.',
    'Character count readouts should be linked via `aria-describedby` so AT announces remaining characters.',
  ],
  toast: [
    'Built on Sonner\'s `aria-live` region — announcements fire automatically.',
    'Auto-dismiss duration defaults to 4 s; override via `toast(msg, { duration })` for critical messages.',
    'Action buttons inside toasts should have descriptive `label` text.',
    'Respects `prefers-reduced-motion` — animations are skipped for users with motion sensitivity.',
  ],
  toggle: [
    'Carries `aria-pressed` automatically — AT announces "pressed" / "not pressed".',
    'Icon-only toggles REQUIRE an `aria-label` — there is no text fallback.',
    'Use `variant="outline"` to make the active state more visually distinct.',
  ],
  'toggle-group': [
    'Arrow keys navigate between items within the group; Space toggles the focused item.',
    '`type="single"` enforces one active item at a time; `type="multiple"` allows combinations.',
    'Icon-only items require `aria-label` on each `ToggleGroupItem`.',
    'The group wrapper carries `role="group"` — add `aria-label` to describe the group\'s purpose.',
  ],
  tooltip: [
    'Tooltips open on both hover and keyboard focus — use for supplementary info, not required instructions.',
    'Never place interactive elements inside a `TooltipContent` — use `Popover` instead.',
    '`delayDuration={0}` on the provider makes tooltips instant, which helps keyboard-only users.',
    'Wrap disabled buttons in a focusable `<span tabIndex={0}>` so the tooltip fires on focus.',
  ],
};

function fill(slug: string, facts: string[]): void {
  const path = join(DIR, slug, `${slug}.demos.tsx`);
  let src: string;
  try { src = readFileSync(path, 'utf-8'); } catch { return; }

  const items = facts.map((f) => {
    const safe = f.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    return `  \`${safe}\`,`;
  });
  const block = ['export const accessibility: readonly string[] = [', ...items, '];'].join('\n');

  const updated = src.replace(
    /export const accessibility: readonly string\[\] = \[[\s\S]*?\];/,
    block
  );

  if (updated !== src) {
    writeFileSync(path, updated);
    console.log(`Filled: ${slug} (${facts.length} facts)`);
  } else {
    console.log(`Not found: ${slug}`);
  }
}

for (const [slug, facts] of Object.entries(A11Y)) {
  fill(slug, facts);
}
console.log('\nDone.');
