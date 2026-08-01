/**
 * A marketing route: whatever the CMS page holds, rendered as blocks.
 *
 * Home, About and Contact are the same component with a different slug — the page's block tree
 * IS the page, so three near-identical files would only differ in a string. Contact's form
 * comes out of <BcmsBlocks> too: a `form` block resolves its formId against the snapshot's
 * forms and renders inline exactly where it was dropped in the page builder.
 */
import { BcmsBlocks } from "@bettercms-ai/next/blocks";
import { Layout } from "../components/Layout";
import { getPage, getForms } from "../lib/content";
import { API_URL } from "../lib/config";
import { brandName } from "../lib/seo";

export function CmsPage({ slug, fallbackTitle }: { slug: string; fallbackTitle?: string }) {
  const page = getPage(slug);
  const { items: forms, turnstileSiteKey } = getForms();

  return (
    <Layout
      title={page?.title ?? fallbackTitle ?? brandName()}
      metaTitle={page?.metaTitle}
      description={page?.metaDescription}
    >
      <main id="main" className="page-body">
        {page?.blocks?.length ? (
          <BcmsBlocks
            blocks={page.blocks}
            forms={forms}
            turnstileSiteKey={turnstileSiteKey}
            apiBase={API_URL}
          />
        ) : (
          <div>
            <p className="empty-note">
              This page has no published content yet — add blocks to it in BetterCMS and publish.
            </p>
          </div>
        )}
      </main>
    </Layout>
  );
}
