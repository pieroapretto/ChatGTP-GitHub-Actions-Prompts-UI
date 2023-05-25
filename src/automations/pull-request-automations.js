const axios = require('axios');
const fs = require("fs");
const util = require('util');
const admin = require('firebase-admin');
const { chatGeneratorScript } = require('./chat-generator-script');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
});

// Sleep function to wait for a specified duration
const sleep = util.promisify(setTimeout);
 
const onDataChange = async (snapshot) => {
  const prompts = [];

  snapshot.forEach((childSnapshot) => {
    const key = childSnapshot.key;
    const data = childSnapshot.val();

    if (data?.active && data?.platform === 'prompt-ui' && data?.title) {
      console.info('Evaluting' + '\nPrompt: ' + data.title);

      prompts.push({
        key: key,
        input: data.title
      });
    }
  });

  return prompts;
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
};

const main = async () => {
  // Read the content of the pr_diff.txt file
  const pr_diff = fs.readFileSync("pr_diff.txt", "utf8");

  // Set your variables
  const token = process.env.GITHUB_TOKEN;
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const pr_number = process.env.PR_NUMBER;

  try {
    const database = admin.database();
    const ref = database.ref('/prompts');
    const snapshot = await ref.once('value');
    const prompts = await onDataChange(snapshot);

    for (const { input } of prompts) {
      // Post the comment to the PR
      await postComment(input, token, owner, repo, pr_number, pr_diff);

      // Wait for a specified duration (e.g., 0.5 seconds)
      await sleep(500);
    }
  } catch (error) {
    console.error('Failed to fetch prompts from the database:', error);
  }
};

main().catch((err) => {
  console.error('An unhandled error occurred:', err);
});