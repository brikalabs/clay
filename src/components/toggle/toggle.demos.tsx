import { Toggle } from '@brika/clay/components/toggle';
import { Bold, Italic, Underline } from 'lucide-react';
import { defineDemos } from '../_registry';

/** A single toggle button that stays pressed until clicked again. */
export function ToggleDefaultDemo() {
  return (
    <Toggle aria-label="Toggle bold">
      <Bold />
    </Toggle>
  );
}

/** Two variants: default (transparent background) and outline (bordered). */
export function ToggleVariantsDemo() {
  return (
    <div className="flex gap-2">
      <Toggle variant="default" aria-label="Default">
        <Bold />
        Default
      </Toggle>
      <Toggle variant="outline" aria-label="Outline">
        <Italic />
        Outline
      </Toggle>
    </div>
  );
}

/** Three size presets side by side. */
export function ToggleSizesDemo() {
  return (
    <div className="flex items-center gap-2">
      <Toggle size="sm" aria-label="Small bold">
        <Bold />
      </Toggle>
      <Toggle size="default" aria-label="Default bold">
        <Bold />
      </Toggle>
      <Toggle size="lg" aria-label="Large bold">
        <Bold />
      </Toggle>
    </div>
  );
}

/** Multiple small icon toggles for a rich-text formatting toolbar. */
export function ToggleFormattingDemo() {
  return (
    <div className="flex gap-1">
      <Toggle size="sm" aria-label="Bold">
        <Bold />
      </Toggle>
      <Toggle size="sm" aria-label="Italic">
        <Italic />
      </Toggle>
      <Toggle size="sm" aria-label="Underline">
        <Underline />
      </Toggle>
    </div>
  );
}

export const demoMeta = defineDemos([
  [ToggleDefaultDemo, 'Default', { description: `A single toggle button that stays pressed until clicked again.` }],
  [ToggleVariantsDemo, 'Variants', { description: `Two variants: default (transparent background) and outline (bordered).` }],
  [ToggleSizesDemo, 'Sizes', { description: `Three size presets side by side.` }],
  [ToggleFormattingDemo, 'Formatting', { description: `Multiple small icon toggles for a rich-text formatting toolbar.` }],
]);
export const accessibility: readonly string[] = [
  `Carries \`aria-pressed\` automatically, AT announces "pressed" / "not pressed".`,
  `Icon-only toggles REQUIRE an \`aria-label\`, there is no text fallback.`,
  `Use \`variant="outline"\` to make the active state more visually distinct.`,
];
