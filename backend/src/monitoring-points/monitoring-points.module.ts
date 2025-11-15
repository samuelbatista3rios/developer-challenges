import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonitoringPointsService } from './monitoring-points.service';
import { MonitoringPointsController } from './monitoring-points.controller';
import {
  MonitoringPoint,
  MonitoringPointSchema,
} from '../schemas/monitoring-point.schema';
import { Machine, MachineSchema } from '../schemas/machine.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonitoringPoint.name, schema: MonitoringPointSchema },
      { name: Machine.name, schema: MachineSchema },
    ]),
    AuthModule,
  ],
  providers: [MonitoringPointsService],
  controllers: [MonitoringPointsController],
  exports: [MonitoringPointsService],
})
export class MonitoringPointsModule {}
