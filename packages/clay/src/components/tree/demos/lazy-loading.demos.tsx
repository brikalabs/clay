'use client';

import { Tree, TreeItem, TreeLoading } from '@brika/clay/components/tree';
import { useState } from 'react';

interface FsNode {
  readonly id: string;
  readonly name: string;
  readonly type: 'file' | 'folder';
}

// Mock file system: folder id -> children list.
const FS: Record<string, readonly FsNode[]> = {
  root: [
    { id: 'src', name: 'src', type: 'folder' },
    { id: 'locales', name: 'locales', type: 'folder' },
    { id: 'package.json', name: 'package.json', type: 'file' },
  ],
  src: [
    { id: 'src/bricks', name: 'bricks', type: 'folder' },
    { id: 'src/index.ts', name: 'index.ts', type: 'file' },
  ],
  'src/bricks': [
    { id: 'src/bricks/checkout', name: 'checkout', type: 'folder' },
    { id: 'src/bricks/index.ts', name: 'index.ts', type: 'file' },
  ],
  'src/bricks/checkout': [
    { id: 'src/bricks/checkout/CheckoutBrick.ts', name: 'CheckoutBrick.ts', type: 'file' },
  ],
  locales: [
    { id: 'locales/en.json', name: 'en.json', type: 'file' },
    { id: 'locales/fr.json', name: 'fr.json', type: 'file' },
  ],
};

// Simulate an async API: resolve after a short delay.
function fetchDir(id: string): Promise<readonly FsNode[]> {
  return new Promise((resolve) => setTimeout(() => resolve(FS[id] ?? []), 600));
}

/**
 * @title Lazy loading
 * Folders fetch their children the first time they expand, showing a spinner while the request is in flight.
 */
export default function TreeLazyLoadingDemo() {
  const [loaded, setLoaded] = useState<Record<string, readonly FsNode[]>>({});
  const [inflight, setInflight] = useState<ReadonlySet<string>>(new Set());

  const onExpand = async (id: string) => {
    if (loaded[id] ?? inflight.has(id)) return;
    setInflight((s) => new Set(s).add(id));
    const nodes = await fetchDir(id);
    setLoaded((s) => ({ ...s, [id]: nodes }));
    setInflight((s) => { const n = new Set(s); n.delete(id); return n; });
  };

  // Recursively render fs nodes; an in-flight folder shows <TreeLoading/>, a loaded
  // one shows its children. Compose whatever you want inside TreeLoading.
  const render = (nodes: readonly FsNode[]) =>
    nodes.map((node) => {
      if (node.type === 'file') {
        return <TreeItem key={node.id} nodeId={node.id} label={node.name} />;
      }
      const busy = inflight.has(node.id);
      return (
        <TreeItem key={node.id} nodeId={node.id} label={node.name} lazy loading={busy}>
          {busy ? <TreeLoading /> : render(loaded[node.id] ?? [])}
        </TreeItem>
      );
    });

  return (
    <Tree className="w-full max-w-xs" showLines onExpand={onExpand}>
      {render(FS.root)}
    </Tree>
  );
}
