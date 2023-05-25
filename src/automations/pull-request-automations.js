const axios = require('axios');
const fs = require("fs");
const util = require('util');
const PromptService = require('../services/prompt.service');
const { chatGeneratorScript } = require('./chat-generator-script');

// Sleep function to wait for a specified duration
const sleep = util.promisify(setTimeout);

const onDataChange = async (items) => {
  let prompts = [];

  if(items) {
    items.forEach((item) => {
      let key = item.key;
      let data = item.val();

      if(data?.active && data?.platform === 'prompt-ui' && data?.title) {
        prompts.push({
          key: key,
          input: data.title
        });
      }
    });

    return prompts;
  }
};

const postComment = async (input, token, owner, repo, pr_number, pr_diff) => {
  let comment_payload = null;

  try {
    comment_payload = await chatGeneratorScript(input, pr_diff);
  } catch (error) {
    console.error(`An error occurred with ${input} prompt`, error);
    return;
  }

  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.github.com/repos/${owner}/${repo}/issues/${pr_number}/comments`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      },
      data: {
        body: comment_payload
      },
    });

    console.log(`Github comment posted successfully: ${response.data.html_url}`);
  } catch (error) {
    console.error(`Failed to post Github comment: ${error.message}`);
    return error;
  }
}

const main = async () => {
  // Read the content of the pr_diff.txt file
  const pr_diff = fs.readFileSync("pr_diff.txt", "utf8");

  // Set your variables
  const token = process.env.GITHUB_TOKEN;
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const pr_number = process.env.PR_NUMBER;
  const prompts = await PromptService.getAll().on("value", onDataChange);

  prompts.forEach(async ({ input }) => {
    // Post the comment to the PR
    await postComment(input, token, owner, repo, pr_number, pr_diff);

    // Wait for a specified duration (e.g., 0.5 seconds)
    await sleep(500);
  });
  
};

main().catch((err) => new Error(err));