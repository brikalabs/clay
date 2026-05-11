/**
 * JSDoc extraction. The TS parser exposes attached JSDoc nodes on
 * most declarations (FunctionDeclaration, PropertySignature, etc.)
 * under the non-public `jsDoc` field; we use it via a typed accessor
 * and fall back to leading comment ranges for nodes that don't carry
 * attached JSDoc.
 */

import * as ts from 'typescript';

interface JSDocCarrier {
  readonly jsDoc?: readonly ts.JSDoc[];
}

export function getJsDocSummary(node: ts.Node, source: string): string {
  const attached = (node as unknown as JSDocCarrier).jsDoc;
  const last = attached?.at(-1);
  if (last) {
    const text = jsDocCommentToText(last.comment);
    if (text) return text;
  }
  // Fallback: scan leading /** ... */ comment if the parser didn't
  // attach JSDoc (rare for the node kinds we walk, but cheap to handle).
  const ranges = ts.getLeadingCommentRanges(source, node.getFullStart()) ?? [];
  for (let i = ranges.length - 1; i >= 0; i--) {
    const range = ranges[i];
    if (range.kind === ts.SyntaxKind.MultiLineCommentTrivia) {
      const raw = source.slice(range.pos, range.end);
      if (raw.startsWith('/**')) {
        return cleanCommentBody(raw);
      }
    }
  }
  return '';
}

function jsDocCommentToText(
  comment: string | ts.NodeArray<ts.JSDocComment> | undefined
): string {
  if (!comment) return '';
  if (typeof comment === 'string') return comment.trim();
  return comment
    .map((c) => {
      if ('text' in c && typeof c.text === 'string') {
        return c.text;
      }
      return '';
    })
    .join('')
    .trim();
}

function cleanCommentBody(raw: string): string {
  return raw
    .replace(/^\/\*\*?/, '')
    .replace(/\*\/$/, '')
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, ''))
    .join('\n')
    .trim();
}
