import { Separator } from '@brika/clay/components/separator';

/** Vertical separator in a navigation link row. */
export default function SeparatorNavDemo() {
  return (
    <div className="flex h-5 items-center gap-3">
      <a href="https://example.com" className="text-sm hover:underline">Docs</a>
      <Separator orientation="vertical" />
      <a href="https://example.com" className="text-sm hover:underline">API</a>
      <Separator orientation="vertical" />
      <a href="https://example.com" className="text-sm hover:underline">GitHub</a>
    </div>
  );
}
