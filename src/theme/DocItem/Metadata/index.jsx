import Head from '@docusaurus/Head';
import { PageMetadata } from '@docusaurus/theme-common';
import { useDoc } from '@docusaurus/plugin-content-docs/client';

function normalizePermalink(permalink) {
  if (!permalink || permalink === '/') {
    return '/';
  }
  return permalink.endsWith('/') ? permalink.slice(0, -1) : permalink;
}

/**
 * Page metadata + per-route og:type.
 * JSON-LD lives in DocBreadcrumbs/StructuredData (single ld+json script).
 */
export default function DocItemMetadata() {
  const { metadata, frontMatter, assets } = useDoc();
  const isHome = normalizePermalink(metadata.permalink) === '/';

  return (
    <>
      <PageMetadata
        title={metadata.title}
        description={metadata.description}
        keywords={frontMatter.keywords}
        image={assets.image ?? frontMatter.image}
      />
      <Head>
        <meta property="og:type" content={isHome ? 'website' : 'article'} />
      </Head>
    </>
  );
}
