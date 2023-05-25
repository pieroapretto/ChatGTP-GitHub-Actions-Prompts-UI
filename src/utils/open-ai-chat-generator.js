import axios from 'axios';
import { generateMarkdownString } from './markdown-generation';

export async function chatGenerator(content_to_evaluate, prompt='Explain this') {
  const API_KEY = process.env.REACT_APP_DEMO_KEY;
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'user',
          content: `${prompt}: ${content_to_evaluate}`,
        }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const res = response?.data?.choices[0]?.message?.content?.trim();
    const markdown = generateMarkdownString(res);
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