/** Ft7 footer — newsletter-first.
 *
 *  Leads with the one thing the footer is actually for, and keeps the index as a single quiet
 *  row — which also stops Contact appearing a third time on every page. */
import { Link } from "react-router-dom";
import { getForms, items, type Site } from "../lib/content";
import { brandName } from "../lib/seo";
import { NewsletterForm } from "./NewsletterForm";

export function Footer({ site }: { site?: Site }) {
  const brand = brandName();
  const tagline = site?.footerTagline ?? "A marketing starter powered by BetterCMS.";
  const socials = items(site?.socials);
  const nav = items(site?.navLinks);

  /** The seeded Newsletter form. Absent (or renamed) → the footer just drops the block. */
  const newsletter = getForms().items.find((f) => /newsletter/i.test(f.name ?? ""));

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-say">
          <h2>{tagline}</h2>
        </div>
        {newsletter ? (
          <NewsletterForm form={newsletter} />
        ) : (
          <p className="newsletter-note">Add a Newsletter form in the CMS and it appears here.</p>
        )}
      </div>
      <div className="site-footer-meta">
        <Link className="brand" to="/">
          {brand}
          <span className="dot">.</span>
        </Link>
        <nav aria-label="Footer">
          {nav.map((l) => (
            <Link key={l.href} to={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        {socials.length > 0 && (
          <div className="site-footer-socials">
            {socials.map((s) => (
              <a key={s.href} href={s.href} target="_blank" rel="noreferrer noopener">
                {s.label}
              </a>
            ))}
          </div>
        )}
        <p className="site-footer-copy">
          © {new Date().getFullYear()} {brand}
        </p>
      </div>
    </footer>
  );
}
