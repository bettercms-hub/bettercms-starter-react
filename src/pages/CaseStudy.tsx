/** One case study. Same shape as BlogPost — see its note on why every field is tagged. */
import { Link, useParams } from "react-router-dom";
import { Layout } from "../components/Layout";
import { BcmsField } from "../components/BcmsField";
import { listEntries, getEntry, type CaseStudyFields } from "../lib/content";
import { caseStudySchema } from "../lib/seo";

export const getStaticPaths = () =>
  listEntries<CaseStudyFields>("case-study").map((e) => `/case-studies/${e.slug}`);

export function CaseStudy() {
  const { slug } = useParams();
  const cs = getEntry<CaseStudyFields>("case-study", slug!);
  // See BlogPost — a miss is a corrupt snapshot, not a visitor's bad URL.
  if (!cs) throw new Error(`case study not found: ${slug}`);

  const f = cs.data;

  return (
    <Layout title={f.title} description={f.summary} schema={caseStudySchema(f)}>
      <main id="main">
        <article className="article">
          <Link className="back-link" to="/case-studies">
            ← Back to case studies
          </Link>
          <BcmsField path="title">
            <h1>{f.title}</h1>
          </BcmsField>
          {f.client && (
            <BcmsField path="client">
              <p className="byline">{f.client}</p>
            </BcmsField>
          )}
          {f.coverImage?.url && (
            <img
              className="cover"
              src={f.coverImage.url}
              alt={f.coverImage.alt ?? ""}
              data-bcms-field="coverImage"
              data-bcms-kind="image"
            />
          )}
          {f.summary && (
            <BcmsField path="summary">
              <p className="prose summary">{f.summary}</p>
            </BcmsField>
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
