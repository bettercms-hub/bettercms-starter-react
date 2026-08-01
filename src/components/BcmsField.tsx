/**
 * <BcmsField> — tag an entry field's rendered value with its identity so the BetterCMS visual
 * editor can bind click-to-edit deterministically.
 *
 * A 12-line copy of `@bettercms-ai/next`'s BcmsField, which lives behind that package's root
 * entry (the one place it imports `next`). Copying it is cheaper than pulling Next into a Vite
 * app for twelve lines, and the contract is just two DOM attributes — the editor stamps
 * `data-node-id` from `data-bcms-field` after hydration and re-stamps on repaint, so a
 * client-rendered React tree binds exactly like a server-rendered Astro one.
 *
 * `path` follows the editor grammar: `title` · `hero.title` · `facts[2].label` (dotted keys, at
 * most one array index). For images, put the attributes on the `<img>` itself — `kind="image"`
 * reflection patches `.src` — not on a wrapper.
 */
import type { ElementType, ReactNode } from "react";

export interface BcmsFieldProps {
  /** Field path in the editor grammar, e.g. `title` or `facts[2].label`. */
  path: string;
  /** Kind hint the editor's reflection branches on. Omit for plain text/number. */
  kind?: "richtext" | "image";
  /** Wrapper element. Defaults to a `display:contents` span, invisible to layout. */
  as?: ElementType;
  children: ReactNode;
}

export function BcmsField({ path, kind, as, children }: BcmsFieldProps) {
  const Tag = as ?? "span";
  return (
    <Tag data-bcms-field={path} data-bcms-kind={kind} style={as ? undefined : { display: "contents" }}>
      {children}
    </Tag>
  );
}
