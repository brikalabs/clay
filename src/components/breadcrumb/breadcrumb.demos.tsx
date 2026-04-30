import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@brika/clay/components/breadcrumb';
import { defineDemos } from '../_registry';

/** Standard trail with two ancestor links and the current page. */
export function BreadcrumbDefaultDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/** Deep path with middle segments collapsed into an ellipsis indicator. */
export function BreadcrumbCollapsedDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Design system</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/** Slash character as a separator instead of the default chevron. */
export function BreadcrumbCustomSeparatorDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Analytics</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export const demoMeta = defineDemos([
  [BreadcrumbDefaultDemo, 'Default', { description: `Standard trail with two ancestor links and the current page.` }],
  [BreadcrumbCollapsedDemo, 'Collapsed', { description: `Deep path with middle segments collapsed into an ellipsis indicator.` }],
  [BreadcrumbCustomSeparatorDemo, 'Custom Separator', { description: `Slash character as a separator instead of the default chevron.` }],
]);
export const accessibility: readonly string[] = [
  `Root renders \`<nav aria-label="breadcrumb">\` — no extra landmark markup needed.`,
  `\`BreadcrumbPage\` renders \`aria-current="page"\` on the last item.`,
  `\`BreadcrumbEllipsis\` is \`aria-hidden="true"\` — AT skips the visual indicator.`,
  `Separator elements are presentational; AT does not read them.`,
];
