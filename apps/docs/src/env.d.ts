/// <reference types="astro/client" />

declare module 'virtual:clay-docgen' {
  import type { ClayComponentDoc } from '~/lib/vite-plugin-clay-docgen';
  /** Keyed by component slug (e.g. "dropdown-menu"). Each value lists all exported components from that file. */
  const docs: Record<string, ClayComponentDoc[]>;
  export default docs;
}
