import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { provider } from '../config/aws';

export interface TaskDefinitionArgs {
  serviceName: string;
  image: pulumi.Input<string>;
  executionRoleArn: pulumi.Input<string>;
  logGroupName: pulumi.Input<string>;
  containerPort: number;
  cpu: string;
  memory: string;
  environment?: Record<string, pulumi.Input<string>>;
}

export function createTaskDefinition(
  args: TaskDefinitionArgs,
): aws.ecs.TaskDefinition {
  const containerDefinitions = pulumi
    .all([args.image, args.logGroupName, pulumi.output(args.environment ?? {})])
    .apply(([image, logGroupName, environment]) =>
      JSON.stringify([
        {
          name: args.serviceName,
          image,
          essential: true,
          portMappings: [
            {
              name: `${args.serviceName}-http`,
              containerPort: args.containerPort,
              hostPort: args.containerPort,
              protocol: 'tcp',
            },
          ],
          environment: Object.entries(environment).map(([name, value]) => ({
            name,
            value,
          })),
          logConfiguration: {
            logDriver: 'awslogs',
            options: {
              'awslogs-group': logGroupName,
              'awslogs-region': 'us-east-1',
              'awslogs-stream-prefix': args.serviceName,
            },
          },
        },
      ]),
    );

  return new aws.ecs.TaskDefinition(
    `${args.serviceName}-task`,
    {
      family: args.serviceName,
      networkMode: 'awsvpc',
      requiresCompatibilities: ['FARGATE'],
      cpu: args.cpu,
      memory: args.memory,
      executionRoleArn: args.executionRoleArn,
      containerDefinitions,
    },
    {
      provider: provider,
    },
  );
}
