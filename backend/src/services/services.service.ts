import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateServiceDto, UpdateServiceDto } from "./dto/services.dto";

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    return this.prisma.service.create({ data: dto });
  }

  async findAll() {
    return this.prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  async findOne(id: number) {
    return this.prisma.service.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, dto: UpdateServiceDto) {
    return this.prisma.service.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    return this.prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
