'use client';

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockPanel,
  CodeBlockTab,
  CodeBlockTabs,
} from '@brika/clay/components/code-block';
import { FileCode, Palette } from 'lucide-react';

const BUTTON_TSX = `import "./button.css";

export function Button(props) {
  return <button className="btn" {...props} />;
}`;

const BUTTON_CSS = `.btn {
  border-radius: var(--radius-control);
  padding: 0.5rem 1rem;
}`;

const INDEX_TS = `export { Button } from "./button";
export type { ButtonProps } from "./button";`;

/** Switch between several files with a header tab bar; each tab can carry a file-type icon. */
export default function CodeBlockMultipleFilesDemo() {
  return (
    <CodeBlock className="w-full max-w-lg" defaultValue="button.tsx">
      <CodeBlockHeader>
        <CodeBlockTabs>
          <CodeBlockTab value="button.tsx" icon={<FileCode />}>
            button.tsx
          </CodeBlockTab>
          <CodeBlockTab value="button.css" icon={<Palette />}>
            button.css
          </CodeBlockTab>
          <CodeBlockTab value="index.ts" icon={<FileCode />}>
            index.ts
          </CodeBlockTab>
        </CodeBlockTabs>
        <CodeBlockActions>
          <CodeBlockCopyButton />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockPanel value="button.tsx">
        <CodeBlockContent language="tsx" filename="button.tsx">
          {BUTTON_TSX}
        </CodeBlockContent>
      </CodeBlockPanel>
      <CodeBlockPanel value="button.css">
        <CodeBlockContent language="css" filename="button.css">
          {BUTTON_CSS}
        </CodeBlockContent>
      </CodeBlockPanel>
      <CodeBlockPanel value="index.ts">
        <CodeBlockContent language="ts" filename="index.ts">
          {INDEX_TS}
        </CodeBlockContent>
      </CodeBlockPanel>
    </CodeBlock>
  );
}
