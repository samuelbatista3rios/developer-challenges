import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MachineDocument = Machine & Document;

export type MachineType = 'Pump' | 'Fan';

@Schema({ timestamps: true })
export class Machine {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['Pump', 'Fan'] })
  type: MachineType;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
