import * as aws from '@pulumi/aws';
import { provider } from '../config/aws';

export function attackExecutionPolicy(role: aws.iam.Role) {
  return new aws.iam.RolePolicyAttachment(
    'ecs-execution-policy',
    {
      role: role.name,
      policyArn:
        'arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
    },
    {
      provider: provider,
    },
  );
}
