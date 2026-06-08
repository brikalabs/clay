'use client';

import { Tree, TreeItem } from '@brika/clay/components/tree';
import { useState } from 'react';

/**
 * @title Multi-select
 * Cmd/Ctrl-click (or press Enter) to select several nodes; selection is controlled.
 */
export default function TreeMultiSelectDemo() {
  const [selected, setSelected] = useState<string[]>(['src/index.ts']);

  return (
    <div className="w-full max-w-xs space-y-3">
      <Tree
        multiSelect
        defaultExpandedIds={['src', 'src/components']}
        selectedIds={selected}
        onSelectedChange={setSelected}
      >
        <TreeItem nodeId="src" label="src">
          <TreeItem nodeId="src/components" label="components">
            <TreeItem nodeId="src/components/button.tsx" label="button.tsx" />
            <TreeItem nodeId="src/components/card.tsx" label="card.tsx" />
          </TreeItem>
          <TreeItem nodeId="src/index.ts" label="index.ts" />
          <TreeItem nodeId="src/styles.css" label="styles.css" />
        </TreeItem>
        <TreeItem nodeId="package.json" label="package.json" />
      </Tree>
      <p className="text-clay-subtle text-xs">
        Selected: {selected.length > 0 ? selected.join(', ') : 'none'}
      </p>
    </div>
  );
}
