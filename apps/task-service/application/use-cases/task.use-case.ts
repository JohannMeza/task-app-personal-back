import { Injectable } from '@nestjs/common';
import { TaskInterface } from '../../domain/entities/task.interface';
import { TaskServices } from '../../domain/services/task.services';
import { AuthUser } from 'lib/common/interfaces/current-user.intreface';

@Injectable()
export class TaskUseCase {
  constructor(private readonly taskServices: TaskServices) {}

  crearTarea(task: TaskInterface, user: AuthUser) {
    return this.taskServices.crearTarea(task, user);
  }

  listarTarea(user: AuthUser): Promise<TaskInterface[]> {
    return this.taskServices.listarTarea(user);
  }

  eliminarTarea(id: string): Promise<string> {
    return this.taskServices.eliminarTarea(id);
  }

  obtenerTarea(id: string): Promise<TaskInterface> {
    return this.taskServices.obtenerTarea(id);
  }

  actualizarTarea(id: string, task: TaskInterface): Promise<string> {
    return this.taskServices.actualizarTarea(id, task);
  }
}
