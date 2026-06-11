import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { AvailabilityService } from "./availability.service";
import { CreateAvailabilityDto } from "./dto/availability.dto";

@Controller("availability")
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Post()
  create(@Body() dto: CreateAvailabilityDto) {
    return this.availabilityService.create(dto);
  }

  @Get("professional/:professionalId")
  findByProfessional(@Param("professionalId", ParseIntPipe) professionalId: number) {
    return this.availabilityService.findByProfessional(professionalId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: Partial<CreateAvailabilityDto>) {
    return this.availabilityService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.availabilityService.remove(id);
  }
}
