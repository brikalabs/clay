'use client';

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
} from '@brika/clay/components/code-block';

const SAMPLE = `export function greet(name: string) {
  return \`Hello, \${name}!\`;
}`;

/** Omit the header entirely and float the copy button over the code. */
export default function CodeBlockNoHeaderDemo() {
  return (
    <CodeBlock className="w-full max-w-lg">
      <CodeBlockCopyButton className="absolute top-2 right-2 z-10" />
      <CodeBlockContent language="tsx" filename="greet.ts">
        {SAMPLE}
      </CodeBlockContent>
    </CodeBlock>
  );
}
