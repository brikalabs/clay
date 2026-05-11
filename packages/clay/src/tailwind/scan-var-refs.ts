/**
 * Fast `var(--name)` reference scanner, faster than
 * `String.matchAll(regex)` because it avoids regex-engine overhead and
 * the `RegExpExecArray` allocation per match (~10x cheaper on the
 * registry-sized walks). Calls `consume(name)` for every reference
 * found in `value`.
 *
 * Token names match `[a-z][a-z0-9-]*` per the registry's invariant; we
 * trust the registry to enforce that and just scan until the first
 * non-name byte.
 */
export function scanVarRefs(value: string, consume: (name: string) => void): void {
  const NEEDLE = 'var(--';
  let from = 0;
  while (true) {
    const at = value.indexOf(NEEDLE, from);
    if (at === -1) return;
    let end = at + NEEDLE.length;
    while (end < value.length) {
      const code = value.codePointAt(end);
      // a-z, 0-9, or `-`. Any other byte (or supplementary code point,
      // since registry names are ASCII-only) ends the name.
      const ok =
        code !== undefined &&
        ((code >= 0x61 && code <= 0x7a) ||
          (code >= 0x30 && code <= 0x39) ||
          code === 0x2d);
      if (!ok) break;
      end++;
    }
    if (end > at + NEEDLE.length) {
      consume(value.slice(at + NEEDLE.length, end));
    }
    from = end;
  }
}
