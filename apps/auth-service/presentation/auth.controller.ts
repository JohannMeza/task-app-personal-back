import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { CognitoRepository } from '../infrastructure/repositories/cognito.repository';
import { RegisterDto } from '../application/dto/register.dto';
import { SignInDto } from '../application/dto/signin.dto';
import { ConfirmDto } from '../application/dto/confirm.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly cognitoRepository: CognitoRepository) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.cognitoRepository.register(dto);

    return {
      message: 'Usuario registrado correctamente.',
      userConfirmed: result.UserConfirmed,
      userSub: result.UserSub,
    };
  }

  @Post('login')
  async login(@Body() dto: SignInDto) {
    const result = await this.cognitoRepository.signin(dto);

    return {
      message: 'Usuario autenticado exitosamente.',
      accessToken: result.AuthenticationResult?.AccessToken,
      refreshToken: result.AuthenticationResult?.RefreshToken,
      idToken: result.AuthenticationResult?.IdToken,
      expiresIn: result.AuthenticationResult?.ExpiresIn,
    };
  }

  @Post('confirm')
  async confirmRegistration(@Body() dto: ConfirmDto) {
    await this.cognitoRepository.confirmRegistration(dto);

    return {
      message: 'Usuario confirmado correctamente',
    };
  }

  @Get('access')
  async access(@Headers('authorization') authToken: string) {
    const result = await this.cognitoRepository.validateAccessToken(authToken);
    return result;
  }
}
