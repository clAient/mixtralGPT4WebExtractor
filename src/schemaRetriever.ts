import { supabase, generateEmbedding } from "./dataSeparator.js";

export async function dataRetriever(schemaEl: string) {
  const output = await generateEmbedding(schemaEl, {
    pooling: "mean",
    normalize: true,
  });

  const context = await supabase.rpc("match_mixtral_data", {
    query_embedding: Array.from(output.data),
    match_threshold: 0.8,
  });

  return context;
}
