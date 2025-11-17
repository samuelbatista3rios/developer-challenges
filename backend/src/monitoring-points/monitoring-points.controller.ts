import {
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
  Get,
  Query,
  Delete,
  Post,
} from '@nestjs/common';
import { MonitoringPointsService } from './monitoring-points.service';
import { UpdateMonitoringPointDto } from './dto/update-monitoring-point.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMonitoringPointDto } from './dto/create-monitoring-point.dto';
import { AssignSensorDto } from './dto/assign-sensor.dto';

@Controller('monitoring-points')
@UseGuards(JwtAuthGuard)
export class MonitoringPointsController {
  constructor(private readonly mpService: MonitoringPointsService) {}

  @Post()
  create(@Body() dto: CreateMonitoringPointDto) {
    return this.mpService.create(dto);
  }

  @Post('assign-sensor')
  assignSensor(@Body() dto: AssignSensorDto) {
    return this.mpService.assignSensor(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mpService.remove(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMonitoringPointDto) {
    return this.mpService.update(id, dto);
  }

  @Get()
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('order') order?: 'asc' | 'desc',
  ) {
    const p = Math.max(1, Number(page ?? 1));
    const l = Math.max(1, Number(limit ?? 5));
    const { items, total } = await this.mpService.findAll(
      p,
      l,
      sortBy ?? 'name',
      order ?? 'asc',
    );

    return {
      data: items,
      page: p,
      limit: l,
      total,
    };
  }
}
