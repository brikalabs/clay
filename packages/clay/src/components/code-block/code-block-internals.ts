import { cva } from 'class-variance-authority';
import * as React from 'react';

// --- Variants ---

export const codeBlockVariants = cva(
  'code-block overflow-hidden rounded-code-block border border-code-block-border-color bg-code-block-bg backdrop-blur-code-block',
  {
    variants: {
      variant: {
        default: '',
        subtle: 'border-transparent bg-code-block-subtle-bg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const codeBlockHeaderVariants = cva(
  'flex items-center gap-2 border-code-block-border-color border-b bg-code-block-header-bg px-3 py-2',
  {
    variants: {
      variant: {
        default: '',
        flat: 'border-transparent bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const codeBlockContentVariants = cva('m-0', {
  variants: {
    size: {
      default: 'p-4 text-sm leading-6',
      sm: 'p-3 text-xs leading-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export const codeBlockGutterVariants = cva(
  'select-none border-code-block-gutter-border border-r bg-code-block-gutter-bg px-3 font-mono text-code-block-gutter-label tabular-nums',
  {
    variants: {
      size: {
        default: 'py-4 text-xs leading-6',
        sm: 'py-3 text-[10px] leading-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

// --- Types ---

export type CodeToken = {
  content: string;
  color?: string;
  fontStyle?: number;
};

export interface CodeBlockThemes {
  readonly light: string;
  readonly dark: string;
}

export const DEFAULT_THEMES: CodeBlockThemes = {
  light: 'catppuccin-latte',
  dark: 'catppuccin-mocha',
};

export type Mode = 'light' | 'dark';

/** Read the page's current mode from `<html data-mode="...">` or the legacy `.dark` class. */
function readMode(): Mode {
  if (typeof document === 'undefined') return 'light';
  const root = document.documentElement;
  if (root.dataset.mode === 'dark' || root.classList.contains('dark')) {
    return 'dark';
  }
  return 'light';
}

// --- Context ---

export type CodeBlockContextValue = {
  code: string;
  lineCount: number;
  language: string | null;
  filename: string | null;
  setCodeInfo: (code: string, lineCount: number) => void;
  setLanguage: (language: string | null) => void;
  setFilename: (filename: string | null) => void;
};

export const CodeBlockContext = React.createContext<CodeBlockContextValue | null>(null);

export function useCodeBlockContext(component: string) {
  const context = React.useContext(CodeBlockContext);
  if (!context) {
    throw new Error(`${component} must be used within a CodeBlock`);
  }
  return context;
}

// --- Highlight utilities ---

type HighlightResult = {
  tokens: CodeToken[][];
  foreground: string | null;
};

/**
 * Load Shiki, verify language support, and tokenize the code with the
 * theme matching the page's current mode. Returns null if the
 * language is not bundled or tokenization fails.
 */
export async function tokenizeWithShiki(
  code: string,
  language: string,
  theme: string
): Promise<HighlightResult | null> {
  const shiki = await import('shiki/bundle/web');
  const key = language.toLowerCase();
  if (!(key in shiki.bundledLanguages)) return null;

  try {
    const result = await shiki.codeToTokens(code, {
      lang: key as Parameters<typeof shiki.codeToTokens>[1]['lang'],
      theme,
    });
    return {
      tokens: result.tokens,
      foreground: result.fg ?? null,
    };
  } catch {
    return null;
  }
}

export function getTokenStyle(token: CodeToken): React.CSSProperties {
  return {
    color: token.color,
    fontStyle: token.fontStyle && (token.fontStyle & 1) === 1 ? 'italic' : undefined,
    fontWeight: token.fontStyle && (token.fontStyle & 2) === 2 ? 600 : undefined,
    textDecoration: token.fontStyle && (token.fontStyle & 4) === 4 ? 'underline' : undefined,
  };
}

/** Subscribe to changes in the page's mode (data-mode / .dark on <html>). */
export function useMode(): Mode {
  const [mode, setMode] = React.useState<Mode>(readMode);
  React.useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setMode(readMode()));
    observer.observe(root, { attributes: true, attributeFilter: ['data-mode', 'class'] });
    return () => observer.disconnect();
  }, []);
  return mode;
}
