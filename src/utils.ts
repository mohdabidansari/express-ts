const fetch = require("node-fetch");

export async function makeRequest(prompt: string) {
  let runSettings = getRunSettings();

  if (!runSettings.apiKey) {
    throw "API Key is not set";
  }

  let formattedModel = runSettings.model;
  if (!formattedModel?.includes("models")) {
    formattedModel = "models/" + formattedModel;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/${formattedModel}:generateContent?key=${runSettings.apiKey}`;
  console.log({ url });
  let payload = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
    generationConfig: runSettings.runConfig.generationConfig,
    safetySettings: runSettings.runConfig.safetySettings,
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payload),
  };

  //   let responseStr = fetch(url, options);

  const response = await fetch(url, options);
  const data = await response.json();

  return data;
}

function getRunSettings() {
  const defaultConfig = {
    generationConfig: {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 100,
      stopSequences: [],
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };

  let runSettingsObj: { apiKey: string; runConfig: any; model: string } = {
    apiKey: process.env.GEMINI_API_KEY as string,
    runConfig: defaultConfig,
    model: "gemini-1.0-pro",
  };
  return runSettingsObj;
}
