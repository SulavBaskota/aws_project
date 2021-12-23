import AWS from "aws-sdk";

// Update AWS config
AWS.config.update({
  accessKeyId: process.env.DB_ACCESS_KEY_ID,
  secretAccessKey: process.env.DB_SECRET_ACCESS_KEY,
  sessionToken: process.env.DB_SESSION_TOKEN,
  region: "us-east-1",
});

// Create DynamoDB service object
const db = new AWS.DynamoDB({ apiVersion: "latest" });


export default db;