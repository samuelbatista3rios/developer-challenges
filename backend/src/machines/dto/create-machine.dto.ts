import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum MachineType {
  Pump = 'Pump',
  Fan = 'Fan',
}

export class CreateMachineDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(MachineType)
  type: MachineType;
}
