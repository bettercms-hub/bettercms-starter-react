/** BetterCMS hosting serves /404.html for unmatched paths on a static build. */
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { brandName } from "../lib/seo";

export function NotFound() {
  return (
    <Layout title={`Page not found — ${brandName()}`} description="That page doesn’t exist.">
      <main id="main" className="notfound">
        <h1>Page not found</h1>
        <p>That link is broken, or the page has moved.</p>
        <Link className="bcms-btn bcms-btn-primary" to="/">
          Back to home
        </Link>
      </main>
    </Layout>
  );
}
