import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const CognitoProvider: Provider = {
  provide: CognitoIdentityProviderClient,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    return new CognitoIdentityProviderClient({
      region: config.get<string>('COGNITO_REGION'),
      endpoint: config.get<string>('AWS_ENDPOINT'),
      credentials: {
        accessKeyId: config.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: config.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  },
};
