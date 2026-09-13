import OriginalLastUpdated from '@theme-original/LastUpdated';

/**
 * Upstream shows a fake "Oct 14, 2018 (Simulated during dev…)" date in
 * development for perf. Hide that noise; keep real last-updated in production.
 */
export default function LastUpdated(props) {
  if (process.env.NODE_ENV === 'development') {
    return null;
  }
  return <OriginalLastUpdated {...props} />;
}
