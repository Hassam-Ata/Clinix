import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  constructor(private prisma: PrismaService) {}

  async test() {
    return await this.prisma.user.findMany();
  }
}
