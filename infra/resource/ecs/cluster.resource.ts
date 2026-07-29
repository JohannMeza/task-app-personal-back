import * as aws from '@pulumi/aws';
import { ECS } from '../config/contants';
import { provider } from '../config/aws';

export function createCluster(): aws.ecs.Cluster {
  return new aws.ecs.Cluster(
    ECS.CLUSTER,
    {
      name: ECS.CLUSTER,
      settings: [
        {
          name: 'containerInsights',
          value: 'enabled',
        },
      ],
    },
    {
      provider: provider,
    },
  );
}
