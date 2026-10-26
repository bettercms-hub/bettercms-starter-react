/**
 * The root route: every page renders inside it, so the editor session outlives a client-side
 * navigation instead of restarting with each route's <Layout>.
 *
 * <BcmsProvider> is mounted for the visual editor, NOT for data. Pages keep rendering from the
 * build snapshot (`virtual:bcms-content`), so the prerendered HTML is the content and nothing is
 * fetched at runtime; none of the adapter's hooks (`usePage`, `useEntries`…) is called. What the
 * provider adds, all of it in the browser after hydration (its render is just a context, so the
 * prerender is byte-for-byte what it was):
 *   - the answer to the editor canvas's re-render request, so the frame is not reloaded;
 *   - draft mode from the editor's "Preview on site" link: `<html data-bcms-draft="1">` and the
 *     click-to-edit overlay;
 *   - `<meta name="generator" content="BetterCMS">` when the document lacks it (index.html
 *     already carries it statically, so the prerendered files have it too).
 *
 * The provider needs an API origin and a workspace to build its client and throws without them,
 * which would fail the prerender. A build without PUBLIC_BCMS_WORKSPACE (a local build with no
 * .env) renders the same pages with no provider; on BetterCMS hosting it is always set.
 */
import { Outlet } from "react-router-dom";
import { BcmsProvider } from "@bettercms-ai/react";
import { API_URL, PROJECT_ID, WORKSPACE } from "../lib/config";

export function Root() {
  if (!WORKSPACE) return <Outlet />;
  return (
    <BcmsProvider env={import.meta.env} apiUrl={API_URL} workspace={WORKSPACE} projectId={PROJECT_ID}>
      <Outlet />
    </BcmsProvider>
  );
}
