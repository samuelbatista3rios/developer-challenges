/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsOptional, IsString, IsMongoId, IsEnum, IsIn } from 'class-validator';

export type SensorModelType = 'TcAg' | 'TcAs' | 'HF+';

export class UpdateMonitoringPointDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsMongoId()
  machineId?: string;

  @IsOptional()
  @IsIn(['TcAg', 'TcAs', 'HF+', null] as any)
  sensorModel?: SensorModelType | null;
}
