import { Module } from '@nestjs/common';
import { AuthController } from '../presentation/auth.controller';
import { CognitoRepository } from '../infrastructure/repositories/cognito.repository';
import { ConfigModule } from '@nestjs/config';
import { CognitoProvider } from '../infrastructure/provider/cognito.provider';
import vaultLoader from 'lib/common/config/vault.loader';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [vaultLoader],
      envFilePath: '.env',
    }),
  ],
  controllers: [AuthController],
  providers: [CognitoRepository, CognitoProvider],
})
export class AuthServiceModule {}
