const { Configuration, OpenAIApi } = require("openai");
const { generateMarkdown } = require('../utils/markdown-generation.js');

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_DEMO_KEY
});

const openai = new OpenAIApi(configuration);

async function chatGeneratorScript(
  prompt='Explain this',
  context,
  ) {
  try {
    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt + ': ' + context }]
    });

    const pr_summary = res?.data?.choices[0]?.message?.content?.trim();

    let markdown = generateMarkdown(pr_summary);
    return markdown;

  } catch (err) {
    if (err?.response) {
      const { status = null, statusText = '' } = err.response;
      console.error(`${status} - ${statusText}`);
      return err?.response;
    } else {
      console.error(err);
      return err;
    }
  }
}

module.exports = {
    chatGeneratorScript
};