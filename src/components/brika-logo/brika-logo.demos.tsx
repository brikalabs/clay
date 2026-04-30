import { BrikaLogo } from '@brika/clay/components/brika-logo';
import { defineDemos } from '../_registry';

export function BrikaLogoDefaultDemo() {
  return <BrikaLogo className="size-12 text-clay-strong" />;
}

export const demoMeta = defineDemos([
  [BrikaLogoDefaultDemo, 'Default'],
]);
export const accessibility: readonly string[] = [
  `Purely decorative — \`aria-hidden="true"\` is applied automatically.`,
  `When used as a link or button, supply \`aria-label\` on the interactive wrapper.`,
];
