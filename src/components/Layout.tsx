/** Shared page shell: <head> meta + skip link + nav + footer.
 *
 *  Marketing pages render their CMS block tree into `children`; blog/case routes render their
 *  own markup. Every route OWNS its own landmark (<main>) — the shell only supplies chrome.
 *
 *  Brand and chrome come from the `site` global, so they're editable in the CMS. Nothing here
 *  hard-codes a brand: a page that wants a title composes it from `brandName()`.
 *
 *  <head> goes through vite-react-ssg's <Head>, NOT React 19's own metadata hoisting. React 19
 *  hoists <title>/<meta> in the browser, but the SSG prerenders with renderToString, where the
 *  hoisted tags never reach the emitted document — a build looks fine locally and ships static
 *  HTML with no title, description or canonical, which defeats the reason for prerendering at
 *  all. <Head> collects them during the server render and writes them into the file. */
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Head } from "vite-react-ssg";
import { getSingleton, type Site } from "../lib/content";
import { seo } from "../lib/seo";
import { SITE_URL } from "../lib/config";
import { Nav } from "./Nav";
import { Footer } from "./Footer";

type Json = Record<string, unknown>;

export interface LayoutProps {
  /** The route's own title. Always wins over the site's SEO title. */
  title: string;
  metaTitle?: string | null;
  description?: string | null;
  /** Page-level JSON-LD; the site's Organization node is merged in automatically. */
  schema?: Json | Json[];
  children: ReactNode;
}

export function Layout({ title, metaTitle, description, schema, children }: LayoutProps) {
  const site = getSingleton<Site>("site");
  const meta = seo({ title, metaTitle, metaDescription: description, schema });
  const { pathname } = useLocation();

  /** Absolute URLs need a known origin. Unset (a local build) → omit canonical/og:url rather
   *  than emit a relative one. */
  const canonical = SITE_URL ? new URL(pathname, SITE_URL).href : meta.canonical;

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        {meta.description && <meta name="description" content={meta.description} />}
        {canonical && <link rel="canonical" href={canonical} />}

        <meta property="og:title" content={meta.og.title} />
        {meta.og.description && <meta property="og:description" content={meta.og.description} />}
        <meta property="og:type" content={meta.og.type} />
        {meta.og.image && <meta property="og:image" content={meta.og.image} />}
        {canonical && <meta property="og:url" content={canonical} />}
        {site?.brandName && <meta property="og:site_name" content={site.brandName} />}

        <meta name="twitter:card" content={meta.twitter.card} />
        <meta name="twitter:title" content={meta.twitter.title} />
        {meta.twitter.description && <meta name="twitter:description" content={meta.twitter.description} />}
        {meta.twitter.image && <meta name="twitter:image" content={meta.twitter.image} />}
        {meta.twitter.site && <meta name="twitter:site" content={meta.twitter.site} />}

        {/* Structured data, inline. NOT extracted into a <JsonLd> component: <Head> is
            react-helmet-async, which walks its children literally and throws on anything that
            isn't a head element. The 50 KB cap guards against a runaway CMS field ending up in
            every page's <head>. */}
        {meta.jsonLd
          .filter(Boolean)
          .map((node) => JSON.stringify(node))
          .filter((json) => json.length <= 50_000)
          .map((json) => (
            <script key={json} type="application/ld+json">
              {json}
            </script>
          ))}
      </Head>

      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Nav site={site} />
      {children}
      <Footer site={site} />
    </>
  );
}
