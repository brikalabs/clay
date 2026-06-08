'use client';

import { Tree, TreeItem } from '@brika/clay/components/tree';

/** Hide the folder/file glyphs with `showIcons={false}` for a denser list. */
export default function TreeWithoutIconsDemo() {
  return (
    <Tree className="w-full max-w-xs" showIcons={false} defaultExpandedIds={['src']}>
      <TreeItem nodeId="src" label="src">
        <TreeItem nodeId="src/components" label="components">
          <TreeItem nodeId="src/components/button.tsx" label="button.tsx" />
          <TreeItem nodeId="src/components/card.tsx" label="card.tsx" />
        </TreeItem>
        <TreeItem nodeId="src/index.ts" label="index.ts" />
      </TreeItem>
      <TreeItem nodeId="package.json" label="package.json" />
      <TreeItem nodeId="README.md" label="README.md" />
    </Tree>
  );
}
