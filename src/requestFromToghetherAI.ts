async function getResponsefromTogetherAI(formattedPrompt: string) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer 072702268c5f6c1b98249263432f51cdd10e0043013b0a16b24ff63002ebb6af'
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: formattedPrompt,
        max_tokens: 1000,
        temperature: 0.2,
        top_p: 0.5,
        top_k: 1,
        repetition_penalty: 1
      })
    };
  
    try {
      const response = await fetch('https://api.together.xyz/inference', options);
      const data = await response.json();
      return data.output.choices[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  export default getResponsefromTogetherAI;