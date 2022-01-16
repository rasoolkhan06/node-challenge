import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum LtmtEnum {
  LESSTHAN = "<",
  MORETHAN = ">",
}

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  number_of_weeks: number;

  @Column()
  roll_states: string;

  @Column()
  incidents: number;

  @Column({ type: "varchar" })
  ltmt: LtmtEnum;

  @Column({
    nullable: true,
  })
  run_at: Date;

  @Column({ default: 0 })
  student_count: number = 0;

  constructor(
    name: string,
    number_of_weeks: number,
    roll_states: string,
    incidents: number,
    ltmt: LtmtEnum
  ) {
    this.name = name;
    this.number_of_weeks = number_of_weeks;
    this.roll_states = roll_states;
    this.incidents = incidents;
    this.ltmt = ltmt;
  }

  public prepareToUpdate(
    name?: string,
    number_of_weeks?: number,
    roll_states?: string,
    incidents?: number,
    ltmt?: LtmtEnum
  ) {
    if (name !== undefined) this.name = name;
    if (number_of_weeks !== undefined) this.number_of_weeks = number_of_weeks;
    if (roll_states !== undefined) this.roll_states = roll_states;
    if (incidents !== undefined) this.incidents = incidents;
    if (ltmt !== undefined) this.ltmt = ltmt;
  }
}
