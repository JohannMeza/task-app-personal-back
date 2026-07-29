import * as aws from '@pulumi/aws';

const userPool = new aws.cognito.UserPool('task-user-pool', {
  name: 'task-user-pool',
  autoVerifiedAttributes: ['email'],
  usernameAttributes: ['email'],
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
});

const userPoolClient = new aws.cognito.UserPoolClient('task-user-client', {
  userPoolId: userPool.id,
  explicitAuthFlows: [
    'ALLOW_USER_PASSWORD_AUTH',
    'ALLOW_REFRESH_TOKEN_AUTH',
    'ALLOW_USER_SRP_AUTH',
  ],
  generateSecret: false,
});

export const userPoolId = userPool.id;
export const clientId = userPoolClient.id;
