/**
 * One blog post, hand-rendered from its entry fields.
 *
 * Every field carries a `data-bcms-field` (via <BcmsField>, or directly on the <img>) so the
 * visual editor can bind click-to-edit. That is the whole contract — the editor stamps its own
 * ids from these attributes after hydration, so a client-rendered React tree binds exactly like
 * the Astro starter's server-rendered one.
 */
import { Link, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { BcmsField } from "../components/BcmsField";
import { listEntries, getEntry, authorData, type BlogPostFields } from "../lib/content";
import { blogPostingSchema } from "../lib/seo";

/** Prerender one HTML file per post. Without this the route is an SPA shell, and sitemap,
 *  llms.txt and the publish-time static annotation all read one empty document. */
export const getStaticPaths = () =>
  listEntries<BlogPostFields>("blog-post").map((e) => `/blog/${e.slug}`);

export function BlogPost() {
  const { slug } = useParams();
  const post = getEntry<BlogPostFields>("blog-post", slug!);
  // getStaticPaths derives its list from this same snapshot, so a miss can only mean the
  // snapshot changed under the build. Fail the build rather than emit a blank page. A visitor's
  // bad URL never lands here — it never got built — and is served by the 404 route instead.
  if (!post) throw new Error(`blog post not found: ${slug}`);

  const f = post.data;
  const author = authorData(f.author);
  const byline = [
    author ? `By ${author.name}${author.role ? `, ${author.role}` : ""}` : null,
    f.publishedDate,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Layout title={f.title} description={f.excerpt} schema={blogPostingSchema(f)}>
      <main id="main">
        <article className="article">
          <Link className="back-link" to="/blog">
            ← Back to blog
          </Link>
          <BcmsField path="title">
            <h1>{f.title}</h1>
          </BcmsField>
          {byline && <p className="byline">{byline}</p>}
          {f.coverImage?.url && (
            <img
              className="cover"
              src={f.coverImage.url}
              alt={f.coverImage.alt ?? ""}
              data-bcms-field="coverImage"
              data-bcms-kind="image"
            />
          )}
          {f.body?.html && (
            <BcmsField path="body" kind="richtext">
              {/* eslint-disable-next-line react/no-danger -- richtext from the CMS, sanitized server-side. */}
              <div className="prose" dangerouslySetInnerHTML={{ __html: f.body.html }} />
            </BcmsField>
          )}
        </article>
      </main>
    </Layout>
  );
}
