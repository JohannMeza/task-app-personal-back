import { Injectable, NotFoundException } from '@nestjs/common';
import { dynamoDb } from '../dynamodb/dynamodb.cliente';
import { DeleteCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { TaskInterface } from '../../domain/entities/task.interface';
import { AuthUser } from 'lib/common/interfaces/current-user.intreface';

@Injectable()
export class TaskRepository {
  async crear(task: TaskInterface, user: AuthUser): Promise<string> {
    await dynamoDb.send(
      new PutCommand({
        TableName: 'task-app-personal',
        Item: {
          id: crypto.randomUUID(),
          SK: `TASK-${crypto.randomUUID().replace(/-/g, '').substring(0, 6).toUpperCase()}`,
          titulo: task.titulo,
          estado: task.estado,
          descripcion: task.descripcion || '',
          asignado: task.asignado || 'Ninguno',
          informador: task.informador || 'Johann Meza',
          storyPoints:
            task.storyPoints !== undefined ? Number(task.storyPoints) : 0,
          categoria: task.categoria || 'Desarrollo',
          tags: task.tags || [],
          idUser: user.sub,
        },
      }),
    );

    return 'Registro creado exitosamente';
  }

  async listar(user: AuthUser): Promise<TaskInterface[]> {
    const tareas = await dynamoDb.send(
      new ScanCommand({
        TableName: 'task-app-personal',
        FilterExpression: 'idUser = :idUser',
        ExpressionAttributeValues: {
          ':idUser': user.sub,
        },
      }),
    );

    return (tareas.Items ?? []) as TaskInterface[];
  }

  async obtener(id: string): Promise<TaskInterface> {
    const tarea = await dynamoDb.send(
      new GetCommand({
        TableName: 'task-app-personal',
        Key: {
          id,
        },
      }),
    );

    if (!tarea.Item) {
      throw new NotFoundException('La tarea no existe');
    }

    return tarea.Item as TaskInterface;
  }

  async actualizar(id: string, task: TaskInterface): Promise<string> {
    try {
      const tarea = await dynamoDb.send(
        new UpdateCommand({
          TableName: 'task-app-personal',
          Key: {
            id,
          },
          UpdateExpression:
            'SET titulo = :titulo, estado = :estado, descripcion = :descripcion, asignado = :asignado, informador = :informador, storyPoints = :storyPoints, categoria = :categoria, tags = :tags',
          ExpressionAttributeValues: {
            ':titulo': task.titulo,
            ':estado': task.estado,
            ':descripcion': task.descripcion || '',
            ':asignado': task.asignado || 'Ninguno',
            ':informador': task.informador || 'Johann Meza',
            ':storyPoints':
              task.storyPoints !== undefined ? Number(task.storyPoints) : 0,
            ':categoria': task.categoria || 'Desarrollo',
            ':tags': task.tags || [],
          },
          ConditionExpression: 'attribute_exists(id)',
          ReturnValues: 'ALL_NEW',
        }),
      );

      if (!tarea.Attributes) {
        throw new NotFoundException('La tarea no existe.');
      }

      return 'La tarea se actualizo correctamente.';
    } catch (error) {
      console.error(error);
      return 'Se produjo un error al editar la tarea.';
    }
  }

  async eliminar(id: string): Promise<string> {
    try {
      const tareaEliminada = await dynamoDb.send(
        new DeleteCommand({
          TableName: 'task-app-personal',
          Key: {
            id,
          },
          ReturnValues: 'ALL_OLD',
        }),
      );

      if (!tareaEliminada.Attributes) {
        return 'No se ha encontrado la tarea con el id: ' + id;
      }

      return 'La tarea se ha eliminado con éxito.';
    } catch (error) {
      console.error(error);
      return 'Se produjo un error al eliminar la tarea.';
    }
  }
}
