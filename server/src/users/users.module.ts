import { DatabaseModule } from '@/database';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
