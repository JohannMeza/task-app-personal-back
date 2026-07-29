import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Put } from '@nestjs/common';
import { TaskUseCase } from '../application/use-cases/task.use-case';
import { TaskInterface } from '../domain/entities/task.interface';
import { CognitoAuthGuard } from 'lib/common/guards/cognito-auth.guard';
import { CurrentUser } from 'lib/common/decorators/current-user.decorator';
import { AuthUser } from 'lib/common/interfaces/current-user.intreface';

@Controller('task')
@UseGuards(CognitoAuthGuard)
export class TaskController {
  constructor(private readonly taskUseCase: TaskUseCase) {}

  @Get('list')
  listarTareas(@CurrentUser() user: AuthUser) {
    return this.taskUseCase.listarTarea(user);
  }

  @Get('find/:id')
  obtenerTarea(@Param('id') id: string) {
    return this.taskUseCase.obtenerTarea(id);
  }

  @Post('create')
  crearTarea(@Body() task: TaskInterface, @CurrentUser() user: AuthUser) {
    return this.taskUseCase.crearTarea(task, user);
  }

  @Delete(':id')
  eliminarTarea(@Param('id') id: string) {
    return this.taskUseCase.eliminarTarea(id);
  }

  @Put('update/:id')
  actualizarTarea(@Param('id') id: string, @Body() task: TaskInterface) {
    return this.taskUseCase.actualizarTarea(id, task);
  }
}
