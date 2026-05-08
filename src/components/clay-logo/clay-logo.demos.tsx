import { ClayLogo } from '@brika/clay/components/clay-logo';
import { defineDemos } from '../../component-registry';

export function ClayLogoDefaultDemo() {
  return <ClayLogo variant="badge" className="size-16 text-clay-brand" />;
}

export function ClayLogoGlyphDemo() {
  return <ClayLogo variant="glyph" className="size-12 text-clay-brand" />;
}

export const demoMeta = defineDemos([
  [ClayLogoDefaultDemo, 'Default'],
  [ClayLogoGlyphDemo, 'Glyph'],
]);
