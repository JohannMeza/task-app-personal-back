import * as aws from '@pulumi/aws';

export const provider = new aws.Provider('localstack', {
  region: 'us-east-1',

  accessKey: 'test',
  secretKey: 'test',

  skipCredentialsValidation: true,
  skipMetadataApiCheck: true,
  skipRequestingAccountId: true,

  endpoints: [
    {
      ec2: 'http://localhost:4566',
      ecr: 'http://localhost:4566',
      ecs: 'http://localhost:4566',
      iam: 'http://localhost:4566',
      logs: 'http://localhost:4566',
      s3: 'http://localhost:4566',
      dynamodb: 'http://localhost:4566',
      cognitoidp: 'http://localhost:4566',
    },
  ],
});
