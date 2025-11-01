import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/scheduling.dto';
import { SchedulingService } from './scheduling.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Schedule")
@Controller('scheduling')
export class SchedulingController {
  constructor(private readonly scheduleService: SchedulingService) {}

  // Criar schedule
  @Post()
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto);
  }

  // Listar todos
  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  // Listar apenas 1 schedule pelo ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    const schedule = this.scheduleService.findOne(+id);
    if (!schedule) throw new NotFoundException(`Schedule ${id} not found`);
    return schedule;
  }

  // Listar apenas os schedules ativos
  @Get('active')
  findActive() {
    return this.scheduleService.findActive();
  }

  // Listar os schedules que estão "em execução" ou próximos de executar
  @Get('running')
  findRunning() {
    return this.scheduleService.findRunning();
  }

  // Atualizar schedule
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateScheduleDto>) {
    const updated = this.scheduleService.update(+id, dto);
    if (!updated) throw new NotFoundException(`Schedule ${id} not found`);
    return updated;
  }

  // Deletar schedule
  @Delete(':id')
  remove(@Param('id') id: string) {
    const removed = this.scheduleService.remove(+id);
    if (!removed) throw new NotFoundException(`Schedule ${id} not found`);
    return { deleted: true };
  }
}
