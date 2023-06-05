import { IsNotEmpty, IsString } from 'class-validator';
import { sanitize } from 'isomorphic-dompurify';
import { Transform } from 'class-transformer';

export class ListenAsDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => sanitize(value))
  name: string;
}
