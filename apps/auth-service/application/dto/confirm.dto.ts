import { IsString, MinLength } from 'class-validator';

export class ConfirmDto {
  @IsString()
  username!: string;

  @IsString()
  @MinLength(6)
  code!: string;
}
