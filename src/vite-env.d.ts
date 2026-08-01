/// <reference types="vite/client" />

/** The build snapshot, injected by the `bcms-content` plugin in vite.config.ts.
 *  `unknown` on purpose — src/lib/content.ts is the one place that gives it a shape. */
declare module "virtual:bcms-content" {
  const snapshot: unknown;
  export default snapshot;
}
