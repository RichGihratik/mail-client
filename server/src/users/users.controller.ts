import { Param, Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private messages: UsersService) {}

  @Get()
  getUsers() {
    return this.messages.getUsers();
  }

  @Get(':name')
  getAll(@Param('name') name: string) {
    return this.messages.getAll(name);
  }

  @Get(':name/sent')
  getSent(@Param('name') name: string) {
    return this.messages.getSent(name);
  }

  @Get(':name/inbox')
  getInbox(@Param('name') name: string) {
    return this.messages.getInbox(name);
  }
}
