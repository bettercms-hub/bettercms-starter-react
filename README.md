# BetterCMS Marketing Starter (React + TypeScript)

The **React + TypeScript** starter for the BetterCMS *Marketing Starter* template: a polished,
fully static marketing site rendered from a BetterCMS project. Vite 7, React 19, Tailwind v4.

- **Home / About / Contact** — CMS pages rendered from their block tree with `<BcmsBlocks>`.
  The Contact page carries a real **form block**, so submissions land in your project's inbox.
- **Blog** and **Case Studies** — content collections, listed and rendered as static pages.

Create a site from this template in the BetterCMS dashboard (pick *Marketing Starter* →
*React + TypeScript*) and it's deployed and wired automatically. Or run it locally below.

## The slug contract

This site reads these slugs from the CMS — they match the template's seeded content. Keep them in
sync if you rename models/pages (and mirror changes in `bettercms-starter` and
`bettercms-starter-astro`, the Next.js and Astro twins):

| Kind  | Slugs |
|-------|-------|
| Pages | `home`, `about`, `contact` |
| Models| `blog-post`, `case-study`, `author` |

## Run locally

```bash
cp .env.example .env            # set PUBLIC_BCMS_WORKSPACE + BCMS_API_KEY (content:read)
npm install
npm run fetch-content           # writes bcms-content.json (pages, forms, entries)
npm run dev                     # http://localhost:5173
```

## Prerendered, not an SPA

`npm run build` runs **`vite-react-ssg`**, which renders every route in `src/routes.tsx` to its
own `index.html` under `dist/` and hydrates it in the browser. That matters beyond page speed:
BetterCMS reads the deployed HTML per route for the publish-time static annotation, the sitemap,
`llms.txt`, and AEO. A plain SPA gives all four one empty document — the site would still serve,
but it would be invisible to search and un-annotatable by the editor.

Routes with dynamic segments (`/blog/:slug`, `/case-studies/:slug`) export a `getStaticPaths`
that lists their slugs from the content snapshot. A new post appears as a new HTML file on the
next build; publishing in the CMS triggers that build automatically.

## Where content comes from

Everything renders from `bcms-content.json`, the build snapshot — no API key at build time, no
runtime fetch. It's gitignored, and reaches the app through the `virtual:bcms-content` plugin in
`vite.config.ts` (a plain JSON import would fail to resolve on a fresh clone). Regenerate it with
`npm run fetch-content` after editing content. On BetterCMS hosting the deploy Action writes it
before each build, then serves the static `dist/`.

The one thing that does talk to the API at runtime is form submission — see `src/lib/config.ts`.

## Visual editing

Entry fields are tagged with `data-bcms-field` (via `src/components/BcmsField.tsx`, or directly
on an `<img>` for images), which is all the BetterCMS visual editor needs to bind click-to-edit.
It stamps its own ids from those attributes after hydration and re-stamps on repaint, so a
client-rendered React tree behaves exactly like the Astro starter's server-rendered one. If you
render a field's value, tag it — an untagged field falls back to fuzzy text matching.
