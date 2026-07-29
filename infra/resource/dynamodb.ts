// import { Contants } from '@infra/contants';
import * as aws from '@pulumi/aws';

export const createConfigurationTable = () => {
  const name = 'task-app-personal';
  const table = new aws.dynamodb.Table(name, {
    name: name,
    // attributes: Contants.attributes,
    // billingMode: Contants.billingMode,
    // hashKey: Contants.hashKey,
    // globalSecondary: '',
    billingMode: 'PAY_PER_REQUEST',
    hashKey: 'id',
    attributes: [
      {
        name: 'id',
        type: 'S',
      },
    ],
  });

  return table;
};
