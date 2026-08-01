/**
 * The route table, and — via `getStaticPaths` on the two dynamic routes — the list of pages
 * that get prerendered to their own HTML file.
 *
 * Prerendering is not optional here. Four things on the BetterCMS side read the DEPLOYED HTML
 * per route: the publish-time static annotation, the sitemap, llms.txt, and AEO. An SPA hands
 * all four a single empty document, so the site would build and serve but be invisible to
 * search and un-annotatable by the editor. `vite-react-ssg` renders each entry below to its own
 * index.html and hydrates it in the browser.
 */
import type { RouteRecord } from "vite-react-ssg";
import { CmsPage } from "./pages/CmsPage";
import { BlogIndex, CaseStudyIndex } from "./pages/CollectionIndex";
import { BlogPost, getStaticPaths as blogPaths } from "./pages/BlogPost";
import { CaseStudy, getStaticPaths as casePaths } from "./pages/CaseStudy";
import { NotFound } from "./pages/NotFound";
import { brandName } from "./lib/seo";

export const routes: RouteRecord[] = [
  { path: "/", element: <CmsPage slug="home" />, entry: "src/pages/CmsPage.tsx" },
  { path: "/about", element: <CmsPage slug="about" fallbackTitle={`About — ${brandName()}`} /> },
  { path: "/contact", element: <CmsPage slug="contact" fallbackTitle={`Contact — ${brandName()}`} /> },
  { path: "/blog", element: <BlogIndex /> },
  { path: "/blog/:slug", element: <BlogPost />, getStaticPaths: blogPaths },
  { path: "/case-studies", element: <CaseStudyIndex /> },
  { path: "/case-studies/:slug", element: <CaseStudy />, getStaticPaths: casePaths },
  // A REAL /404 route, so the build emits dist/404.html — the file BetterCMS hosting (and
  // nginx's error_page) serves for an unmatched path. A catch-all `*` alone would not: only
  // concrete paths are prerendered, so the 404 page would exist client-side and nowhere on disk.
  { path: "/404", element: <NotFound /> },
  // …and the catch-all as well, for a bad link followed inside an already-loaded session.
  { path: "*", element: <NotFound /> },
];
