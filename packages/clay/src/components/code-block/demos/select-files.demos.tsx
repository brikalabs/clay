'use client';

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockPanel,
  CodeBlockSelect,
  CodeBlockSelectItem,
} from '@brika/clay/components/code-block';
import { FileCode, FileJson, Palette } from 'lucide-react';
import type { ReactNode } from 'react';

interface DemoFile {
  readonly name: string;
  readonly language: string;
  readonly icon: ReactNode;
  readonly code: string;
}

const APP_TSX = `import { Header } from "./header";

export function App() {
  return <Header title="Clay" />;
}`;

const HEADER_TSX = `export function Header({ title }: { title: string }) {
  return <h1 className="title">{title}</h1>;
}`;

const STYLES_CSS = `.title {
  font-weight: 600;
  letter-spacing: -0.02em;
}`;

const TSCONFIG_JSON = `{
  "compilerOptions": {
    "jsx": "react-jsx",
    "strict": true
  }
}`;

const FILES: readonly DemoFile[] = [
  { name: 'app.tsx', language: 'tsx', icon: <FileCode />, code: APP_TSX },
  { name: 'header.tsx', language: 'tsx', icon: <FileCode />, code: HEADER_TSX },
  { name: 'styles.css', language: 'css', icon: <Palette />, code: STYLES_CSS },
  { name: 'tsconfig.json', language: 'json', icon: <FileJson />, code: TSCONFIG_JSON },
];

/** A dropdown scales better than tabs when there are many files; each item can carry a file-type icon. */
export default function CodeBlockSelectFilesDemo() {
  return (
    <CodeBlock className="w-full max-w-lg" defaultValue="app.tsx">
      <CodeBlockHeader>
        <CodeBlockSelect>
          {FILES.map((file) => (
            <CodeBlockSelectItem key={file.name} value={file.name} icon={file.icon}>
              {file.name}
            </CodeBlockSelectItem>
          ))}
        </CodeBlockSelect>
        <CodeBlockActions>
          <CodeBlockCopyButton />
        </CodeBlockActions>
      </CodeBlockHeader>
      {FILES.map((file) => (
        <CodeBlockPanel key={file.name} value={file.name}>
          <CodeBlockContent language={file.language} filename={file.name}>
            {file.code}
          </CodeBlockContent>
        </CodeBlockPanel>
      ))}
    </CodeBlock>
  );
}
