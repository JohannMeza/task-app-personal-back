import { UnauthorizedException } from '@aws-sdk/client-cognito-identity-provider';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthRequest } from '../interfaces/current-user.intreface';
import { CognitoRepository } from 'apps/auth-service/infrastructure/repositories/cognito.repository';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  constructor(private readonly cognitoRepository: CognitoRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException({
        message: 'Unathorizate',
        $metadata: { httpStatusCode: 401 },
      });
    }

    const token: string = authorization.replace('Bearer ', '') || '';

    const user = await this.cognitoRepository.validateAccessToken(token);

    request.user = user;

    return true;
  }
}
