import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { provider } from '../config/aws';

export interface ServiceArgs {
  serviceName: string;
  clusterArn: pulumi.Input<string>;
  taskDefinitionArn: pulumi.Input<string>;
  desiredCount: number;
}

export function createService(args: ServiceArgs): aws.ecs.Service {
  return new aws.ecs.Service(
    `${args.serviceName}-service`,
    {
      name: args.serviceName,
      cluster: args.clusterArn,
      taskDefinition: args.taskDefinitionArn,
      desiredCount: args.desiredCount,
      launchType: 'EC2',
      deploymentMinimumHealthyPercent: 50,
      deploymentMaximumPercent: 200,
      enableExecuteCommand: true,
    },
    {
      provider,
    },
  );
}
