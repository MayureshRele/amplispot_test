import * as AWS from 'aws-sdk';
export const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECERT_KEY,
});
