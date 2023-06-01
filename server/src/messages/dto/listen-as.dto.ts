import { IsNotEmpty, IsString } from 'class-validator';

export class ListenAsDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
