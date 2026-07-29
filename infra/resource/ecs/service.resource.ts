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
  // Obtener la VPC por defecto de Localstack
  const defaultVpc = aws.ec2.getVpc({ default: true }, { provider });

  // Obtener las subredes por defecto en la VPC
  const defaultSubnets = defaultVpc.then((vpc) =>
    aws.ec2.getSubnets(
      {
        filters: [
          {
            name: 'vpc-id',
            values: [vpc.id],
          },
        ],
      },
      { provider },
    ),
  );

  // Obtener el grupo de seguridad por defecto
  const defaultSecurityGroup = defaultVpc.then((vpc) =>
    aws.ec2.getSecurityGroup(
      {
        filters: [
          {
            name: 'vpc-id',
            values: [vpc.id],
          },
          {
            name: 'group-name',
            values: ['default'],
          },
        ],
      },
      { provider },
    ),
  );

  return new aws.ecs.Service(
    `${args.serviceName}-service`,
    {
      name: args.serviceName,
      cluster: args.clusterArn,
      taskDefinition: args.taskDefinitionArn,
      desiredCount: args.desiredCount,
      launchType: 'FARGATE',
      deploymentMinimumHealthyPercent: 50,
      deploymentMaximumPercent: 200,
      enableExecuteCommand: true,
      networkConfiguration: {
        assignPublicIp: true,
        subnets: defaultSubnets.then((s) => s.ids),
        securityGroups: [defaultSecurityGroup.then((sg) => sg.id)],
      },
    },
    {
      provider,
    },
  );
}
