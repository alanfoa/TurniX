import { Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Sse, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { NotificationsService, NotificationEvent } from "./notifications.service";
import { MessageEvent } from "@nestjs/common";

@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user: { id: number }) {
    return this.notificationsService.findByUser(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get("unread-count")
  async getUnreadCount(@CurrentUser() user: { id: number }) {
    const count = await this.notificationsService.unreadCount(user.id);
    return { count };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/read")
  markRead(@Param("id", ParseIntPipe) id: number, @CurrentUser() user: { id: number }) {
    return this.notificationsService.markRead(id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("read-all")
  markAllRead(@CurrentUser() user: { id: number }) {
    return this.notificationsService.markAllRead(user.id);
  }

  @Sse("stream")
  stream(@Query("token") token: string): Observable<MessageEvent> {
    if (!token) throw new UnauthorizedException();

    let payload: { sub: number };
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException();
    }

    const subject = this.notificationsService.getOrCreateSubject(payload.sub);
    return subject.pipe(
      map((notification: NotificationEvent) => ({
        type: "notification",
        data: JSON.stringify(notification),
      })),
    );
  }
}
