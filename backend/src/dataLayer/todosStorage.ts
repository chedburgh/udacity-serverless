import * as AWS from 'aws-sdk';

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);

export class TodoStorage {
  constructor(
    private bucketName = process.env.TODOS_IMAGE_BUCKET,
    private urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' })
  ) {}

  getStorageUrl(todoId: string) {
    return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`;
  }

  getUploadUrl(todoId: string) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration,
    });
  }
}
