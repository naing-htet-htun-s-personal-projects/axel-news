-- Axel News: Vector Search
-- Requires pgvector extension (enable via Dashboard > Database > Extensions)

-- Enable pgvector extension
create extension if not exists vector with schema extensions;

-- Add embedding column to articles table
-- Using 768 dimensions for Google Gemini text-embedding-004
alter table articles add column if not exists embedding extensions.vector(768);

-- Create index for vector similarity search
create index if not exists articles_embedding_idx on articles
  using ivfflat (embedding extensions.vector_cosine_ops)
  with (lists = 100);

-- Function: Search articles by semantic similarity
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

-- Function: Get article embedding status
create or replace function get_embedding_status()
returns table (
  total_articles bigint,
  articles_with_embeddings bigint,
  percentage numeric
)
language sql
stable
as $$
  select
    count(*) as total_articles,
    count(embedding) as articles_with_embeddings,
    case
      when count(*) = 0 then 0
      else round(count(embedding)::numeric / count(*)::numeric * 100, 2)
    end as percentage
  from articles;
$$;

-- Grant execute permissions
grant execute on function search_articles to anon;
grant execute on function search_articles to authenticated;
grant execute on function get_embedding_status to anon;
grant execute on function get_embedding_status to authenticated;
