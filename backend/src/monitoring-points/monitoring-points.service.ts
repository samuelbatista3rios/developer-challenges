import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MonitoringPoint,
  MonitoringPointDocument,
} from '../schemas/monitoring-point.schema';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { AssignSensorDto } from './dto/assign-sensor.dto';
import { Machine, MachineDocument } from '../schemas/machine.schema';
import { UpdateMonitoringPointDto } from './dto/update-monitoring-point.dto';

@Injectable()
export class MonitoringPointsService {
  constructor(
    @InjectModel(MonitoringPoint.name)
    private readonly mpModel: Model<MonitoringPointDocument>,
    @InjectModel(Machine.name)
    private readonly machineModel: Model<MachineDocument>,
  ) {}

  private isMachineDocument(value: unknown): value is MachineDocument {
    return (
      typeof value === 'object' &&
      value !== null &&
      'type' in (value as Record<string, unknown>) &&
      typeof (value as Record<string, unknown>).type === 'string'
    );
  }

  async create(dto: CreateMonitoringPointDto): Promise<MonitoringPoint> {
    const machine = await this.machineModel.findById(dto.machineId).exec();
    if (!machine) throw new NotFoundException('Machine not found');

    const mp = new this.mpModel({ name: dto.name, machine: machine._id });
    const saved = await mp.save();

    const populated = await this.mpModel
      .findById(saved._id)
      .populate('machine')
      .exec();
    if (!populated)
      throw new NotFoundException('Error returning created monitoring point');

    return populated as MonitoringPoint;
  }

  async assignSensor(dto: AssignSensorDto): Promise<MonitoringPoint> {
    if (!Types.ObjectId.isValid(dto.monitoringPointId)) {
      throw new BadRequestException('Invalid monitoringPointId');
    }

    const mp = await this.mpModel
      .findById(dto.monitoringPointId)
      .populate('machine')
      .exec();
    if (!mp) throw new NotFoundException('Monitoring point not found');

    const machinePart = mp.machine;

    if (this.isMachineDocument(machinePart)) {
      if (
        machinePart.type === 'Pump' &&
        (dto.sensorModel === 'TcAg' || dto.sensorModel === 'TcAs')
      ) {
        throw new BadRequestException('Pump cannot have TcAg or TcAs sensors');
      }
    } else {
      const machineIdStr = String(machinePart ?? '');
      if (Types.ObjectId.isValid(machineIdStr)) {
        const machineDoc = await this.machineModel.findById(machineIdStr);
        if (
          machineDoc &&
          machineDoc.type === 'Pump' &&
          (dto.sensorModel === 'TcAg' || dto.sensorModel === 'TcAs')
        ) {
          throw new BadRequestException(
            'Pump cannot have TcAg or TcAs sensors',
          );
        }
      }
    }

    mp.sensorModel = dto.sensorModel;
    await mp.save();

    const populated = await this.mpModel
      .findById(mp._id)
      .populate('machine')
      .exec();
    if (!populated)
      throw new NotFoundException('Error returning updated monitoring point');

    return populated as MonitoringPoint;
  }

  async update(
    id: string,
    dto: UpdateMonitoringPointDto,
  ): Promise<MonitoringPoint> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid monitoring point id');
    }

    const mp = await this.mpModel.findById(id).exec();
    if (!mp) throw new NotFoundException('Monitoring point not found');

    if (dto.machineId !== undefined && dto.machineId !== null) {
      if (!Types.ObjectId.isValid(dto.machineId)) {
        throw new BadRequestException('Invalid machineId');
      }
      const newMachine = await this.machineModel.findById(dto.machineId).exec();
      if (!newMachine) throw new NotFoundException('Machine not found');

      mp.machine = newMachine._id as Types.ObjectId;
    }

    if (Object.prototype.hasOwnProperty.call(dto, 'sensorModel')) {
      let machineDoc: MachineDocument | null = null;

      if (this.isMachineDocument(mp.machine)) {
        machineDoc = mp.machine as MachineDocument;
      } else {
        const machineIdToCheck = String(mp.machine ?? '');
        if (Types.ObjectId.isValid(machineIdToCheck)) {
          machineDoc = await this.machineModel
            .findById(machineIdToCheck)
            .exec();
        }
      }

      if (
        machineDoc &&
        machineDoc.type === 'Pump' &&
        (dto.sensorModel === 'TcAg' || dto.sensorModel === 'TcAs')
      ) {
        throw new BadRequestException(
          'Cannot assign TcAg/TcAs to Pump machine',
        );
      }

      mp.sensorModel = dto.sensorModel === null ? undefined : dto.sensorModel;
    }

    if (dto.name !== undefined && dto.name !== null) {
      mp.name = dto.name;
    }

    await mp.save();

    const populated = await this.mpModel
      .findById(mp._id)
      .populate('machine')
      .exec();
    if (!populated)
      throw new NotFoundException('Error returning updated monitoring point');

    return populated as MonitoringPoint;
  }

  async remove(id: string): Promise<{ id: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid monitoring point id');
    }

    const removed: MonitoringPointDocument | null = await this.mpModel
      .findByIdAndDelete(id)
      .exec();
    if (!removed) {
      throw new NotFoundException('Monitoring point not found');
    }

    return { id: (removed._id as Types.ObjectId).toString() };
  }

  async findAll(
    page = 1,
    limit = 5,
    sortBy = 'name',
    order: 'asc' | 'desc' = 'asc',
  ): Promise<{ items: MonitoringPoint[]; total: number }> {
    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = { [sortBy]: order === 'asc' ? 1 : -1 };

    const [items, total] = await Promise.all([
      this.mpModel
        .find()
        .populate('machine')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.mpModel.countDocuments().exec(),
    ]);

    return { items, total };
  }
}
