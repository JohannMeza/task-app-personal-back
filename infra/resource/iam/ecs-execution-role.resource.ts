import * as aws from '@pulumi/aws';
import { provider } from '../config/aws';

export function createExecutionRole(): aws.iam.Role {
  return new aws.iam.Role(
    'ecs-execution-role',
    {
      name: 'ecs-exection-role',
      assumeRolePolicy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              Service: 'ecs-tasks.amazonaws.com',
            },
            Action: 'sts:AssumeRole',
          },
        ],
      }),
    },
    { provider },
  );
}
