import * as aws from '@pulumi/aws';
import { provider } from '../config/aws';

export function createLogGroup(serviceName: string): aws.cloudwatch.LogGroup {
  return new aws.cloudwatch.LogGroup(
    `${serviceName}-logs`,
    {
      name: `/ecs/${serviceName}`,
      retentionInDays: 7,
    },
    {
      provider: provider,
    },
  );
}
