import * as AWS from 'aws-sdk';
const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
export const s3 = new AWS.S3(config);
