import * as pulumi from '@pulumi/pulumi';
import Constants from './constants';

export default class ConfigService {
  constructor(private readonly config: typeof Constants) {}

  /**
   * Construye el diccionario de variables de entorno para el contenedor.
   * @param port Puerto en el que debe escuchar el microservicio.
   */
  getContainerEnvironment(port: string): Record<string, pulumi.Input<string>> {
    return {
      NODE_ENV: process.env.NODE_ENV || 'dev',
      AWS_REGION: 'us-east-1',
      port: port,
      COGNITO_CLIENT_ID: this.config.cognitoClientId,
      COGNITO_REGION: this.config.cognitoRegion,
      AWS_ENDPOINT: this.config.awsEndpoint,
      AWS_ACCESS_KEY_ID: this.config.awsAccessKeyId,
      AWS_SECRET_ACCESS_KEY: this.config.awsSecretAccessKey,
      VAULT_ADDR: this.config.vaultAddr,
    };
  }
}
