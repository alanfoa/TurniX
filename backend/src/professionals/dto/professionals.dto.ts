import { IsInt, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateProfessionalDto {
  @IsString()
  name: string;

  @IsString()
  specialty: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsInt()
  userId: number;
}

export class UpdateProfessionalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
