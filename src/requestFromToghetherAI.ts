async function getResponsefromTogetherAI(formattedPrompt: string) {
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization:
        "Bearer c10e3f7e6f0668881b067ca0ac36a60c0ace1aea8d90b9649c426b5a3c56215c",
    },
    body: JSON.stringify({
      model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
      prompt: formattedPrompt,
      max_tokens: 200,
      temperature: 0.2,
      top_p: 0.5,
      top_k: 1,
      repetition_penalty: 1,
    }),
  };

  try {
    const response = await fetch("https://api.together.xyz/inference", options);
    const data = await response.json();
    return data.output.choices[0].text;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default getResponsefromTogetherAI;
