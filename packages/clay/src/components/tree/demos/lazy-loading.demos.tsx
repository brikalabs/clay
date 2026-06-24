'use client';

import { Suspense, use } from 'react';

import { Tree, TreeError, TreeItem, TreeLoading } from '@brika/clay/components/tree';

interface FsNode {
  readonly id: string;
  readonly name: string;
  readonly type: 'file' | 'folder';
}

// Mock file system: folder id -> children list. `restricted` has no entry; it
// resolves to the 'error' sentinel below (a real loader would .catch() into it).
const FS: Record<string, readonly FsNode[]> = {
  root: [
    { id: 'src', name: 'src', type: 'folder' },
    { id: 'restricted', name: 'restricted', type: 'folder' },
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
};
const DENIED = new Set(['restricted']);

// One cached promise per folder so `use` reads a stable promise; resolves after a delay.
const cache = new Map<string, Promise<readonly FsNode[] | 'error'>>();
function load(id: string) {
  const cached = cache.get(id);
  if (cached) {
    return cached;
  }
  const pending = new Promise<readonly FsNode[] | 'error'>((resolve) =>
    setTimeout(() => resolve(DENIED.has(id) ? 'error' : (FS[id] ?? [])), 600)
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

// Mounted only when its folder opens; suspends until the load resolves, then renders
// the children, or <TreeError/> when the load resolved to an error.
function Children({ id }: { id: string }) {
  const result = use(load(id));
  return result === 'error' ? <TreeError /> : result.map((node) => <Node key={node.id} node={node} />);
}

/**
 * @title Lazy loading
 * Folders fetch their children on first expand (Suspense + use) with a spinner while in flight; a failed load (the restricted folder) renders <TreeError/> instead.
 */
export default function TreeLazyLoadingDemo() {
  return (
    <Tree className="w-full max-w-xs" showLines defaultExpandedIds={['src']}>
      {FS.root.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </Tree>
  );
}
