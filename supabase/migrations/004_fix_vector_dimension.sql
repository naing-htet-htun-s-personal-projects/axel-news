-- Axel News: Fix vector dimension (1536 → 768)
-- Google Gemini text-embedding-004 uses 768 dimensions

-- Drop existing column and index
drop index if exists articles_embedding_idx;
alter table articles drop column if exists embedding;

-- Recreate with correct dimension
alter table articles add column embedding extensions.vector(768);

-- Recreate index
create index articles_embedding_idx on articles
  using ivfflat (embedding extensions.vector_cosine_ops)
  with (lists = 100);

-- Update function signatures to use 768 dimensions
create or replace function search_articles(
  query_embedding extensions.vector(768),
  match_count int default 10,
  match_threshold float default 0.5
)
returns table (
  id uuid,
  url text,
  title text,
  body text,
  source text,
  language text,
  published_at timestamptz,
  summary text,
  sentiment text,
  similarity float
)
language sql
stable
as $$
  select
    id,
    url,
    title,
    body,
    source,
    language,
    published_at,
    summary,
    sentiment,
    1 - (embedding operator(extensions.<=>) query_embedding) as similarity
  from articles
  where embedding is not null
    and 1 - (embedding operator(extensions.<=>) query_embedding) > match_threshold
  order by embedding operator(extensions.<=>) query_embedding
  limit match_count;
$$;
