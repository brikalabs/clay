'use client';

import { Tree, TreeItem } from '@brika/clay/components/tree';
import { useState } from 'react';

interface FsNode {
  readonly id: string;
  readonly name: string;
  readonly type: 'file' | 'folder';
}

// A mock file system: each folder id maps to its (already folder-first, sorted)
// children. A real app would fetch these from an API instead.
const TREE: Record<string, readonly FsNode[]> = {
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
    { id: 'src/bricks/checkout/handlers', name: 'handlers', type: 'folder' },
    { id: 'src/bricks/checkout/CheckoutBrick.ts', name: 'CheckoutBrick.ts', type: 'file' },
  ],
  'src/bricks/checkout/handlers': [
    { id: 'src/bricks/checkout/handlers/session.ts', name: 'session.ts', type: 'file' },
    { id: 'src/bricks/checkout/handlers/webhook.ts', name: 'webhook.ts', type: 'file' },
  ],
  locales: [
    { id: 'locales/en.json', name: 'en.json', type: 'file' },
    { id: 'locales/fr.json', name: 'fr.json', type: 'file' },
  ],
};

// Simulate a slow API: resolve a folder's children after a short delay.
function fetchDir(id: string): Promise<readonly FsNode[]> {
  return new Promise((resolve) => setTimeout(() => resolve(TREE[id] ?? []), 600));
}

/**
 * @title Lazy loading
 * Folders fetch their children the first time they expand (here from a mock file system with a simulated delay), showing a spinner while the request is in flight.
 */
export default function TreeLazyLoadingDemo() {
  const [children, setChildren] = useState<Record<string, readonly FsNode[]>>({});
  const [loading, setLoading] = useState<ReadonlySet<string>>(new Set());

  const loadChildren = async (id: string) => {
    // Load each folder once; skip if already loaded or in flight.
    if (children[id] || loading.has(id)) {
      return;
    }
    setLoading((prev) => new Set(prev).add(id));
    const nodes = await fetchDir(id);
    setChildren((prev) => ({ ...prev, [id]: nodes }));
    setLoading((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const renderNodes = (nodes: readonly FsNode[]) =>
    nodes.map((node) =>
      node.type === 'file' ? (
        <TreeItem key={node.id} nodeId={node.id} label={node.name} />
      ) : (
        <TreeItem key={node.id} nodeId={node.id} label={node.name} lazy loading={loading.has(node.id)}>
          {renderNodes(children[node.id] ?? [])}
        </TreeItem>
      )
    );

  return (
    <Tree className="w-full max-w-xs" showLines onExpand={loadChildren}>
      {renderNodes(TREE.root)}
    </Tree>
  );
}
