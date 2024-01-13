import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();


const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;
console.log("OPEN_AI_API_KEY: "+OPEN_AI_API_KEY);

async function getResponsefromOpenAI(formattedPrompt:string){
  const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: formattedPrompt
      }
    ],

    model: "gpt-4-1106-preview",
    response_format: { type: "json_object" },
    seed: 100,
    temperature: 0.2
  });

  const result = completion.choices[0].message.content;
  if (result) {
    return result;
  } else {
    throw new Error(
      "Invalid result or empty data from extractInfo"
    );
  }
}

export default getResponsefromOpenAI;
