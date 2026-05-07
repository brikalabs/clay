import { useState } from 'react';

interface SlashCommandProps {
  /**
   * One or more Claude Code slash commands. A single command can be
   * passed as a string; multi-line sequences as a string array. Lines
   * are rendered as separate command lines and copied together.
   */
  readonly command: string | readonly string[];
  /** Override the visible label shown next to the prompt arrow. */
  readonly label?: string;
}

/**
 * Renders a Claude Code slash-command snippet with a copy button —
 * visually matches `<PackageManager>`'s install block, minus the
 * package-manager tabs (slash commands don't vary by tool).
 */
export function SlashCommand({ command, label }: SlashCommandProps) {
  const lines = Array.isArray(command) ? command : [command];
  const text = lines.join('\n');
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // Clipboard blocked — keep the visible command intact.
    }
  };

  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border border-clay-hairline bg-clay-elevated">
      {label !== undefined && (
        <div className="border-clay-hairline border-b px-4 py-2 font-mono text-[0.6875rem] text-clay-subtle uppercase tracking-wider">
          {label}
        </div>
      )}
      <div className="relative bg-clay-base">
        <pre className="overflow-x-auto p-4 pr-20 font-mono text-clay-default text-sm">
          <code>
            {lines.map((line, idx) => (
              <span key={line} className="block">
                <span aria-hidden="true" className="mr-2 select-none text-clay-inactive">
                  {idx === 0 ? 'claude>' : '       '}
                </span>
                {line}
              </span>
            ))}
          </code>
        </pre>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy slash command"
          className="absolute top-2 right-2 rounded border border-clay-hairline bg-clay-elevated px-2 py-1 font-mono text-clay-subtle text-xs transition-colors hover:bg-clay-control hover:text-clay-default"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
