/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { MonitoringPointsController } from '../src/monitoring-points/monitoring-points.controller';
import { MonitoringPointsService } from '../src//monitoring-points/monitoring-points.service';

describe('MonitoringPointsController', () => {
  let controller: MonitoringPointsController;
  let service: MonitoringPointsService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitoringPointsController],
      providers: [
        {
          provide: MonitoringPointsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MonitoringPointsController>(
      MonitoringPointsController,
    );
    service = module.get<MonitoringPointsService>(MonitoringPointsService);
  });

  it('deve criar um MP', async () => {
    mockService.create.mockResolvedValue({ name: 'Criado' });
    const result = await controller.create({
      name: 'Criado',
      machineId: '1',
    });
    expect(result.name).toBe('Criado');
  });
});
