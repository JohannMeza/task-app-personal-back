import * as aws from '@pulumi/aws';
import { ECR } from '../config/contants';
import { provider } from '../config/aws';

export interface EcrRepositoies {
  auth: aws.ecr.Repository;
  task: aws.ecr.Repository;
  dashboard: aws.ecr.Repository;
}

function createRepository(name: string): aws.ecr.Repository {
  return new aws.ecr.Repository(
    name,
    {
      name,
      imageTagMutability: 'MUTABLE',
      imageScanningConfiguration: {
        scanOnPush: false,
      },
      forceDelete: true,
    },
    { provider },
  );
}

export function createRepostories(): EcrRepositoies {
  return {
    auth: createRepository(ECR.AUTH),
    task: createRepository(ECR.TASK),
    dashboard: createRepository(ECR.DASHBOARD),
  };
}
