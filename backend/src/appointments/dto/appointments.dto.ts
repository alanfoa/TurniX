import { Type } from "class-transformer";
import { IsDateString, IsInt, IsOptional, IsString, Matches } from "class-validator";

export class CreateAppointmentDto {
  @IsDateString()
  date: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  startTime: string;

  @IsInt()
  professionalId: number;

  @IsInt()
  serviceId: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateStatusDto {
  @IsString()
  status: "CONFIRMED" | "CANCELLED";
}

export class QueryAvailableDto {
  @Type(() => Number)
  @IsInt()
  professionalId: number;

  @IsDateString()
  date: string;
}
