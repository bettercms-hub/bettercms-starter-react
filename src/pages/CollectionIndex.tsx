/**
 * The Blog and Case-studies indexes. One component: both are "list a collection as cards",
 * differing only in the model slug, the copy, and which field supplies the eyebrow —
 * so they are parameters, not two files.
 */
import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";
import { listEntries, type BlogPostFields, type CaseStudyFields } from "../lib/content";
import { brandName } from "../lib/seo";

type CardFields = BlogPostFields & CaseStudyFields;

export interface CollectionIndexProps {
  model: string;
  base: string;
  heading: string;
  intro: string;
  /** Small line above the card title — a date for posts, the client for case studies. */
  eyebrow: (f: CardFields) => string | undefined;
  /** Card body copy. */
  blurb: (f: CardFields) => string | undefined;
  description: (brand: string) => string;
  empty: string;
}

export function CollectionIndex(props: CollectionIndexProps) {
  const items = listEntries<CardFields>(props.model);
  const brand = brandName();

  return (
    <Layout title={`${props.heading} — ${brand}`} description={props.description(brand)}>
      <main id="main" className="container">
        <header className="page-head">
          <h1>{props.heading}</h1>
          <p>{props.intro}</p>
        </header>
        {items.length === 0 ? (
          <p className="empty-note">{props.empty}</p>
        ) : (
          <div className="card-grid">
            {items.map(({ slug, data }) => (
              <article className="card" key={slug}>
                <Link to={`${props.base}/${slug}`}>
                  {data.coverImage?.url && (
                    <img
                      className="thumb"
                      src={data.coverImage.url}
                      alt={data.coverImage.alt ?? ""}
                      loading="lazy"
                    />
                  )}
                  <div className="body">
                    {props.eyebrow(data) && <span className="eyebrow">{props.eyebrow(data)}</span>}
                    <h3>{data.title}</h3>
                    {props.blurb(data) && <p>{props.blurb(data)}</p>}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}

export const BlogIndex = () => (
  <CollectionIndex
    model="blog-post"
    base="/blog"
    heading="Blog"
    intro="Notes, updates, and what we’re thinking about."
    eyebrow={(f) => f.publishedDate}
    blurb={(f) => f.excerpt}
    description={(brand) => `Writing from the ${brand} team.`}
    empty="No published posts yet."
  />
);

export const CaseStudyIndex = () => (
  <CollectionIndex
    model="case-study"
    base="/case-studies"
    heading="Case studies"
    intro="A closer look at what we’ve shipped, and how."
    eyebrow={(f) => f.client}
    blurb={(f) => f.summary}
    description={(brand) => `Selected work from ${brand}.`}
    empty="No published case studies yet."
  />
);
