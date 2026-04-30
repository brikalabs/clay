import docgen from 'virtual:clay-docgen';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ClayComponentDoc, ClayPropDoc } from '~/lib/vite-plugin-clay-docgen';

const propMarkdownComponents: Components = {
  p: ({ children }) => <span>{children}</span>,
  code: ({ children }) => (
    <code className="rounded border border-clay-hairline bg-clay-base px-1 py-px font-mono text-[0.8125rem] text-clay-default">
      {children}
    </code>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-clay-link underline-offset-2 hover:underline"
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      target={href?.startsWith('http') ? '_blank' : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold text-clay-strong">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
};

interface PropsTableProps {
  /** Kebab-case component slug matching the folder name (e.g. "dropdown-menu"). */
  readonly slug: string;
}

const LITERAL_LIMIT = 24;

interface ParsedType {
  readonly raw: string;
  readonly literals: readonly string[] | null;
}

function parseType(raw: string): ParsedType {
  const parts = raw.split('|').map((p) => p.trim());
  if (parts.length < 2 || parts.length > LITERAL_LIMIT) {
    return { raw, literals: null };
  }
  const literals: string[] = [];
  for (const part of parts) {
    const isStringLiteral = /^"[^"]*"$/.test(part) || /^'[^']*'$/.test(part);
    const isNumberLiteral = /^-?\d+(\.\d+)?$/.test(part);
    const isBoolOrNullish = part === 'true' || part === 'false' || part === 'null';
    if (!(isStringLiteral || isNumberLiteral || isBoolOrNullish)) {
      return { raw, literals: null };
    }
    literals.push(part);
  }
  return { raw, literals };
}

function TypeSignature({ raw, literals }: ParsedType) {
  if (!literals) {
    return <span className="text-clay-default">{raw}</span>;
  }
  return (
    <span className="text-clay-subtle">
      {literals.map((literal, index) => (
        <span key={literal}>
          {index > 0 && <span className="text-clay-inactive"> | </span>}
          <span className="text-clay-default">{literal}</span>
        </span>
      ))}
    </span>
  );
}

function PropRow({ prop }: { prop: ClayPropDoc }) {
  const parsed = parseType(prop.type);
  const id = `prop-${prop.name}`;
  return (
    <li id={id} className="scroll-mt-24 px-4 py-4">
      {/* Name + default */}
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <a
          href={`#${id}`}
          className="font-mono font-semibold text-[0.9375rem] text-clay-strong underline-offset-4 hover:underline"
        >
          {prop.name}
          {prop.required && (
            <span aria-label="required" className="ml-0.5 text-clay-brand">
              *
            </span>
          )}
        </a>
        {prop.defaultValue !== null && (
          <span className="font-mono text-[0.75rem] text-clay-inactive">
            default{' '}
            <code className="rounded bg-clay-base px-1 py-px text-clay-default">
              {prop.defaultValue}
            </code>
          </span>
        )}
      </div>
      {/* Type */}
      <div className="wrap-break-word mb-2 font-mono text-[0.8125rem] leading-5">
        <TypeSignature {...parsed} />
      </div>
      {/* Description */}
      {prop.description ? (
        <p className="text-clay-default text-sm leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={propMarkdownComponents}>
            {prop.description}
          </ReactMarkdown>
        </p>
      ) : (
        <p className="text-clay-inactive text-sm italic leading-relaxed">No description.</p>
      )}
    </li>
  );
}

function ComponentSection({
  doc,
  showHeading,
}: {
  doc: ClayComponentDoc;
  showHeading: boolean;
}) {
  const propCount = doc.props.length;

  return (
    <section>
      {showHeading && (
        <div className="mb-3 flex items-center gap-3">
          <h3
            id={`sub-${doc.displayName.toLowerCase()}`}
            className="scroll-mt-24 font-mono text-[0.9375rem] font-bold text-clay-strong"
          >
            <span className="text-clay-inactive">&lt;</span>
            {doc.displayName}
            <span className="text-clay-inactive"> /&gt;</span>
          </h3>
          <span className="h-px flex-1 bg-clay-hairline" />
          <span className="rounded-full bg-clay-elevated px-2 py-0.5 font-mono text-[0.6875rem] text-clay-inactive">
            {propCount === 0 ? 'passthrough' : `${propCount} prop${propCount !== 1 ? 's' : ''}`}
          </span>
        </div>
      )}

      {propCount > 0 ? (
        <ul className="divide-y divide-clay-hairline overflow-hidden rounded-md border border-clay-hairline">
          {doc.props.map((prop) => (
            <PropRow key={prop.name} prop={prop} />
          ))}
        </ul>
      ) : (
        <p className="rounded-md border border-clay-hairline border-dashed px-4 py-3 text-clay-inactive text-sm italic">
          No wrapper-specific props — all attributes pass through to the underlying primitive.
        </p>
      )}
    </section>
  );
}

export function PropsTable({ slug }: PropsTableProps) {
  const allDocs = docgen[slug] ?? [];

  if (allDocs.length === 0) {
    const name = slug
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
    return (
      <div className="not-prose rounded-md border border-clay-hairline border-dashed bg-clay-canvas/30 px-4 py-6 text-center">
        <p className="font-mono text-clay-subtle text-sm">
          <span className="font-semibold text-clay-default">{name}</span> exposes no
          wrapper-specific props.
        </p>
        <p className="mx-auto mt-1 max-w-xl text-[0.75rem] text-clay-inactive leading-relaxed">
          All props pass through to the underlying HTML / Radix primitive — see the component source
          linked above for the full type signature.
        </p>
      </div>
    );
  }

  const showHeadings = allDocs.length > 1;

  return (
    <div className="not-prose flex flex-col gap-8">
      {allDocs.map((doc) => (
        <ComponentSection key={doc.displayName} doc={doc} showHeading={showHeadings} />
      ))}
    </div>
  );
}
