import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { MachinesModule } from './machines/machines.module';
import { MonitoringPointsModule } from './monitoring-points/monitoring-points.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,
    MachinesModule,
    MonitoringPointsModule,
  ],
})
export class AppModule {}
