import * as dotenv from "dotenv";
import openaiTokenCounter from "openai-gpt-token-counter";
import { pipeline } from "@xenova/transformers";
import { createClient } from "@supabase/supabase-js";
dotenv.config();

interface Env {
  SUPABASE_API_KEY: string;
  SUPABASE_URL_LC_CHATBOT: string;
}

const env: Env = process.env as any as Env;
const sbApiKey = env.SUPABASE_API_KEY;
const sbUrl = env.SUPABASE_URL_LC_CHATBOT;
/* const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}); */
export const supabase = createClient(sbUrl, sbApiKey);

export const generateEmbedding = await pipeline(
  "feature-extraction",
  "Supabase/gte-small"
);

export async function dataEmbedder(
  data: string,
  tokenLimit: number,
  DBName: string
) {
  try {
    const model = "gpt-3.5-turbo";
    const dataArray: string[] = data.split(/\s+/);
    const separatedData: string[] = [];
    let currentChunk: string[] = [];

    for (const word of dataArray) {
      currentChunk.push(word);
      if (
        openaiTokenCounter.text(currentChunk.join(" "), model) >= tokenLimit
      ) {
        separatedData.push(currentChunk.join(" "));
        currentChunk = [];
      }
    }

    if (currentChunk.length > 0) {
      separatedData.push(currentChunk.join(" "));
    }

    console.log(`Data separated with every ${tokenLimit} tokens`);

    const embeddings = await Promise.all(
      separatedData.map(async (chunk: any) => {
        const output = await generateEmbedding(chunk, {
          pooling: "mean",
          normalize: true,
        });

        return {
          content: chunk,
          embedding: Array.from(output.data),
        };
      })
    );

    console.log(`Data embedded successfully`);

    const insertPromises = embeddings.map((element) =>
      supabase.from(DBName).insert({
        content: element.content,
        embedding: element.embedding,
      })
    );
    const results = await Promise.all(insertPromises);

    results.forEach((result) => {
      if (result.error) {
        console.error(result.error);
      }
    });

    console.log(`Data stored in ${DBName} database`);
  } catch (error: any) {
    console.error(error.message, error.stack);
  }
}
