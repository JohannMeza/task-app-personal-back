import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandOutput,
  GetUserCommand,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
  SignUpCommand,
  SignUpCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from 'apps/auth-service/application/dto/register.dto';
import { SignInDto } from '../../application/dto/signin.dto';
import { ConfirmDto } from 'apps/auth-service/application/dto/confirm.dto';
import { AuthUser } from 'lib/common/interfaces/current-user.intreface';

@Injectable()
export class CognitoRepository {
  constructor(
    private readonly cognitoClient: CognitoIdentityProviderClient,
    private readonly configService: ConfigService,
  ) {}

  async register(data: RegisterDto): Promise<SignUpCommandOutput> {
    const command = new SignUpCommand({
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      Username: data.email,
      Password: data.password,
      UserAttributes: [
        {
          Name: 'email',
          Value: data.email,
        },
        {
          Name: 'name',
          Value: data.name,
        },
      ],
    });

    return await this.cognitoClient.send(command);
  }

  async signin(data: SignInDto): Promise<InitiateAuthCommandOutput> {
    const command = new InitiateAuthCommand({
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      AuthFlow: 'USER_PASSWORD_AUTH',
      AuthParameters: {
        USERNAME: data.email,
        PASSWORD: data.password,
      },
    });

    return await this.cognitoClient.send(command);
  }

  async confirmRegistration(
    data: ConfirmDto,
  ): Promise<ConfirmSignUpCommandOutput> {
    const command = new ConfirmSignUpCommand({
      ClientId: this.configService.get<string>('COGNITO_CLIENT_ID'),
      Username: data.username,
      ConfirmationCode: data.code,
    });

    return await this.cognitoClient.send(command);
  }

  async validateAccessToken(accessToken: string): Promise<AuthUser> {
    const token = accessToken.replace('Bearer ', '');

    const command = new GetUserCommand({
      AccessToken: token,
    });

    const data = await this.cognitoClient.send(command);

    // const nameAttr = data.UserAttributes?.find((attr) => attr.Name === 'name');
    const emailAttr = data.UserAttributes?.find(
      (attr) => attr.Name === 'email',
    );
    const subAttr = data.UserAttributes?.find((attr) => attr.Name === 'sub');

    const user: AuthUser = {
      sub: subAttr?.Value || data.Username || 'unknown-id',
      email: emailAttr?.Value || 'unknown-email',
      username: data.Username || 'unknown-username',
    };

    return user;
  }
}
