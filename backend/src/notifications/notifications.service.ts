import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Subject } from "rxjs";

export interface NotificationEvent {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  appointmentId: number | null;
  read: boolean;
  createdAt: Date;
}

@Injectable()
export class NotificationsService {
  private subjects = new Map<number, Subject<NotificationEvent>>();

  constructor(private readonly prisma: PrismaService) {}

  getOrCreateSubject(userId: number): Subject<NotificationEvent> {
    if (!this.subjects.has(userId)) {
      this.subjects.set(userId, new Subject<NotificationEvent>());
    }
    return this.subjects.get(userId)!;
  }

  removeSubject(userId: number) {
    this.subjects.delete(userId);
  }

  async create(data: {
    userId: number;
    type: string;
    title: string;
    message: string;
    appointmentId?: number;
  }) {
    const notification = await this.prisma.notification.create({ data });
    const event: NotificationEvent = {
      id: notification.id,
      userId: notification.userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      appointmentId: notification.appointmentId,
      read: notification.read,
      createdAt: notification.createdAt,
    };
    const subject = this.subjects.get(data.userId);
    if (subject) {
      subject.next(event);
    }
    return notification;
  }

  async findByUser(userId: number, limit = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  async unreadCount(userId: number) {
    return this.prisma.notification.count({
      where: { userId, read: false },
    });
  }

  async markRead(id: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}
