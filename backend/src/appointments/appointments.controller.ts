import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto, QueryAvailableDto, UpdateStatusDto } from "./dto/appointments.dto";
import { PaginationDto } from "../common/dto/pagination.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateAppointmentDto, @CurrentUser() user: { id: number }) {
    return this.appointmentsService.create(dto, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @CurrentUser() user: { id: number; role: string },
    @Query() pagination: PaginationDto,
  ) {
    return this.appointmentsService.findAll(user.id, user.role, pagination);
  }

  @Get("available")
  findAvailable(@Query() query: QueryAvailableDto) {
    return this.appointmentsService.findAvailable(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: { id: number; role: string },
  ) {
    return this.appointmentsService.findOne(id, user.id, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/status")
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: { id: number; role: string },
  ) {
    return this.appointmentsService.updateStatus(id, dto, user.id, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param("id", ParseIntPipe) id: number,
    @CurrentUser() user: { id: number; role: string },
  ) {
    return this.appointmentsService.remove(id, user.id, user.role);
  }
}
