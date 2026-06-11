import { IsInt, IsString, Matches, Min, Max } from "class-validator";

export class CreateAvailabilityDto {
  @IsInt()
  professionalId: number;

  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  startTime: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  endTime: string;
}
