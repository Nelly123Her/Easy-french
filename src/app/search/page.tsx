import SearchClient from './SearchClient';

export const metadata = {
  title: 'Search — Easy French Lab',
  description: 'Search across French lessons, vocabulary, expressions, and grammar topics.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return <SearchClient initialQuery={q ?? ''} />;
}
