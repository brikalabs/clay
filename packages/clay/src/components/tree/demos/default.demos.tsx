'use client';

import { Tree, TreeItem } from '@brika/clay/components/tree';

/** Folders expand on click, one node selected at a time. */
export default function TreeDefaultDemo() {
  return (
    <Tree className="w-full max-w-xs" defaultExpandedIds={['src']}>
      <TreeItem nodeId="src" label="src">
        <TreeItem nodeId="src/components" label="components">
          <TreeItem nodeId="src/components/button.tsx" label="button.tsx" />
          <TreeItem nodeId="src/components/card.tsx" label="card.tsx" />
        </TreeItem>
        <TreeItem nodeId="src/index.ts" label="index.ts" />
        <TreeItem nodeId="src/styles.css" label="styles.css" />
      </TreeItem>
      <TreeItem nodeId="public" label="public">
        <TreeItem nodeId="public/favicon.ico" label="favicon.ico" />
      </TreeItem>
      <TreeItem nodeId="package.json" label="package.json" />
      <TreeItem nodeId="README.md" label="README.md" />
    </Tree>
  );
}
