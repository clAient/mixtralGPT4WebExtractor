import { PromptTemplate } from "langchain/prompts";
import getResponsefromTogetherAI from "./requestFromToghetherAI.js";
import getResponsefromOpenAI from "./requestFromOpenAI.js";

const prompt = PromptTemplate.fromTemplate(
    ` Hi my name is {name} json`,
  );

  const langchainParams = {
    name: "behnam"
  };

  // console.log("The SCHEMA: " + JSON.stringify(schema3[0]));

  const formattedPrompt = await prompt.format(langchainParams);

  console.log("formatted propmt: "+formattedPrompt);

  const response = await getResponsefromTogetherAI(formattedPrompt);

  console.log("TogetherAI response: "+ JSON.stringify(response));

  const responseFromOpenAI = await getResponsefromOpenAI(formattedPrompt);

  console.log("OpenAI response: "+ responseFromOpenAI);