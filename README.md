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

## Dependencies

| Package | What it does here |
|---------|-------------------|
| `@bettercms-ai/react` | The React adapter: `<BcmsBlocks>` (CMS pages, form blocks included), `<BcmsField>`, `<BcmsImage>`, `entryAttrs` / `entryField`, and `<BcmsProvider>` for the visual editor |
| `@bettercms-ai/sdk` | `resolveSeo` for the `<head>`, and the `DeliveryForm` type |
| `@bettercms-ai/types` | Content types (`ContentBlock`) |
| `vite-react-ssg` | Prerenders every route to static HTML and hydrates it |

The adapter also ships hooks (`usePage`, `useEntries`, …) that read the API at runtime. This
starter does not call them: it renders from the build snapshot below, so every route is complete
static HTML.

## Where content comes from

Everything renders from `bcms-content.json`, the build snapshot — no API key at build time, no
runtime fetch. It's gitignored, and reaches the app through the `virtual:bcms-content` plugin in
`vite.config.ts` (a plain JSON import would fail to resolve on a fresh clone). Regenerate it with
`npm run fetch-content` after editing content. On BetterCMS hosting the deploy Action writes it
before each build, then serves the static `dist/`.

The one thing that does talk to the API at runtime is form submission — see `src/lib/config.ts`.

## Visual editing

Every rendered value carries its binding, which is all the BetterCMS visual editor needs for
click-to-edit. All of it comes from `@bettercms-ai/react`:

- **CMS pages** — `<BcmsBlocks>` binds every block it renders.
- **A post or case study** — the adapter's `<BcmsField path="title">` puts `data-bcms-field` on
  the element it wraps, and `src/components/EntryImage.tsx` renders the cover with
  `<BcmsImage path="coverImage">` (BetterCMS media; any other URL is drawn as stored, with the same
  binding). Paths are relative to the entry the route renders.
- **The blog and case-study indexes** — each card spreads `entryAttrs(entry)` and each text part
  `entryField(entry, "title")`, so a card binds to its entry by id rather than by its text.

If you render a field's value, tag it — an untagged field falls back to fuzzy text matching.

`src/components/Root.tsx` wraps every route in `<BcmsProvider env={import.meta.env}>`. Not for
data (no hook reads through it): it answers the editor canvas's re-render request, turns on
draft mode from the editor's *Preview on site* link (`<html data-bcms-draft="1">` and the
click-to-edit overlay), and adds `<meta name="generator">` if the page lacks it (`index.html`
carries it statically). Its render is only a context, so the prerendered HTML is unchanged. It
needs `PUBLIC_BCMS_WORKSPACE` (and reads `PUBLIC_BCMS_API_URL`, and `PUBLIC_BCMS_PROJECT_ID` when
set); a build without a workspace renders the same pages with no provider.
