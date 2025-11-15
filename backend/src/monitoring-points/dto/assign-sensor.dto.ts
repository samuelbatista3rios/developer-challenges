import { IsEnum, IsMongoId } from 'class-validator';
import type { SensorModel } from '../../schemas/monitoring-point.schema';

export class AssignSensorDto {
  @IsMongoId()
  monitoringPointId: string;

  @IsEnum(['TcAg', 'TcAs', 'HF+'])
  sensorModel: SensorModel;
}
