import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { CreateScheduleDto } from './dto/scheduling.dto';
import { Schedule } from './interface/schedule.interface';
import { ScheduleType } from './enum/schedule-type.enum';
import { ScheduleResponseDto } from './dto/schedule-response.dto';

@Injectable()
export class SchedulingService {
  private schedules: Schedule[] = [];
  private idCounter = 1;

  // Criar schedule
  create(dto: CreateScheduleDto): Schedule {
    const schedule: Schedule = {
      id: this.idCounter++,
      name: dto.name,
      type: dto.type,
      cronExpression: dto.cronExpression,
      customTimes: dto.customTimes?.map((t) => new Date(t)),
      task: dto.task,
      active: true,
      nextRuns: [],
    };

    this.schedules.push(schedule);
    this.runSchedule(schedule);

    return this.toResponse(schedule);
  }

  // Executa a schedule
  private runSchedule(schedule: Schedule) {
    if (schedule.type === ScheduleType.CRON && schedule.cronExpression) {
      const job = cron.schedule(schedule.cronExpression, () => {
        console.log(
          `Executando task [CRON]: ${schedule.task} (${schedule.name})`,
        );
        this.updateNextRuns(schedule);
      });
      schedule.cronJob = job;
      this.updateNextRuns(schedule);
    } else if (schedule.type === ScheduleType.CUSTOM && schedule.customTimes) {
      schedule.customTimes.forEach((time) => {
        const delay = time.getTime() - Date.now();
        if (delay > 0) {
          setTimeout(() => {
            console.log(
              `Executando task [CUSTOM]: ${schedule.task} (${schedule.name})`,
            );
            this.updateNextRuns(schedule);
          }, delay);
        }
      });
      this.updateNextRuns(schedule);
    }
  }

  private updateNextRuns(schedule: Schedule) {
    if (schedule.type === ScheduleType.CRON && schedule.cronJob) {
      // O node-cron não fornece próximos horários nativamente
      // Aqui só armazenamos a hora atual como última execução
      schedule.nextRuns = [new Date(Date.now() + 1000 * 60)]; // aproximação de próximo minuto
    } else if (schedule.type === ScheduleType.CUSTOM && schedule.customTimes) {
      schedule.nextRuns = schedule.customTimes.filter((t) => t > new Date());
    }
  }

  // Listar todos
  findAll(): ScheduleResponseDto[] {
    return this.schedules.map((s) => this.toResponse(s));
  }

  // Listar 1
  findOne(id: number): ScheduleResponseDto | undefined {
    const schedule = this.schedules.find((s) => s.id === id);
    if (!schedule) return undefined;
    return this.toResponse(schedule);
  }

  // Listar apenas ativos
  findActive(): ScheduleResponseDto[] {
    const scheduleFilter = this.schedules.filter((s) => s.active);
    return scheduleFilter.map((s) => this.toResponse(s));
  }

  // Próximos schedules em execução ou próximos
  findRunning(): ScheduleResponseDto[] {
    const now = new Date();
    return this.schedules
      .filter(
        (s) =>
          s.active &&
          (s.type === ScheduleType.CRON || s.nextRuns.some((t) => t > now)),
      )
      .map((s) => this.toResponse(s));
  }

  // Atualizar schedule
  update(
    id: number,
    dto: Partial<CreateScheduleDto>,
  ): ScheduleResponseDto | undefined {
    const schedule = this.findUpdate(id);
    if (!schedule) return undefined;

    // Desliga cron antigo se existir
    if (schedule.cronJob) {
      schedule.cronJob.stop();
      schedule.cronJob = undefined;
    }

    // Atualiza campos
    if (dto.name) schedule.name = dto.name;
    if (dto.task) schedule.task = dto.task;
    if (dto.type) schedule.type = dto.type;
    if (dto.cronExpression) schedule.cronExpression = dto.cronExpression;
    if (dto.customTimes)
      schedule.customTimes = dto.customTimes.map((t) => new Date(t));

    // Reexecuta schedule
    this.runSchedule(schedule);

    return this.toResponse(schedule);
  }

  // Remover schedule
  remove(id: number): boolean {
    const index = this.schedules.findIndex((s) => s.id === id);
    if (index === -1) return false;

    const schedule = this.schedules[index];
    if (schedule.cronJob) schedule.cronJob.stop();

    this.schedules.splice(index, 1);
    return true;
  }

  private findUpdate(id: number): Schedule | undefined {
    return this.schedules.find((s) => s.id === id);
  }

  private toResponse(schedule: Schedule): ScheduleResponseDto {
    const { cronJob, ...rest } = schedule;
    return rest;
  }
}
