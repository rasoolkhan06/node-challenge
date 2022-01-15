import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class GroupStudent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_id: number;

  @Column()
  group_id: number;

  @Column()
  incident_count: number;

  constructor(student_id: number, group_id: number, incident_count: number) {
    this.student_id = student_id;
    this.group_id = group_id;
    this.incident_count = incident_count;
  }
}
