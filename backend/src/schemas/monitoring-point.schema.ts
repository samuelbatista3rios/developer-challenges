/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Machine } from './machine.schema';

export type MonitoringPointDocument = MonitoringPoint & Document;

export type SensorModel = 'TcAg' | 'TcAs' | 'HF+';

@Schema({ timestamps: true })
export class MonitoringPoint {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Machine', required: true })
  machine: Types.ObjectId;

  @Prop({ enum: ['TcAg', 'TcAs', 'HF+'], required: false })
  sensorModel?: SensorModel;
}

export const MonitoringPointSchema =
  SchemaFactory.createForClass(MonitoringPoint);
