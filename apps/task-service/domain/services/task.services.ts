import { Injectable } from '@nestjs/common';
import { TaskInterface } from '../entities/task.interface';
import { TaskRepository } from '../../infrastructure/repositories/task.repository';
import { AuthUser } from 'lib/common/interfaces/current-user.intreface';

@Injectable()
export class TaskServices {
  constructor(private readonly taskRepository: TaskRepository) {}

  crearTarea(task: TaskInterface, user: AuthUser): Promise<string> {
    return this.taskRepository.crear(task, user);
  }

  listarTarea(user: AuthUser): Promise<TaskInterface[]> {
    return this.taskRepository.listar(user);
  }

  eliminarTarea(id: string): Promise<string> {
    return this.taskRepository.eliminar(id);
  }

  obtenerTarea(id: string): Promise<TaskInterface> {
    return this.taskRepository.obtener(id);
  }

  actualizarTarea(id: string, task: TaskInterface): Promise<string> {
    return this.taskRepository.actualizar(id, task);
  }
}
