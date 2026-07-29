export const Contants = {
  attributes: '',
  billingMode: '',
  hashKey: '',
  globalSecondaryIndexes: '',
};

export const PROJECT = 'task-app-personal';

export const ENVIRONMENT = 'dev';

export const SERVICES = {
  AUTH: 'auth-service',
  TASK: 'task-service',
  DASHBOARD: 'dashboard-service',
};

export const ECR = {
  AUTH: 'auth-service',
  TASK: 'task-service',
  DASHBOARD: 'dashboard-service',
};

export const ECS = {
  CLUSTER: `${PROJECT}-${ENVIRONMENT}`,
};
