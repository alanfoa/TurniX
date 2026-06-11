import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAvailabilityDto } from "./dto/availability.dto";
import { BadRequestException } from "@nestjs/common";

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAvailabilityDto) {
    const start = timeToMinutes(dto.startTime);
    const end = timeToMinutes(dto.endTime);
    if (start >= end) {
      throw new BadRequestException("startTime must be before endTime");
    }

    const existing = await this.prisma.availability.findMany({
      where: {
        professionalId: dto.professionalId,
        dayOfWeek: dto.dayOfWeek,
        isActive: true,
      },
    });

    for (const block of existing) {
      const bStart = timeToMinutes(block.startTime);
      const bEnd = timeToMinutes(block.endTime);
      if (start < bEnd && end > bStart) {
        throw new BadRequestException(
          `Overlaps with existing block ${block.startTime}-${block.endTime}`,
        );
      }
    }

    return this.prisma.availability.create({ data: dto });
  }

  async findByProfessional(professionalId: number) {
    return this.prisma.availability.findMany({
      where: { professionalId, isActive: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
  }

  async update(id: number, dto: Partial<CreateAvailabilityDto>) {
    if (dto.startTime && dto.endTime) {
      const start = timeToMinutes(dto.startTime);
      const end = timeToMinutes(dto.endTime);
      if (start >= end) {
        throw new BadRequestException("startTime must be before endTime");
      }
    }
    return this.prisma.availability.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.availability.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
