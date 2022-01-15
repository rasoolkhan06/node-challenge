import {
  IsNotEmpty,
  IsInt,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
import { RollStatesEnum, LtmtEnum } from "../entity/group.entity";

export class CreateGroupDto {
  @IsNotEmpty()
  name: string;

  @IsInt()
  number_of_weeks: number;

  @IsEnum(RollStatesEnum)
  roll_states: RollStatesEnum;

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
  @IsEnum(RollStatesEnum)
  roll_states: RollStatesEnum;

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
