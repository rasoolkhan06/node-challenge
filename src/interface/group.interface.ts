import {
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
import { LtmtEnum } from "../entity/group.entity";

export class CreateGroupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsInt()
  number_of_weeks: number;

  @IsNotEmpty()
  @IsString()
  roll_states: string;

  @IsInt()
  incidents: number;

  @IsEnum(LtmtEnum)
  ltmt: LtmtEnum;
}

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsInt()
  number_of_weeks: number;

  @IsOptional()
  @IsString()
  roll_states: string;

  @IsOptional()
  @IsInt()
  incidents: number;

  @IsOptional()
  @IsEnum(LtmtEnum)
  ltmt: LtmtEnum;

  @IsOptional()
  @IsInt()
  student_count: number;
}
