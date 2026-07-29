import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { createConfigurationTable } from './resource/dynamodb';
import { clientId } from './resource/cognito';
import { createRepostories } from './resource/ecr/repositories.resource';
import { createExecutionRole } from './resource/iam/ecs-execution-role.resource';
import { attackExecutionPolicy } from './resource/iam/ecs.execution-policy.resource';
import { createLogGroup } from './resource/logs/cloudwatch.resource';
import { createCluster } from './resource/ecs/cluster.resource';
import { createService } from './resource/ecs/service.resource';
import { createTaskDefinition } from './resource/ecs/task-definition.resource';

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket('my-bucket');
const table = createConfigurationTable();
const repositories = createRepostories();
const executionRole = createExecutionRole();
attackExecutionPolicy(executionRole);
const authLogs = createLogGroup('auth-service');
const dashboardLogs = createLogGroup('dashboard-service');
const taskLogs = createLogGroup('task-service');
const cluster = createCluster();
const authTaskDefinition = createTaskDefinition({
  serviceName: 'auth-service',
  image: pulumi.interpolate`${repositories.auth.repositoryUrl}:latest`,
  executionRoleArn: executionRole.arn,
  logGroupName: authLogs.name,

  containerPort: 3000,
  cpu: '256',
  memory: '512',
  environment: {
    NODE_ENV: 'development',
    AWS_REGION: 'us-east-1',
    port: '3000',
    COGNITO_CLIENT_ID: clientId,
    COGNITO_REGION: 'us-east-1',
    AWS_ENDPOINT: 'http://localhost.localstack.cloud:4566',
    AWS_ACCESS_KEY_ID: 'test',
    AWS_SECRET_ACCESS_KEY: 'test',
  },
});
const authService = createService({
  serviceName: 'auth-service',
  clusterArn: cluster.arn,
  taskDefinitionArn: authTaskDefinition.arn,
  desiredCount: 1,
});

const taskTaskDefinition = createTaskDefinition({
  serviceName: 'task-service',
  image: pulumi.interpolate`${repositories.task.repositoryUrl}:latest`,
  executionRoleArn: executionRole.arn,
  logGroupName: taskLogs.name,
  containerPort: 3001,
  cpu: '256',
  memory: '512',
  environment: {
    NODE_ENV: 'development',
    AWS_REGION: 'us-east-1',
    port: '3001',
    COGNITO_CLIENT_ID: clientId,
    COGNITO_REGION: 'us-east-1',
    AWS_ENDPOINT: 'http://localhost.localstack.cloud:4566',
    AWS_ACCESS_KEY_ID: 'test',
    AWS_SECRET_ACCESS_KEY: 'test',
  },
});
const taskService = createService({
  serviceName: 'task-service',
  clusterArn: cluster.arn,
  taskDefinitionArn: taskTaskDefinition.arn,
  desiredCount: 1,
});

// Export the name of the bucket

export const bucketName = bucket.id;
export const tableName = table.name;
export const authRepository = repositories.auth.repositoryUrl;
export const taskRepository = repositories.task.repositoryUrl;
export const dashboardRepository = repositories.dashboard.repositoryUrl;
export const executionRoleArn = executionRole.arn;
export const authLogGroup = authLogs.name;
export const taskLogGroup = taskLogs.name;
export const dahsboardLogGroup = dashboardLogs.name;
export const clusterName = cluster.name;
export const clusterArn = cluster.arn;
export const authTaskDefinitionArn = authTaskDefinition.arn;
export const authServiceArn = authService.arn;
export const taskTaskDefinitionArn = taskTaskDefinition.arn;
export const taskServiceArn = taskService.arn;
