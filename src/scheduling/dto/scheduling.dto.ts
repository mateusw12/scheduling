import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleType } from '../enum/schedule-type.enum';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Nome do agendamento',
    example: 'Backup diário',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Tipo de agendamento: CRON ou CUSTOM',
    enum: ScheduleType,
    example: ScheduleType.CRON,
  })
  @IsEnum(ScheduleType)
  type: ScheduleType;

  @ApiPropertyOptional({
    description: 'Expressão CRON (somente para type = CRON)',
    example: '0 8 * * *', // Todo dia às 8h
  })
  @IsOptional()
  @IsString()
  cronExpression?: string;

  @ApiPropertyOptional({
    description: 'Horários personalizados (somente para type = CUSTOM)',
    example: ['2025-11-01T14:00:00Z', '2025-11-02T18:00:00Z'],
  })
  @IsOptional()
  @IsArray()
  @IsDateString()
  customTimes?: string[];

  @ApiProperty({
    description: 'Descrição ou nome da tarefa que será executada',
    example: 'Enviar e-mail de backup',
  })
  @IsString()
  task: string;
}
