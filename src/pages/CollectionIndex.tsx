/**
 * The Blog and Case-studies indexes. One component: both are "list a collection as cards",
 * differing only in the model slug, the copy, and which field supplies the eyebrow —
 * so they are parameters, not two files.
 *
 * Each card declares its entry (`entryAttrs`) and each text part the field it shows as stored
 * (`entryField`), so the visual editor binds a card to ITS entry by id instead of guessing from
 * the rendered text. An entry without an id (an older snapshot) renders the same card, unbound.
 */
import { Link } from "react-router-dom";
import { entryAttrs, entryField } from "@bettercms-ai/react";
import { Layout } from "../components/Layout";
import { EntryImage } from "../components/EntryImage";
import { listEntries, type BlogPostFields, type CaseStudyFields } from "../lib/content";
import { brandName } from "../lib/seo";

type CardFields = BlogPostFields & CaseStudyFields;

export interface CollectionIndexProps {
  model: string;
  base: string;
  heading: string;
  intro: string;
  /** The field shown as the small line above the card title — a date for posts, the client for case studies. */
  eyebrow: "publishedDate" | "client";
  /** The field shown as the card body copy. */
  blurb: "excerpt" | "summary";
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
            {items.map((entry) => {
              const { slug, data } = entry;
              const eyebrow = data[props.eyebrow];
              const blurb = data[props.blurb];
              return (
                <article className="card" key={slug} {...entryAttrs(entry)}>
                  <Link to={`${props.base}/${slug}`}>
                    {data.coverImage?.url && (
                      <EntryImage
                        className="thumb"
                        image={data.coverImage}
                        sizes="(min-width: 1120px) 360px, (min-width: 640px) 50vw, 100vw"
                      />
                    )}
                    <div className="body">
                      {eyebrow && (
                        <span className="eyebrow" {...entryField(entry, props.eyebrow)}>
                          {eyebrow}
                        </span>
                      )}
                      <h3 {...entryField(entry, "title")}>{data.title}</h3>
                      {blurb && <p {...entryField(entry, props.blurb)}>{blurb}</p>}
                    </div>
                  </Link>
                </article>
              );
            })}
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
    eyebrow="publishedDate"
    blurb="excerpt"
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
    eyebrow="client"
    blurb="summary"
    description={(brand) => `Selected work from ${brand}.`}
    empty="No published case studies yet."
  />
);
