import { DatabaseModule } from '@/database';
import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MessagesService } from './messages.service';

@Module({
  imports: [DatabaseModule],
  providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
