'use client';

import { Suspense, use } from 'react';

import { Tree, TreeItem, TreeLoading } from '@brika/clay/components/tree';

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

// One cached promise per folder (so `use` reads a stable promise), resolving after a delay.
const cache = new Map<string, Promise<readonly FsNode[]>>();
function load(id: string): Promise<readonly FsNode[]> {
  const cached = cache.get(id);
  if (cached) {
    return cached;
  }
  const pending = new Promise<readonly FsNode[]>((resolve) =>
    setTimeout(() => resolve(FS[id] ?? []), 600)
  );
  cache.set(id, pending);
  return pending;
}

function Node({ node }: { node: FsNode }) {
  return (
    <TreeItem nodeId={node.id} label={node.name}>
      {node.type === 'folder' && (
        <Suspense fallback={<TreeLoading />}>
          <Children id={node.id} />
        </Suspense>
      )}
    </TreeItem>
  );
}

// Mounted only when its folder opens (the Tree skips closed branches), so `use`
// suspends on first open until the folder's children resolve.
function Children({ id }: { id: string }) {
  return use(load(id)).map((node) => <Node key={node.id} node={node} />);
}

/**
 * @title Lazy loading
 * Folders load their children the first time they expand (React Suspense + use), showing a spinner while the request is in flight.
 */
export default function TreeLazyLoadingDemo() {
  return (
    <Tree className="w-full max-w-xs" showLines>
      {FS.root.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </Tree>
  );
}
