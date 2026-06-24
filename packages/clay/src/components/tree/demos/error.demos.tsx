'use client';

import { Suspense, use } from 'react';

import { Tree, TreeError, TreeItem, TreeLoading } from '@brika/clay/components/tree';

interface FsNode {
  readonly id: string;
  readonly name: string;
  readonly type: 'file' | 'folder';
}

// Mock file system: folder id -> children list.
const FS: Record<string, readonly FsNode[]> = {
  root: [
    { id: 'src', name: 'src', type: 'folder' },
    { id: 'restricted', name: 'restricted', type: 'folder' },
    { id: 'package.json', name: 'package.json', type: 'file' },
  ],
  src: [
    { id: 'src/index.ts', name: 'index.ts', type: 'file' },
    { id: 'src/styles.css', name: 'styles.css', type: 'file' },
  ],
};

// One cached promise per folder. `restricted` resolves to the 'error' sentinel (a real
// loader would .catch() its fetch into this), so the component renders <TreeError/>
// inline, no error boundary needed.
const cache = new Map<string, Promise<readonly FsNode[] | 'error'>>();
function load(id: string) {
  const cached = cache.get(id);
  if (cached) {
    return cached;
  }
  const pending = new Promise<readonly FsNode[] | 'error'>((resolve) =>
    setTimeout(() => resolve(id === 'restricted' ? 'error' : (FS[id] ?? [])), 600)
  );
  cache.set(id, pending);
  return pending;
}

function renderNodes(list: readonly FsNode[]) {
  return list.map((node) =>
    node.type === 'file' ? (
      <TreeItem key={node.id} nodeId={node.id} label={node.name} />
    ) : (
      <TreeItem key={node.id} nodeId={node.id} label={node.name}>
        <Suspense fallback={<TreeLoading />}>
          <LazyChildren id={node.id} />
        </Suspense>
      </TreeItem>
    )
  );
}

// Suspends on first open; renders <TreeError/> when the load resolves to an error.
function LazyChildren({ id }: { id: string }) {
  const result = use(load(id));
  return result === 'error' ? <TreeError /> : renderNodes(result);
}

/**
 * @title Error handling
 * A lazy load that fails (here the `restricted` folder) renders <TreeError/> instead of its children.
 */
export default function TreeErrorDemo() {
  return (
    <Tree className="w-full max-w-xs" showLines defaultExpandedIds={['src', 'restricted']}>
      {renderNodes(FS.root)}
    </Tree>
  );
}
