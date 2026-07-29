export class TaskInterface {
  constructor(
    public readonly id: string,
    public readonly estado: string,
    public readonly titulo: string,
    public readonly descripcion?: string,
    public readonly asignado?: string,
    public readonly informador?: string,
    public readonly storyPoints?: number,
    public readonly categoria?: string,
    public readonly tags?: string[],
  ) {}
}
