import Head from '@docusaurus/Head';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { useBreadcrumbsStructuredData } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  TECH_ARTICLE_PATHS,
  buildTechArticleJsonLd,
  buildWebSiteJsonLd,
} from '@site/src/components/seoJsonLd';

function normalizePermalink(permalink) {
  if (!permalink || permalink === '/') {
    return '/';
  }
  return permalink.endsWith('/') ? permalink.slice(0, -1) : permalink;
}

/**
 * Single helmet ld+json script: WebSite (home) / TechArticle + BreadcrumbList.
 * Organization is emitted once via docusaurus.config.js headTags.
 */
export default function DocBreadcrumbsStructuredData({ breadcrumbs }) {
  const crumbList = useBreadcrumbsStructuredData({ breadcrumbs });
  const { metadata } = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const siteUrl = siteConfig.url.replace(/\/$/, '');
  const permalink = normalizePermalink(metadata.permalink);
  const isHome = permalink === '/';
  const description = metadata.description || siteConfig.tagline;
  const title = metadata.title;

  /** @type {Record<string, unknown>[]} */
  const graph = [];

  if (isHome) {
    const website = buildWebSiteJsonLd({
      siteUrl,
      permalink,
      title,
      description,
    });
    const { ['@context']: _c, ...rest } = website;
    graph.push(rest);
  }

  if (TECH_ARTICLE_PATHS.has(permalink)) {
    const article = buildTechArticleJsonLd({
      siteUrl,
      permalink,
      title,
      description,
      dateModified: metadata.lastUpdatedAt
        ? new Date(metadata.lastUpdatedAt).toISOString()
        : undefined,
    });
    const { ['@context']: _c, ...rest } = article;
    graph.push(rest);
  }

  const { ['@context']: _bc, ...breadcrumbRest } = crumbList;
  graph.push(breadcrumbRest);

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': graph,
        })}
      </script>
    </Head>
  );
}
