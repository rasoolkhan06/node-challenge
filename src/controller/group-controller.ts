import { NextFunction, Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { flatten } from "lodash";
import { getRepository, createQueryBuilder } from "typeorm";
import { Group } from "../entity/group.entity";
import { GroupStudent } from "../entity/group-student.entity";
import { Student } from "../entity/student.entity";
import { CreateGroupDto, UpdateGroupDto } from "../interface/group.interface";
import { GroupStudentRO } from "../response/group.ro";
import { StudentRollState } from "../entity/student-roll-state.entity";
import { Roll } from "../entity/roll.entity";

export class GroupController {
  private groupRepository = getRepository(Group);
  private groupStudentRepository = getRepository(GroupStudent);
  private studentRollStateRepository = getRepository(StudentRollState);

  async allGroups(request: Request, response: Response, next: NextFunction) {
    try {
      return this.groupRepository.find();
    } catch (err) {
      response.status(500).send({ message: err.message });
    }
  }

  async createGroup(request: Request, response: Response, next: NextFunction) {
    try {
      const createGroupDto = plainToClass(CreateGroupDto, request.body);
      const errors: ValidationError[] = await validate(createGroupDto);

      if (errors.length > 0) {
        response.status(400).send({
          error: flatten(
            errors.map((errObj) => Object.values(errObj.constraints))
          ),
        });
        return;
      }

      const group = new Group(
        createGroupDto.name,
        createGroupDto.number_of_weeks,
        createGroupDto.roll_states,
        createGroupDto.incidents,
        createGroupDto.ltmt
      );

      return this.groupRepository.save(group);
    } catch (err) {
      response.status(500).send({ message: err.message });
    }
  }

  async updateGroup(request: Request, response: Response, next: NextFunction) {
    const groupId: number = request.params.groupId;

    const updateGroupDto = plainToClass(UpdateGroupDto, request.body);
    const errors: ValidationError[] = await validate(updateGroupDto);

    if (errors.length > 0) {
      response.status(400).send({
        error: flatten(
          errors.map((errObj) => Object.values(errObj.constraints))
        ),
      });
      return;
    }

    try {
      const group: Group | undefined = await this.groupRepository.findOne(
        groupId
      );

      if (!group) {
        response.status(404).send({ message: "Group Not Found!" });
        return;
      }

      group.prepareToUpdate(
        updateGroupDto.name,
        updateGroupDto.number_of_weeks,
        updateGroupDto.roll_states,
        updateGroupDto.incidents,
        updateGroupDto.ltmt
      );

      return this.groupRepository.save(group);
    } catch (err) {
      response.status(500).send({ message: err.message });
    }
  }

  async removeGroup(request: Request, response: Response, next: NextFunction) {
    const groupId: number = request.params.groupId;

    try {
      const groupToRemove: Group = await this.groupRepository.findOne(groupId);

      if (!groupToRemove) {
        response.status(404).send({ message: "Group Not Found!" });
        return;
      }

      return await this.groupRepository.remove(groupToRemove);
    } catch (err) {
      response.status(500).send({ message: err.message });
    }
  }

  async getGroupStudents(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // Task 1:
    const groupId: number = request.params.groupId;

    try {
      const groupStudents: GroupStudentRO[] = await createQueryBuilder()
        .select([
          "student.id",
          "student.first_name",
          "student.last_name",
          `([first_name] || ' ' || [last_name]) AS full_name`,
        ])
        .from(GroupStudent, "groupStudent")
        .innerJoin(Student, "student", "groupStudent.student_id = student.id")
        .where(`groupStudent.group_id = ${groupId}`)
        .getRawMany();

      // Return the list of Students that are in a Group
      return groupStudents;
    } catch (err) {
      response.status(500).json({ message: err.message });
    }
  }

  async runGroupFilters(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      // Task 2:
      // 1. Clear out the groups (delete all the students from the groups)
      await this.groupStudentRepository.clear();

      // 2. For each group, query the student rolls to see which students match the filter for the group
      const groups: Group[] = await this.groupRepository.find();

      groups.map(async (group: Group) => {
        const todaysDate = new Date().toISOString();
        const weeksInTime = 1000 * 60 * 60 * 24 * (7 * group.number_of_weeks);
        const weeksFromNow = new Date(new Date().getTime() - weeksInTime).toISOString();

        const queryResult = await this.studentRollStateRepository
          .createQueryBuilder("studentRoll")
          .select(["studentRoll.student_id as student_id", "COUNT(studentRoll.student_id) AS incident_count"])
          .innerJoin(Roll, "roll", "studentRoll.roll_id = roll.id AND roll.completed_at BETWEEN :weeksFromNow AND :todaysDate", 
                { weeksFromNow: weeksFromNow, todaysDate: todaysDate })
          .where("INSTR(:rollStates, studentRoll.state)", { rollStates: group.roll_states })
          .groupBy("student_id")
          .having("incident_count > :incidents", { incidents: group.incidents })
          .execute();

        console.log(queryResult);
      });

      // 3. Add the list of students that match the filter to the group

      return "Done";
    } catch (err) {
      response.status(500).send({ message: err.message });
    }
  }

  async test(request: Request, response: Response, next: NextFunction) {
    const group = new GroupStudent(1, 1, 3);

    return this.groupStudentRepository.save(group);
  }
}
