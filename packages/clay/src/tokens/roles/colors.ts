/**
 * Layer 1, Color roles
 * Themes typically override these. Listed in the order they appear in
 * existing presets to make migration mechanical.
 *
 * Tabular `[name, light, dark, description]` form expanded by a builder
 * so per-token boilerplate stays in one place. TS catches malformed
 * entries at authoring time; no runtime validation needed.
 */

import type { TokenSpec } from '../types';

type ColorEntry = readonly [
  name: string,
  defaultLight: string,
  defaultDark: string,
  description: string,
];

/** Convert kebab-case to camelCase for theme paths (`data-1` → `data1`). */
function camel(name: string): string {
  return name.replaceAll(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

function toColorRole([name, defaultLight, defaultDark, description]: ColorEntry): TokenSpec {
  return {
    name,
    layer: 'role',
    category: 'color',
    defaultLight,
    defaultDark,
    description,
    themePath: `colors.${camel(name)}`,
    tailwindNamespace: 'color',
  };
}

const COLOR_DEFS: readonly ColorEntry[] = [
  // ─── Core ──────────────────────────────────────────────────────────────
  ['background', 'oklch(0.99 0 0)', 'oklch(0.14 0.02 260)', 'Page background. The base canvas every surface sits on.'],
  ['foreground', 'oklch(0.15 0.01 260)', 'oklch(0.96 0.01 260)', 'Default text color, paired with `background`.'],
  ['card', 'oklch(1 0 0)', 'oklch(0.17 0.02 260)', 'Background for resting cards and panels.'],
  ['card-foreground', 'oklch(0.15 0.01 260)', 'oklch(0.96 0.01 260)', 'Text color for content inside cards.'],
  ['popover', 'oklch(1 0 0)', 'oklch(0.17 0.02 260)', 'Background for floating surfaces (popovers, dropdowns, tooltips).'],
  ['popover-foreground', 'oklch(0.15 0.01 260)', 'oklch(0.96 0.01 260)', 'Text color for content inside popovers.'],
  ['primary', 'oklch(0.55 0.18 265)', 'oklch(0.7 0.16 265)', 'Brand primary. Used for filled buttons, focus ring, links.'],
  ['primary-foreground', 'oklch(0.99 0 0)', 'oklch(0.14 0.02 260)', 'Text color that reads on `primary` backgrounds.'],
  ['secondary', 'oklch(0.94 0.005 260)', 'oklch(0.22 0.02 260)', 'Secondary surfaces and quiet button fills.'],
  ['secondary-foreground', 'oklch(0.15 0.01 260)', 'oklch(0.96 0.01 260)', 'Text color paired with `secondary`.'],
  ['muted', 'oklch(0.95 0.005 260)', 'oklch(0.2 0.02 260)', 'Subdued surface for placeholder content and inactive rails.'],
  ['muted-foreground', 'oklch(0.5 0.01 260)', 'oklch(0.65 0.02 260)', 'De-emphasized text (helper copy, captions, placeholders).'],
  ['accent', 'oklch(0.92 0.01 260)', 'oklch(0.25 0.02 260)', 'Hover/highlight surface for interactive items in menus and lists.'],
  ['accent-foreground', 'oklch(0.15 0.01 260)', 'oklch(0.96 0.01 260)', 'Text color paired with `accent`.'],
  ['border', 'oklch(0.9 0.01 260)', 'oklch(0.25 0.02 260)', 'Default border color across the system.'],
  ['input', 'oklch(0.9 0.01 260)', 'oklch(0.25 0.02 260)', 'Border color for input controls (input, select, textarea).'],
  ['ring', 'oklch(0.55 0.18 265)', 'oklch(0.7 0.16 265)', 'Focus ring color. Defaults to `primary`.'],

  // ─── Feedback ──────────────────────────────────────────────────────────
  ['success', 'oklch(0.55 0.16 145)', 'oklch(0.72 0.15 145)', 'Positive feedback (success toasts, confirmation states).'],
  ['success-foreground', 'oklch(0.99 0 0)', 'oklch(0.14 0.02 260)', 'Text color paired with `success`.'],
  ['warning', 'oklch(0.65 0.14 85)', 'oklch(0.8 0.15 85)', 'Cautionary feedback (warning banners, caution states).'],
  ['warning-foreground', 'oklch(0.15 0.01 260)', 'oklch(0.14 0.02 260)', 'Text color paired with `warning`.'],
  ['info', 'oklch(0.5 0.18 230)', 'oklch(0.72 0.12 230)', 'Informational feedback (tips, notes, neutral accents).'],
  ['info-foreground', 'oklch(0.99 0 0)', 'oklch(0.14 0.02 260)', 'Text color paired with `info`.'],
  ['destructive', 'oklch(0.55 0.22 25)', 'oklch(0.65 0.2 25)', 'Destructive actions (delete buttons, error states).'],
  ['destructive-foreground', 'oklch(0.99 0 0)', 'oklch(0.96 0.01 260)', 'Text color paired with `destructive`.'],

  // ─── Workflow status ───────────────────────────────────────────────────
  ['status-idle', 'oklch(0.7 0.02 260)', 'oklch(0.5 0.02 260)', 'Workflow status, idle / pending nodes.'],
  ['status-running', 'oklch(0.55 0.18 265)', 'oklch(0.7 0.16 265)', 'Workflow status, currently executing.'],
  ['status-completed', 'oklch(0.55 0.16 145)', 'oklch(0.72 0.15 145)', 'Workflow status, finished successfully.'],
  ['status-error', 'oklch(0.55 0.22 25)', 'oklch(0.65 0.2 25)', 'Workflow status, failed / errored.'],

  // ─── Data viz sequential scale ─────────────────────────────────────────
  ['data-1', 'oklch(0.55 0.18 265)', 'oklch(0.7 0.16 265)', 'Data-viz sequential color 1.'],
  ['data-2', 'oklch(0.6 0.18 45)', 'oklch(0.72 0.18 45)', 'Data-viz sequential color 2.'],
  ['data-3', 'oklch(0.55 0.16 145)', 'oklch(0.72 0.15 145)', 'Data-viz sequential color 3.'],
  ['data-4', 'oklch(0.55 0.22 25)', 'oklch(0.65 0.2 25)', 'Data-viz sequential color 4.'],
  ['data-5', 'oklch(0.55 0.18 300)', 'oklch(0.7 0.16 300)', 'Data-viz sequential color 5.'],
  ['data-6', 'oklch(0.65 0.14 85)', 'oklch(0.8 0.15 85)', 'Data-viz sequential color 6.'],
  ['data-7', 'oklch(0.55 0.15 200)', 'oklch(0.72 0.14 200)', 'Data-viz sequential color 7.'],
  ['data-8', 'oklch(0.6 0.18 340)', 'oklch(0.72 0.16 340)', 'Data-viz sequential color 8.'],

  // ─── Sidebar surface (defaults to card family) ─────────────────────────
  ['sidebar', 'var(--card)', 'var(--card)', 'Sidebar surface, defaults to the card role.'],
  ['sidebar-foreground', 'var(--card-foreground)', 'var(--card-foreground)', 'Text color inside the sidebar.'],
  ['sidebar-primary', 'var(--primary)', 'var(--primary)', 'Primary accent for sidebar selection / focus.'],
  ['sidebar-primary-foreground', 'var(--primary-foreground)', 'var(--primary-foreground)', 'Text on `sidebar-primary` surfaces.'],
  ['sidebar-accent', 'var(--secondary)', 'var(--secondary)', 'Secondary accent surface inside the sidebar.'],
  ['sidebar-accent-foreground', 'var(--secondary-foreground)', 'var(--secondary-foreground)', 'Text on `sidebar-accent` surfaces.'],
  ['sidebar-border', 'var(--border)', 'var(--border)', 'Border color used inside the sidebar.'],
  ['sidebar-ring', 'var(--ring)', 'var(--ring)', 'Focus ring color used inside the sidebar.'],

  // ─── Outline aliases ───────────────────────────────────────────────────
  ['outline', 'var(--border)', 'var(--border)', 'Default border alias. Themes can override to decouple from `border`.'],
  ['outline-variant', 'color-mix(in oklch, var(--border) 60%, transparent)', 'color-mix(in oklch, var(--border) 60%, transparent)', 'Softer outline for dividers and inactive rails.'],

  // ─── Material-inspired tonal containers ────────────────────────────────
  ['primary-container', 'color-mix(in oklch, var(--primary) 18%, var(--background))', 'color-mix(in oklch, var(--primary) 18%, var(--background))', 'Tonal container in the primary family (Material-inspired).'],
  ['on-primary-container', 'color-mix(in oklch, var(--primary) 85%, var(--foreground))', 'color-mix(in oklch, var(--primary) 85%, var(--foreground))', 'Text color paired with `primary-container`.'],
  ['secondary-container', 'color-mix(in oklch, var(--secondary) 70%, var(--background))', 'color-mix(in oklch, var(--secondary) 70%, var(--background))', 'Tonal container in the secondary family.'],
  ['on-secondary-container', 'color-mix(in oklch, var(--secondary-foreground) 90%, var(--foreground))', 'color-mix(in oklch, var(--secondary-foreground) 90%, var(--foreground))', 'Text color paired with `secondary-container`.'],
  ['accent-container', 'color-mix(in oklch, var(--accent) 70%, var(--background))', 'color-mix(in oklch, var(--accent) 70%, var(--background))', 'Tonal container in the accent family.'],
  ['on-accent-container', 'color-mix(in oklch, var(--accent-foreground) 90%, var(--foreground))', 'color-mix(in oklch, var(--accent-foreground) 90%, var(--foreground))', 'Text color paired with `accent-container`.'],
  ['success-container', 'color-mix(in oklch, var(--success) 18%, var(--background))', 'color-mix(in oklch, var(--success) 18%, var(--background))', 'Tonal container for success surfaces.'],
  ['on-success-container', 'color-mix(in oklch, var(--success) 85%, var(--foreground))', 'color-mix(in oklch, var(--success) 85%, var(--foreground))', 'Text color paired with `success-container`.'],
  ['warning-container', 'color-mix(in oklch, var(--warning) 18%, var(--background))', 'color-mix(in oklch, var(--warning) 18%, var(--background))', 'Tonal container for warning surfaces.'],
  ['on-warning-container', 'color-mix(in oklch, var(--warning) 85%, var(--foreground))', 'color-mix(in oklch, var(--warning) 85%, var(--foreground))', 'Text color paired with `warning-container`.'],
  ['info-container', 'color-mix(in oklch, var(--info) 18%, var(--background))', 'color-mix(in oklch, var(--info) 18%, var(--background))', 'Tonal container for informational surfaces.'],
  ['on-info-container', 'color-mix(in oklch, var(--info) 85%, var(--foreground))', 'color-mix(in oklch, var(--info) 85%, var(--foreground))', 'Text color paired with `info-container`.'],
  ['destructive-container', 'color-mix(in oklch, var(--destructive) 18%, var(--background))', 'color-mix(in oklch, var(--destructive) 18%, var(--background))', 'Tonal container for destructive surfaces.'],
  ['on-destructive-container', 'color-mix(in oklch, var(--destructive) 85%, var(--foreground))', 'color-mix(in oklch, var(--destructive) 85%, var(--foreground))', 'Text color paired with `destructive-container`.'],

  // ─── Material-inspired surface tonal scale ─────────────────────────────
  ['surface-dim', 'color-mix(in oklch, var(--background) 88%, var(--surface-tint, var(--primary)))', 'color-mix(in oklch, var(--background) 88%, var(--surface-tint, var(--primary)))', 'Lowest tonal surface in the Material-inspired surface scale.'],
  ['surface-bright', 'color-mix(in oklch, var(--background) 96%, white)', 'color-mix(in oklch, var(--background) 96%, white)', 'Highest tonal surface, lifted toward white.'],
  ['surface-container-lowest', 'color-mix(in oklch, var(--background) 96%, var(--surface-tint, var(--primary)))', 'color-mix(in oklch, var(--background) 96%, var(--surface-tint, var(--primary)))', 'Surface container, lowest elevation.'],
  ['surface-container-low', 'color-mix(in oklch, var(--background) 93%, var(--surface-tint, var(--primary)))', 'color-mix(in oklch, var(--background) 93%, var(--surface-tint, var(--primary)))', 'Surface container, low elevation.'],
  ['surface-container', 'color-mix(in oklch, var(--background) 90%, var(--surface-tint, var(--primary)))', 'color-mix(in oklch, var(--background) 90%, var(--surface-tint, var(--primary)))', 'Surface container, default elevation.'],
  ['surface-container-high', 'color-mix(in oklch, var(--background) 86%, var(--surface-tint, var(--primary)))', 'color-mix(in oklch, var(--background) 86%, var(--surface-tint, var(--primary)))', 'Surface container, high elevation.'],
  ['surface-container-highest', 'color-mix(in oklch, var(--background) 82%, var(--surface-tint, var(--primary)))', 'color-mix(in oklch, var(--background) 82%, var(--surface-tint, var(--primary)))', 'Surface container, highest elevation.'],
];

export const COLOR_ROLES: readonly TokenSpec[] = COLOR_DEFS.map(toColorRole);
