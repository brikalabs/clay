import { BrikaLogo } from '@brika/clay/components/brika-logo';
import { defineDemos } from '../_registry';

export function BrikaLogoDefaultDemo() {
  return <BrikaLogo className="size-12 text-clay-strong" />;
}

export const demoMeta = defineDemos([
  [BrikaLogoDefaultDemo, 'Default'],
]);
