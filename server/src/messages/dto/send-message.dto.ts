import { IsNotEmpty, IsString } from 'class-validator';
import { sanitize } from 'isomorphic-dompurify';
import { Transform } from 'class-transformer';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => sanitize(value))
  from: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => sanitize(value))
  to: string;

  @IsString()
  @Transform(({ value }) => sanitize(value))
  content: string;

  @IsString()
  @Transform(({ value }) => sanitize(value))
  title: string;
}
