import { Module } from '@nestjs/common';
import { TaskServices } from '../domain/services/task.services';
import { TaskRepository } from '../infrastructure/repositories/task.repository';
import { TaskUseCase } from '../application/use-cases/task.use-case';
import { TaskController } from '../presentation/task.controllers';
import { ConfigModule } from '@nestjs/config';
import { CognitoRepository } from '../../auth-service/infrastructure/repositories/cognito.repository';
import { CognitoProvider } from '../../auth-service/infrastructure/provider/cognito.provider';
import vaultLoader from 'lib/common/config/vault.loader';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [vaultLoader],
      envFilePath: '.env',
    }),
  ],
  controllers: [TaskController],
  providers: [
    TaskServices,
    TaskRepository,
    TaskUseCase,
    CognitoRepository,
    CognitoProvider,
  ],
})
export class TaskServiceModule {}
