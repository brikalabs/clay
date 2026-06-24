'use client';

import { Component, type ReactNode, Suspense, use } from 'react';

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

// These folders reject when loaded (e.g. a permission error).
const DENIED = new Set(['restricted']);

const cache = new Map<string, Promise<readonly FsNode[]>>();
function load(id: string): Promise<readonly FsNode[]> {
  const cached = cache.get(id);
  if (cached) {
    return cached;
  }
  const pending = new Promise<readonly FsNode[]>((resolve, reject) =>
    setTimeout(
      () => (DENIED.has(id) ? reject(new Error('Permission denied')) : resolve(FS[id] ?? [])),
      600
    )
  );
  cache.set(id, pending);
  return pending;
}

// Minimal error boundary: renders `fallback` once a child throws (a rejected load).
class LoadBoundary extends Component<
  { readonly fallback: ReactNode; readonly children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function renderNodes(list: readonly FsNode[]) {
  return list.map((node) =>
    node.type === 'file' ? (
      <TreeItem key={node.id} nodeId={node.id} label={node.name} />
    ) : (
      <TreeItem key={node.id} nodeId={node.id} label={node.name}>
        <LoadBoundary fallback={<TreeError />}>
          <Suspense fallback={<TreeLoading />}>
            <LazyChildren id={node.id} />
          </Suspense>
        </LoadBoundary>
      </TreeItem>
    )
  );
}

// Mounted only when its folder opens, so `use` suspends (or throws on a rejected load).
function LazyChildren({ id }: { id: string }) {
  return renderNodes(use(load(id)));
}

/**
 * @title Error handling
 * A lazy load that fails (here the `restricted` folder) is caught by an error boundary and shows <TreeError/> instead of children.
 */
export default function TreeErrorDemo() {
  return (
    <Tree className="w-full max-w-xs" showLines defaultExpandedIds={['src', 'restricted']}>
      {renderNodes(FS.root)}
    </Tree>
  );
}
