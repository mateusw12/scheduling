import { Module } from '@nestjs/common';
import { SchedulingController } from './scheduling.controller';
import { SchedulingService } from './scheduling.service';

@Module({
  providers: [SchedulingService],
  controllers: [SchedulingController]
})
export class SchedulingModule {}
