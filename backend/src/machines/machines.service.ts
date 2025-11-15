import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Machine, MachineDocument } from '../schemas/machine.schema';
import { CreateMachineDto } from './dto/create-machine.dto';
import { UpdateMachineDto } from './dto/update-machine.dto';

@Injectable()
export class MachinesService {
  constructor(
    @InjectModel(Machine.name)
    private readonly machineModel: Model<MachineDocument>,
  ) {}

  async create(dto: CreateMachineDto): Promise<Machine> {
    const machine = new this.machineModel(dto);
    return machine.save();
  }

  async findAll(): Promise<Machine[]> {
    return this.machineModel.find().exec();
  }

  async findOne(id: string): Promise<Machine> {
    const machine = await this.machineModel.findById(id).exec();
    if (!machine) throw new NotFoundException('Machine not found');
    return machine;
  }

  async update(id: string, dto: UpdateMachineDto): Promise<Machine> {
    const machine = await this.machineModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!machine) throw new NotFoundException('Machine not found');
    return machine;
  }

  async remove(id: string): Promise<void> {
    const result = await this.machineModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Machine not found');
  }
}
