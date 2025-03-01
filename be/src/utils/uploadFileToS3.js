const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3Client } = require("@aws-sdk/client-s3");

// Set up AWS credentials
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});


const mime = require('mime-types');

exports.uploadFileToS3 = async (fileBuffer, fileName) => {
  const fileNameToLoad = `${fileName}`;
  
  // Determine the content type based on the file extension
  const contentType = mime.lookup(fileName) || "application/octet-stream";
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileNameToLoad,
    Body: fileBuffer,
    ContentType: contentType,
  };
  
  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileNameToLoad}`;

  return fileUrl;
};
