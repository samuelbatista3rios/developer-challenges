import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateMonitoringPointDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsMongoId()
  machineId: string;
}
