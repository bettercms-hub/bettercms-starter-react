/**
 * The BetterCMS API origin, for the things that talk to it at RUNTIME: form submissions,
 * `<BcmsBlocks>`'s form blocks, and `<BcmsProvider>` (the visual editor's session; see
 * src/components/Root.tsx). Content is resolved from the build snapshot, which is why no API
 * key appears anywhere in this repo.
 *
 * The Astro starter gets this from `bettercms:config` (its integration); a Vite app reads the
 * same env var directly. `envPrefix` in vite.config.ts is what makes PUBLIC_* visible here.
 */
export const API_URL: string =
  import.meta.env.PUBLIC_BCMS_API_URL || "https://api.bettercms.ai";

/** Absolute origin for canonical/og:url. Set by the deploy Action; unset locally, in which
 *  case those tags are omitted rather than emitted as relative URLs. */
export const SITE_URL: string | undefined = import.meta.env.PUBLIC_SITE_URL || undefined;

/** The workspace (and project) the editor session belongs to. Read by <BcmsProvider> only;
 *  unset (a local build without .env) → the provider is not mounted. */
export const WORKSPACE: string | undefined = import.meta.env.PUBLIC_BCMS_WORKSPACE || undefined;
export const PROJECT_ID: string | undefined = import.meta.env.PUBLIC_BCMS_PROJECT_ID || undefined;
