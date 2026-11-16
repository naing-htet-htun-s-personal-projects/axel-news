// Embedding generation using Google Gemini's free embedding API
// Uses model: text-embedding-004 (free tier)

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768;

type GeminiEmbeddingResponse = {
  embedding: {
    values: number[];
  };
};

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is required for embedding generation");
  }

  // Truncate text to avoid token limits
  const truncatedText = text.substring(0, 8000);

  const url = `${GEMINI_API_URL}/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: {
        parts: [{ text: truncatedText }],
      },
      outputDimensionality: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Embedding API error: ${response.status} - ${error}`);
  }

  const data: GeminiEmbeddingResponse = await response.json();

  if (!data.embedding || !data.embedding.values) {
    throw new Error("No embedding returned from API");
  }

  return data.embedding.values;
}

export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  // Gemini doesn't support batch embeddings in a single request
  // Process sequentially
  const results: number[][] = [];

  for (const text of texts) {
    const embedding = await generateEmbedding(text);
    results.push(embedding);
  }

  return results;
}

export { EMBEDDING_DIMENSIONS };
