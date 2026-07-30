import * as pulumi from '@pulumi/pulumi';

export default class Constants {
  private static configs: Record<string, pulumi.Config> = {};

  private static getConfig(namespace: string): pulumi.Config {
    if (!this.configs[namespace]) {
      this.configs[namespace] = new pulumi.Config(namespace);
    }
    return this.configs[namespace];
  }

  // Getters para secrets
  static get cognitoRegion(): string {
    return this.getConfig('secrets').require('cognitoRegion');
  }

  static get awsEndpoint(): string {
    return this.getConfig('secrets').require('awsEndpoint');
  }

  static get awsAccessKeyId(): string {
    return this.getConfig('secrets').require('awsAccessKeyId');
  }

  static get awsSecretAccessKey(): pulumi.Output<string> {
    return this.getConfig('secrets').requireSecret('awsSecretAccessKey');
  }

  static get vaultAddr(): string {
    return this.getConfig('secrets').require('vaultAddr');
  }

  // Getters para dynamodb
  static get dynamoTableName(): string {
    return this.getConfig('dynamodb').require('tableName');
  }
}
