import getResponsefromTogetherAI from "./requestFromToghetherAI.js";
import { dataRetriever } from "./schemaRetriever.js";

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const extractAnswerObject = async (text: string) => {
  const lines = text.split("\n");
  const answerObjects = [];

  for await (const line of lines) {
    if (line.startsWith("Response:")) {
      let jsonString = line.substring("Response: ".length).trim();

      // Check if the JSON string ends with '}'
      if (!jsonString.endsWith("}")) {
        jsonString += '"}';
      }
      try {
        const responseObject = JSON.parse(jsonString);
        if (responseObject.hasOwnProperty("Answer")) {
          answerObjects.push(responseObject);
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }

  return answerObjects;
};

export async function matchEmbeddingsWithSchema(schema: any) {
  const prompt = `Match the embedding below with the schema element below it and only return whatever is related
    in the embedding data to the schema element. Return a JSON object with one key "Answer" and the value of the key
    should be whatever data related to the Schema Element. If you found no relevant data to that Schema Element the 
    value of the "Answer" key should be 'null'. Do not include the schema Element or the Embedding Data in the 
    response. Only include the JSON mentioned with no other text so I can directly parse the response to JSON.
    Below is an example response:
    { "Answer": "null"},
    { "Answer": "related data"}
    `;
  const newSchema: any = [];
  let nullCount = 0;
  let step = 0;
  try {
    for await (const item of schema) {
      const schemaContext = JSON.stringify(item);
      console.log(`item: ${schemaContext}`);
      const embeddings = await dataRetriever(schemaContext);
      let llmAnswers: string = "";
      let relatedAnswers: string[] = [];

      for await (const data of embeddings.data) {
        const content = data.content;
        const formattedPrompt = `${prompt}\nEmbeddings Data: ${content}\n\nSchema Element: ${schemaContext}`;
        await delay(1000); // 1-second delay
        const llmResponse = await getResponsefromTogetherAI(formattedPrompt);
        console.log(
          `formattedPrompt: ${formattedPrompt}\n###################################`
        );
        console.log(
          `llmResponse: ${llmResponse}\n*************************************`
        );
        llmAnswers += llmResponse;
      }
      const relatedContent = await extractAnswerObject(llmAnswers);
      relatedContent.forEach((answer) => {
        if (answer.Answer !== "null") {
          relatedAnswers.push(answer.Answer);
        }
      });
      step++;
      console.log(`step ${step} of ${schema.length}`);
      const firstKeyName = Object.keys(item)[0];
      const schemaElement = { [firstKeyName]: relatedAnswers.join("\n") };
      newSchema.push(schemaElement);
      console.log(schemaElement);
    }
    newSchema.push({ ["nullCount"]: nullCount });
    console.log(JSON.stringify(newSchema, null, 2));
  } catch (error: any) {
    console.error(error.stack);
  }
} /*  else {
      // If only one property, just log the key and value
      const key = keys[0];
      const schemaContext = `${key}: ${item[key as keyof typeof item]}`;
      const embeddings = await dataRetriever(schemaContext);
      embeddings.data.forEach(async (data: any) => {
        const content = data.content;
        const formattedPrompt = `${prompt}\nEmbeddings Data: ${content}\n\nSchema Element: ${schemaContext}`;

        await delay(2000);
        const llmResponse = await getResponsefromTogetherAI(formattedPrompt);
        console.log(llmResponse);
      });
    }
  }); */
