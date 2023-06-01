import { Module } from '@nestjs/common';

import { UsersModule } from './users';
import { MessagesModule } from './messages';

@Module({
  imports: [UsersModule, MessagesModule],
})
export class AppModule {}
