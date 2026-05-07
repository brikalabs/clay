import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@brika/clay/components/avatar';
import { Circle } from 'lucide-react';
import { defineDemos } from '../_registry';

/** Default avatar with a remote image and initials fallback. */
export function AvatarDefaultDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=Alicia" alt="Alicia Reyes" />
      <AvatarFallback>AR</AvatarFallback>
    </Avatar>
  );
}

/** When the image URL fails or is omitted, initials render in the fallback slot. */
export function AvatarFallbackDemo() {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>TR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>YT</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>DV</AvatarFallback>
      </Avatar>
    </div>
  );
}

/** Three preset sizes, `sm` (24px), `default` (32px), and `lg` (40px). */
export function AvatarSizesDemo() {
  return (
    <div className="flex items-end gap-3">
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  );
}

/** AvatarBadge overlays a status indicator in the bottom-right corner. */
export function AvatarBadgeDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>AR</AvatarFallback>
        <AvatarBadge className="bg-success" aria-label="Online">
          <Circle className="fill-current" />
        </AvatarBadge>
      </Avatar>
      <Avatar>
        <AvatarFallback>TH</AvatarFallback>
        <AvatarBadge className="bg-muted-foreground" aria-label="Away" />
      </Avatar>
    </div>
  );
}

/** Stacked AvatarGroup with a count bubble for the remaining members. */
export function AvatarGroupDemo() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://api.dicebear.com/9.x/initials/svg?seed=Alicia" alt="Alicia" />
        <AvatarFallback>AR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>TH</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>YT</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  );
}

export const demoMeta = defineDemos([
  [AvatarDefaultDemo, 'Default', { description: `Default avatar with a remote image and initials fallback.` }],
  [AvatarFallbackDemo, 'Fallback', { description: `When the image URL fails or is omitted, initials render in the fallback slot.` }],
  [AvatarSizesDemo, 'Sizes', { description: `Three preset sizes, \`sm\` (24px), \`default\` (32px), and \`lg\` (40px).` }],
  [AvatarBadgeDemo, 'Badge', { description: `AvatarBadge overlays a status indicator in the bottom-right corner.` }],
  [AvatarGroupDemo, 'Group', { description: `Stacked AvatarGroup with a count bubble for the remaining members.` }],
]);
export const accessibility: readonly string[] = [
  `\`AvatarImage\` requires an \`alt\` attribute, use the user's name or leave empty (\`alt=""\`) for decorative use.`,
  `\`AvatarFallback\` is visible only when the image fails or is missing; AT reads the fallback text.`,
  `Status badge text should be wrapped in an \`aria-label\` when it conveys meaning (e.g. "Online").`,
];
