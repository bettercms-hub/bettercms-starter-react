/** N1b nav — three sections: wordmark · links · one CTA.
 *
 *  Everything comes from the `site` global, so rebranding happens in the CMS, not here. The
 *  CTA is DERIVED from navLinks (the last entry) rather than appended to them: the old nav
 *  hard-coded a Contact button on top of the seeded Contact link, so Contact rendered twice. */
import { Link, useLocation } from "react-router-dom";
import { items, type NavLink as NavLinkT, type Site } from "../lib/content";
import { brandName } from "../lib/seo";

const FALLBACK: NavLinkT[] = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Contact", href: "/contact" },
];

export function Nav({ site }: { site?: Site }) {
  const brand = brandName();
  const nav = items(site?.navLinks).length ? items(site?.navLinks) : FALLBACK;
  /** The last link is the CTA — one button, never a duplicate of a link beside it. */
  const cta = nav.at(-1);
  const links = nav.slice(0, -1);

  const path = useLocation().pathname.replace(/\/$/, "") || "/";
  const current = (href: string) => (href.replace(/\/$/, "") || "/") === path;

  return (
    <nav className="site-nav" aria-label="Primary">
      <Link className="brand" to="/">
        {brand}
        <span className="dot">.</span>
      </Link>
      <div className="links">
        {links.map((l) => (
          <Link key={l.href} to={l.href} aria-current={current(l.href) ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
        {cta && (
          <Link className="bcms-btn bcms-btn-primary nav-cta" to={cta.href}>
            {cta.label}
          </Link>
        )}
      </div>
    </nav>
  );
}
