import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProfessionalDto, UpdateProfessionalDto } from "./dto/professionals.dto";

@Injectable()
export class ProfessionalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfessionalDto) {
    return this.prisma.professional.create({ data: dto });
  }

  async findAll() {
    return this.prisma.professional.findMany({
      where: { isActive: true },
      include: { user: { select: { id: true, email: true, name: true } } },
      orderBy: { name: "asc" },
    });
  }

  async findOne(id: number) {
    const pro = await this.prisma.professional.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
    if (!pro || !pro.isActive) throw new NotFoundException("Professional not found");
    return pro;
  }

  async update(id: number, dto: UpdateProfessionalDto) {
    await this.findOne(id);
    return this.prisma.professional.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.professional.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
