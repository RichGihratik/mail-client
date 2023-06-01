import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async getUsers() {
    return await this.db.mailUser.findMany({ select: { name: true } });
  }

  async getAll(name: string) {
    return {
      inbox: await this.getInbox(name),
      sent: await this.getSent(name),
    };
  }

  async getSent(name: string) {
    return (
      (await this.db.mailUser.findUnique({
        select: {
          sent: {
            select: {
              title: true,
              content: true,
              toName: true,
            },
          },
        },
        where: {
          name: name,
        },
      })) ?? { sent: [] }
    ).sent;
  }

  async getInbox(name: string) {
    return (
      (await this.db.mailUser.findUnique({
        select: {
          inbox: {
            select: {
              title: true,
              content: true,
              fromName: true,
            },
          },
        },
        where: {
          name: name,
        },
      })) ?? { inbox: [] }
    ).inbox;
  }
}
