/**
 * Common props for every per-token control. Each control owns the parsing
 * of the string `value` into whatever native widget it renders, and emits
 * a string back to the editor — the draft never holds parsed numbers, so
 * round-tripping `oklch(...)`, `calc(...)`, etc. is lossless.
 */

export interface TokenControlBaseProps {
  readonly label: string;
  readonly value: string;
  readonly defaultValue: string;
  readonly isDirty: boolean;
  readonly onChange: (next: string) => void;
  readonly onReset: () => void;
}
