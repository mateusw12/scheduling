import { ScheduleType } from "../enum/schedule-type.enum";

export class ScheduleResponseDto {
  id: number;
  name: string;
  type: ScheduleType;
  cronExpression?: string;
  customTimes?: Date[];
  task: string;
  active: boolean;
  nextRuns: Date[];
}
