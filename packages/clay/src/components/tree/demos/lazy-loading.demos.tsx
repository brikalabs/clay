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
const fetchDir = (id: string) =>
  new Promise<readonly FsNode[]>((resolve) => setTimeout(() => resolve(FS[id] ?? []), 600));

/**
 * @title Lazy loading
 * Folders fetch their children the first time they expand, showing a spinner while the request is in flight.
 */
export default function TreeLazyLoadingDemo() {
  // One entry per folder: null while loading, the children array once loaded.
  const [dir, setDir] = useState<Record<string, readonly FsNode[] | null>>({});

  const onExpand = async (id: string) => {
    if (id in dir) return;
    setDir((d) => ({ ...d, [id]: null }));
    const nodes = await fetchDir(id);
    setDir((d) => ({ ...d, [id]: nodes }));
  };

  const render = (nodes: readonly FsNode[]) =>
    nodes.map((node) => {
      if (node.type === 'file') {
        return <TreeItem key={node.id} nodeId={node.id} label={node.name} />;
      }
      const entry = dir[node.id];
      return (
        <TreeItem key={node.id} nodeId={node.id} label={node.name} lazy loading={entry === null}>
          {entry === null ? <TreeLoading /> : render(entry ?? [])}
        </TreeItem>
      );
    });

  return (
    <Tree className="w-full max-w-xs" showLines onExpand={onExpand}>
      {render(FS.root)}
    </Tree>
  );
}
