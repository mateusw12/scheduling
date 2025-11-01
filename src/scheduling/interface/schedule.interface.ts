import * as cron from 'node-cron';
import { ScheduleType } from '../enum/schedule-type.enum';

export interface Schedule {
  id: number;
  name: string;
  type: ScheduleType;
  cronExpression?: string;
  customTimes?: Date[];
  task: string;
  active: boolean;
  nextRuns: Date[]; // Próximos horários de execução
  cronJob?: cron.ScheduledTask;
}