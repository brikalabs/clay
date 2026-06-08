'use client';

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockInfo,
} from '@brika/clay/components/code-block';

const SAMPLE = `import { Button } from "@brika/clay/components/button";

export default function Save() {
  return <Button>Save changes</Button>;
}`;

/** Syntax-highlighted code with a filename header and a copy-to-clipboard button. */
export default function CodeBlockDefaultDemo() {
  return (
    <CodeBlock className="w-full max-w-lg">
      <CodeBlockHeader>
        <CodeBlockInfo>
          {({ filename, language }) => (
            <span className="flex min-w-0 items-center gap-2 font-mono text-muted-foreground text-xs">
              <span className="truncate">{filename}</span>
              <span className="text-[0.625rem] uppercase tracking-wider">{language}</span>
            </span>
          )}
        </CodeBlockInfo>
        <CodeBlockActions>
          <CodeBlockCopyButton />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent language="tsx" filename="save.tsx" showLineNumbers={false}>
        {SAMPLE}
      </CodeBlockContent>
    </CodeBlock>
  );
}
