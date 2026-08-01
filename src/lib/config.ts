/**
 * The BetterCMS API origin, for the two things that talk to it at RUNTIME: form submissions
 * and `<BcmsBlocks>`'s form blocks. Everything else is resolved from the build snapshot, which
 * is why no API key appears anywhere in this repo.
 *
 * The Astro starter gets this from `bettercms:config` (its integration); a Vite app reads the
 * same env var directly. `envPrefix` in vite.config.ts is what makes PUBLIC_* visible here.
 */
export const API_URL: string =
  import.meta.env.PUBLIC_BCMS_API_URL || "https://api.bettercms.ai";

/** Absolute origin for canonical/og:url. Set by the deploy Action; unset locally, in which
 *  case those tags are omitted rather than emitted as relative URLs. */
export const SITE_URL: string | undefined = import.meta.env.PUBLIC_SITE_URL || undefined;
