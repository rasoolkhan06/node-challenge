export class GroupStudentRO {
  student_id: number;
  first_name: string;
  last_name: string;
  full_name: string;

  constructor(
    student_id: number,
    first_name: string,
    last_name: string,
    full_name: string
  ) {
    this.student_id = student_id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.full_name = full_name;
  }
}
