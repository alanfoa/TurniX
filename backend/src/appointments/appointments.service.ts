import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { PaginationDto } from "../common/dto/pagination.dto";
import { CreateAppointmentDto, QueryAvailableDto, UpdateStatusDto } from "./dto/appointments.dto";

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getLocalDayOfWeek(s: string): number {
  return parseLocalDate(s).getDay();
}

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateAppointmentDto, userId: number) {
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });
    if (!service || !service.isActive) {
      throw new NotFoundException("Service not found");
    }

    const professional = await this.prisma.professional.findUnique({
      where: { id: dto.professionalId },
    });
    if (!professional || !professional.isActive) {
      throw new NotFoundException("Professional not found");
    }

    const dateObj = parseLocalDate(dto.date);
    const today = parseLocalDate(new Date().toISOString().split("T")[0]);
    if (dateObj < today) {
      throw new BadRequestException("Cannot book an appointment in the past");
    }

    const dayOfWeek = getLocalDayOfWeek(dto.date);
    const start = timeToMinutes(dto.startTime);
    const end = start + service.durationMinutes;

    // Check within Availability
    const availBlocks = await this.prisma.availability.findMany({
      where: {
        professionalId: dto.professionalId,
        dayOfWeek,
        isActive: true,
      },
    });

    const withinAvailability = availBlocks.some((block) => {
      const bStart = timeToMinutes(block.startTime);
      const bEnd = timeToMinutes(block.endTime);
      return start >= bStart && end <= bEnd;
    });

    if (!withinAvailability) {
      throw new BadRequestException("Time slot is outside professional's availability");
    }

    // Check no overlap with existing appointments (same professional)
    const existingProf = await this.prisma.appointment.findMany({
      where: {
        professionalId: dto.professionalId,
        date: dateObj,
        status: { not: "CANCELLED" },
      },
    });

    for (const apt of existingProf) {
      const aStart = timeToMinutes(apt.startTime);
      const aEnd = timeToMinutes(apt.endTime);
      if (start < aEnd && end > aStart) {
        throw new BadRequestException("Time slot overlaps with an existing appointment");
      }
    }

    // Check no double-booking (same client)
    const existingUser = await this.prisma.appointment.findMany({
      where: {
        userId,
        date: dateObj,
        status: { not: "CANCELLED" },
      },
    });

    for (const apt of existingUser) {
      const aStart = timeToMinutes(apt.startTime);
      const aEnd = timeToMinutes(apt.endTime);
      if (start < aEnd && end > aStart) {
        throw new BadRequestException("You already have an appointment at this time");
      }
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        date: dateObj,
        startTime: dto.startTime,
        endTime: minutesToTime(end),
        durationMinutes: service.durationMinutes,
        price: service.price,
        userId,
        professionalId: dto.professionalId,
        serviceId: dto.serviceId,
        notes: dto.notes,
      },
    });

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const dateStr = `${dto.date} a las ${dto.startTime}`;
    const message = `Nuevo turno — ${user!.name} reservó ${service.name} con ${professional.name} el ${dateStr}`;

    const admins = await this.prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    await Promise.all(
      admins.map((a) =>
        this.notificationsService.create({
          userId: a.id,
          type: "NEW_APPOINTMENT",
          title: "Nuevo turno reservado",
          message,
          appointmentId: appointment.id,
        }),
      ),
    );

    return this.prisma.appointment.findUnique({
      where: { id: appointment.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        professional: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
    });
  }

  async findAll(userId: number, role: string, pagination: PaginationDto = {}) {
    const { page = 1, limit = 20 } = pagination;
    const where = role === "ADMIN" ? {} : { userId };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          professional: { select: { id: true, name: true } },
          service: { select: { id: true, name: true } },
        },
        orderBy: [{ date: "desc" }, { startTime: "asc" }],
        skip,
        take: limit,
      }),
      this.prisma.appointment.count({ where }),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number, userId: number, role: string) {
    const apt = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        professional: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
    });
    if (!apt) throw new NotFoundException("Appointment not found");
    if (role !== "ADMIN" && apt.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }
    return apt;
  }

  async findAvailable(query: QueryAvailableDto) {
    const dateObj = parseLocalDate(query.date);
    const dayOfWeek = getLocalDayOfWeek(query.date);

    const professional = await this.prisma.professional.findUnique({
      where: { id: query.professionalId },
    });
    if (!professional || !professional.isActive) {
      throw new NotFoundException("Professional not found");
    }

    const availBlocks = await this.prisma.availability.findMany({
      where: {
        professionalId: query.professionalId,
        dayOfWeek,
        isActive: true,
      },
    });

    if (availBlocks.length === 0) {
      return { date: query.date, professionalId: query.professionalId, slots: [] };
    }

    // Get service durations for this professional (or use first service as reference)
    const services = await this.prisma.service.findMany({
      where: { isActive: true },
      select: { durationMinutes: true },
    });
    if (services.length === 0) {
      return { date: query.date, professionalId: query.professionalId, slots: [] };
    }

    const existingAppts = await this.prisma.appointment.findMany({
      where: {
        professionalId: query.professionalId,
        date: dateObj,
        status: { not: "CANCELLED" },
      },
      select: { startTime: true, endTime: true },
    });

    // Generate 30-min slots (minimum granularity)
    const MIN_SLOT = 30;
    const slots: Array<{ startTime: string; endTime: string }> = [];

    for (const block of availBlocks) {
      const bStart = timeToMinutes(block.startTime);
      const bEnd = timeToMinutes(block.endTime);

      for (let s = bStart; s + MIN_SLOT <= bEnd; s += MIN_SLOT) {
        const slotStart = s;
        const slotEnd = s + MIN_SLOT;

        const overlaps = existingAppts.some((apt) => {
          const aStart = timeToMinutes(apt.startTime);
          const aEnd = timeToMinutes(apt.endTime);
          return slotStart < aEnd && slotEnd > aStart;
        });

        if (!overlaps) {
          slots.push({
            startTime: minutesToTime(slotStart),
            endTime: minutesToTime(slotEnd),
          });
        }
      }
    }

    return { date: query.date, professionalId: query.professionalId, slots };
  }

  async updateStatus(id: number, dto: UpdateStatusDto, userId: number, role: string) {
    const apt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!apt) throw new NotFoundException("Appointment not found");

    if (role !== "ADMIN") {
      if (apt.userId !== userId) throw new ForbiddenException("Access denied");
      if (dto.status !== "CANCELLED") throw new ForbiddenException("Only ADMIN can confirm appointments");
      if (apt.status !== "PENDING") throw new BadRequestException("Can only cancel PENDING appointments");
    }

    if (dto.status === "CONFIRMED") {
      const conflicting = await this.prisma.appointment.findMany({
        where: {
          id: { not: id },
          professionalId: apt.professionalId,
          date: apt.date,
          status: "CONFIRMED",
        },
      });
      const start = timeToMinutes(apt.startTime);
      const end = timeToMinutes(apt.endTime);
      for (const other of conflicting) {
        const oStart = timeToMinutes(other.startTime);
        const oEnd = timeToMinutes(other.endTime);
        if (start < oEnd && end > oStart) {
          throw new BadRequestException("Cannot confirm: overlaps with another CONFIRMED appointment");
        }
      }
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status: dto.status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        professional: { select: { id: true, name: true } },
        service: { select: { id: true, name: true } },
      },
    });

    const dateStr = `${updated.date.toISOString().split("T")[0]} a las ${updated.startTime}`;

    if (dto.status === "CONFIRMED" && role === "ADMIN") {
      await this.notificationsService.create({
        userId: updated.userId,
        type: "STATUS_CHANGE",
        title: "Turno confirmado",
        message: `Tu turno del ${dateStr} fue confirmado ✅`,
        appointmentId: id,
      });
    } else if (dto.status === "CANCELLED" && role === "ADMIN") {
      await this.notificationsService.create({
        userId: updated.userId,
        type: "CANCELLED",
        title: "Turno cancelado",
        message: `Tu turno del ${dateStr} fue cancelado ❌`,
        appointmentId: id,
      });
    } else if (dto.status === "CANCELLED" && role !== "ADMIN") {
      const admins = await this.prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true },
      });
      const clientName = updated.user.name;
      await Promise.all(
        admins.map((a) =>
          this.notificationsService.create({
            userId: a.id,
            type: "CANCELLED",
            title: "Turno cancelado por cliente",
            message: `${clientName} canceló su turno del ${dateStr}`,
            appointmentId: id,
          }),
        ),
      );
    }

    return updated;
  }

  async remove(id: number, userId: number, role: string) {
    const apt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!apt) throw new NotFoundException("Appointment not found");

    if (role !== "ADMIN" && apt.userId !== userId) {
      throw new ForbiddenException("Access denied");
    }
    if (apt.status !== "PENDING") {
      throw new BadRequestException("Can only delete PENDING appointments");
    }

    return this.prisma.appointment.delete({ where: { id } });
  }
}
