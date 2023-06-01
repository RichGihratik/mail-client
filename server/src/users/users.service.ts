import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async getUsers() {
    const result = await this.db.message.findMany({
      select: {
        from: true,
        to: true,
      },
    });

    const set = new Set();

    result.forEach((item) => {
      set.add(item.from);
      set.add(item.to);
    });

    return [...set];
  }

  async getAll(name: string) {
    return {
      inbox: await this.getInbox(name),
      sent: await this.getSent(name),
    };
  }

  async getSent(name: string) {
    return await this.db.message.findMany({
      where: {
        from: name,
      },
      select: {
        title: true,
        content: true,
        to: true,
      },
    });
  }

  async getInbox(name: string) {
    return await this.db.message.findMany({
      where: {
        to: name,
      },
      select: {
        title: true,
        content: true,
        from: true,
      },
    });
  }
}
