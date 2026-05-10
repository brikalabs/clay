/**
 * Export dialog with format tabs (JSON / TypeScript / CSS / Tailwind).
 * Each tab shows a monospaced preview of the generated code, with
 * Copy and Download buttons. Replaces the kebab "Copy as …" items.
 */

import { Button } from '@brika/clay/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@brika/clay/components/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@brika/clay/components/tabs';
import { toast } from '@brika/clay/components/toast';
import type { ThemeConfig } from '@brika/clay/themes';
import { Check, Copy, Download, Share2 } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { downloadThemeJson, toCss, toTailwindCall, toTypeScript } from './state/io';
import { type Draft, type ThemeIdentity, themeConfigFromDraft } from './state/draft';

interface ExportDialogProps {
  readonly draft: Draft;
  readonly identity: ThemeIdentity;
  readonly trigger: ReactNode;
}

type Format = 'json' | 'ts' | 'css' | 'tw';

interface FormatSpec {
  readonly id: Format;
  readonly label: string;
  readonly hint: string;
  readonly extension: string;
  readonly mime: string;
  readonly render: (theme: ThemeConfig) => string;
}

const FORMATS: readonly FormatSpec[] = [
  {
    id: 'json',
    label: 'JSON',
    hint: 'Drop into themes/presets/ or pass to clayPlugin({ theme: "..." }).',
    extension: 'json',
    mime: 'application/json',
    render: (t) => JSON.stringify(t, null, 2),
  },
  {
    id: 'ts',
    label: 'TypeScript',
    hint: 'Paste into your app as a typed ThemeConfig export.',
    extension: 'ts',
    mime: 'text/typescript',
    render: toTypeScript,
  },
  {
    id: 'css',
    label: 'CSS',
    hint: 'Pre-rendered :root + dark-mode block. Drop into a stylesheet.',
    extension: 'css',
    mime: 'text/css',
    render: toCss,
  },
  {
    id: 'tw',
    label: 'Tailwind',
    hint: 'Full tailwind.config import + clayPlugin call with the theme inlined.',
    extension: 'config.ts',
    mime: 'text/typescript',
    render: toTailwindCall,
  },
];

export function ExportDialog({ draft, identity, trigger }: ExportDialogProps) {
  const [format, setFormat] = useState<Format>('json');
  const [copied, setCopied] = useState<Format | null>(null);

  const theme = useMemo(() => themeConfigFromDraft(draft, identity), [draft, identity]);
  const previews = useMemo(
    () => Object.fromEntries(FORMATS.map((f) => [f.id, f.render(theme)])) as Record<Format, string>,
    [theme]
  );

  const active = FORMATS.find((f) => f.id === format) ?? FORMATS[0];
  const safeId = (identity.id || 'theme').replace(/[^a-z0-9_-]/gi, '_') || 'theme';

  const copy = async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      toast.error('Clipboard unavailable.');
      return;
    }
    try {
      await navigator.clipboard.writeText(previews[format]);
      setCopied(format);
      setTimeout(() => setCopied(null), 1500);
      toast.success(`${active.label} copied.`);
    } catch {
      toast.error("Couldn't copy to clipboard.");
    }
  };

  const download = () => {
    if (format === 'json') {
      downloadThemeJson(theme);
    } else {
      const blob = new Blob([previews[format]], { type: active.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${safeId}.${active.extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
    toast.success(`${active.label} downloaded.`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl gap-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="size-4 text-clay-subtle" />
            Export theme
          </DialogTitle>
          <DialogDescription>
            Pick a format. Copy the snippet, or download the file.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={format} onValueChange={(v) => setFormat(v as Format)}>
          <TabsList className="w-full">
            {FORMATS.map((f) => (
              <TabsTrigger key={f.id} value={f.id} className="flex-1">
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {FORMATS.map((f) => (
            <TabsContent key={f.id} value={f.id} className="mt-3 flex flex-col gap-3">
              <p className="font-mono text-[0.6875rem] text-clay-subtle italic">{f.hint}</p>
              <pre
                className="max-h-80 overflow-auto rounded-xl border border-clay-hairline bg-clay-canvas/40 p-3 font-mono text-[0.6875rem] text-clay-default leading-relaxed"
                aria-label={`${f.label} preview`}
              >
                <code>{previews[f.id]}</code>
              </pre>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.625rem] text-clay-subtle">
                  {previews[f.id].split('\n').length} lines · {previews[f.id].length.toLocaleString()} chars
                </span>
                <div className="flex items-center gap-2">
                  <Button onClick={copy} size="sm" variant="outline" className="rounded-full">
                    {copied === f.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied === f.id ? 'Copied' : 'Copy'}
                  </Button>
                  <Button onClick={download} size="sm" className="rounded-full">
                    <Download className="size-3.5" />
                    Download .{f.extension}
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
