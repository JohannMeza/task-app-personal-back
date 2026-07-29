import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const dynamoClient: DynamoDBClient = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost.localstack.cloud:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

export const dynamoDb = DynamoDBDocumentClient.from(dynamoClient);
