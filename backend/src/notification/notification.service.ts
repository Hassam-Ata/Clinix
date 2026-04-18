import { Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: string,
    message: string,
    type: string,
  ): Promise<Notification> {
    return (await this.prisma.notification.create({
      data: {
        userId,
        message,
        type,
      },
    })) as Notification;
  }

  async getUserNotifications(userId: string): Promise<Notification[]> {
    return (await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })) as Notification[];
  }

  async markAsRead(id: string): Promise<Notification> {
    return (await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })) as Notification;
  }
}
