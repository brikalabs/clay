'use client';

import { Tree, TreeItem } from '@brika/clay/components/tree';
import { useState } from 'react';

interface FsNode {
  readonly id: string;
  readonly name: string;
  readonly type: 'file' | 'folder';
}

/** Shape of the entries returned by the GitHub Contents API for a directory. */
interface GitHubEntry {
  readonly name: string;
  readonly path: string;
  readonly type: string;
}

const REPO = 'brikalabs/clay';

function toNode(entry: GitHubEntry): FsNode {
  return { id: entry.path, name: entry.name, type: entry.type === 'dir' ? 'folder' : 'file' };
}

/** Folders first, then alphabetical, the usual file-explorer ordering. */
function compareNodes(a: FsNode, b: FsNode): number {
  if (a.type !== b.type) {
    return a.type === 'folder' ? -1 : 1;
  }
  return a.name.localeCompare(b.name);
}

/** Real network call: list a directory's contents from the GitHub API. */
async function fetchDir(path: string): Promise<FsNode[]> {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`);
  if (!res.ok) {
    throw new Error(`GitHub API responded ${res.status}`);
  }
  const entries: GitHubEntry[] = await res.json();
  return entries.map(toNode).sort(compareNodes);
}

/**
 * @title Lazy loading
 * Browse the real `brikalabs/clay` repository: each folder fetches its contents
 * from the GitHub Contents API the first time it's expanded. Mark a node `lazy`
 * so it shows a chevron before its children exist, pass `loading` while the
 * request is in flight, then feed the resolved entries back in as children.
 */
export default function TreeLazyLoadingDemo() {
  const [children, setChildren] = useState<Record<string, readonly FsNode[]>>({});
  const [loading, setLoading] = useState<ReadonlySet<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadChildren = async (id: string) => {
    // Load each folder once; skip if already loaded or in flight.
    if (children[id] || loading.has(id)) {
      return;
    }
    setLoading((prev) => new Set(prev).add(id));
    try {
      const nodes = await fetchDir(id === 'root' ? '' : id);
      setChildren((prev) => ({ ...prev, [id]: nodes }));
    } catch {
      setErrors((prev) => ({ ...prev, [id]: 'Could not load (GitHub API rate limit?)' }));
    } finally {
      setLoading((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const renderChildren = (id: string) => {
    if (errors[id]) {
      return (
        <TreeItem
          nodeId={`${id}:error`}
          label={<span className="text-destructive">{errors[id]}</span>}
          disabled
        />
      );
    }
    return (children[id] ?? []).map((node) =>
      node.type === 'file' ? (
        <TreeItem key={node.id} nodeId={node.id} label={node.name} />
      ) : (
        <TreeItem key={node.id} nodeId={node.id} label={node.name} lazy loading={loading.has(node.id)}>
          {renderChildren(node.id)}
        </TreeItem>
      )
    );
  };

  return (
    <Tree className="w-full max-w-xs" onExpand={loadChildren}>
      <TreeItem nodeId="root" label={REPO} lazy loading={loading.has('root')}>
        {renderChildren('root')}
      </TreeItem>
    </Tree>
  );
}
